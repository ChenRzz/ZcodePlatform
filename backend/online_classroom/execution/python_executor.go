package execution

import (
	"bytes"
	"context"
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"
)

type PythonExecutor struct{}

func NewPythonExecutor() *PythonExecutor {
	return &PythonExecutor{}
}

func (pe *PythonExecutor) Execute(code string, config ExecutionConfig) (*ExecutionResult, error) {
	startTime := time.Now()

	result := &ExecutionResult{
		ID:         generateExecutionID(),
		Code:       code,
		Language:   "python",
		ExecutedAt: startTime,
		Status:     "running",
	}

	if err := pe.validateCode(code); err != nil {
		result.Status = "failed"
		result.Error = fmt.Sprintf("Security violation: %v", err)
		result.DurationMS = time.Since(startTime).Milliseconds()
		return result, nil
	}

	tempFile, err := pe.createTempPythonFile(code)
	if err != nil {
		result.Status = "failed"
		result.Error = fmt.Sprintf("Failed to create temp file: %v", err)
		result.DurationMS = time.Since(startTime).Milliseconds()
		return result, nil
	}
	defer os.Remove(tempFile)

	output, execError, exitCode := pe.executeInDocker(tempFile, config)

	result.Output = output
	result.ExitCode = exitCode
	result.DurationMS = time.Since(startTime).Milliseconds()

	if execError != nil {
		result.Status = "failed"
		result.Error = execError.Error()
	} else {
		result.Status = "completed"
	}

	return result, nil
}

func (pe *PythonExecutor) createTempPythonFile(code string) (string, error) {
	tempDir := os.TempDir()
	log.Printf("DEBUG: Temp dir: %s", tempDir)

	fileName := fmt.Sprintf("python_exec_%s.py", generateExecutionID())
	filePath := filepath.Join(tempDir, fileName)
	log.Printf("DEBUG: File path: %s", filePath)
	log.Printf("DEBUG: Code to write: %s", code)

	err := os.WriteFile(filePath, []byte(code), 0644)
	if err != nil {
		log.Printf("ERROR: WriteFile failed: %v", err)
		return "", err
	}

	if stat, err := os.Stat(filePath); err != nil {
		log.Printf("ERROR: Stat failed: %v", err)
		return "", err
	} else {
		log.Printf("DEBUG: File created successfully: %s, IsDir: %v, Size: %d", filePath, stat.IsDir(), stat.Size())
	}

	return filePath, nil
}

func (pe *PythonExecutor) executeInDocker(filePath string, config ExecutionConfig) (string, error, int) {

	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(config.TimeoutSeconds)*time.Second)
	defer cancel()

	fileName := filepath.Base(filePath)

	dockerArgs := []string{
		"run",
		"--rm",
		"--network", "none",
		"--read-only",
		"--tmpfs", "/tmp:rw,noexec,nosuid,size=10m",
		"--user", "nobody",
		"--cap-drop", "ALL",
		"--security-opt", "no-new-privileges",
	}

	if config.MemoryLimitMB > 0 {
		dockerArgs = append(dockerArgs, "--memory", fmt.Sprintf("%dm", config.MemoryLimitMB))
	}
	if config.CPULimit > 0 {
		dockerArgs = append(dockerArgs, "--cpus", fmt.Sprintf("%.2f", config.CPULimit))
	}

	dockerArgs = append(dockerArgs,
		"-v", fmt.Sprintf("%s:/app/%s:ro", filePath, fileName),
		"python:3.11-alpine",
		"python", fmt.Sprintf("/app/%s", fileName),
	)

	cmd := exec.CommandContext(ctx, "docker", dockerArgs...)

	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	err := cmd.Run()

	output := stdout.String()
	if stderr.Len() > 0 {
		if output != "" {
			output += "\n--- STDERR ---\n"
		}
		output += stderr.String()
	}

	exitCode := 0
	if err != nil {
		if exitError, ok := err.(*exec.ExitError); ok {
			exitCode = exitError.ExitCode()
		} else {
			exitCode = -1
			if ctx.Err() == context.DeadlineExceeded {
				return output, fmt.Errorf("execution timeout after %d seconds", config.TimeoutSeconds), exitCode
			}
		}
	}

	return output, err, exitCode
}

func (pe *PythonExecutor) validateCode(code string) error {

	if len(code) > 50000 {
		return fmt.Errorf("code too long (max 50KB)")
	}

	if strings.TrimSpace(code) == "" {
		return fmt.Errorf("empty code")
	}

	extremelyDangerousPatterns := []string{
		"while True:",
		"for i in range(1000000):",
	}

	lowerCode := strings.ToLower(code)
	for _, pattern := range extremelyDangerousPatterns {
		if strings.Contains(lowerCode, pattern) {
			return fmt.Errorf("potentially resource-intensive code detected: %s", pattern)
		}
	}

	return nil
}

func (pe *PythonExecutor) CheckDockerAvailable() error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cmd := exec.CommandContext(ctx, "docker", "--version")
	err := cmd.Run()
	if err != nil {
		return fmt.Errorf("docker is not available: %v", err)
	}

	cmd = exec.CommandContext(ctx, "docker", "image", "inspect", "python:3.11-alpine")
	err = cmd.Run()
	if err != nil {
		return fmt.Errorf("python:3.11-alpine image not found, please run: docker pull python:3.11-alpine")
	}

	return nil
}

func generateExecutionID() string {
	return fmt.Sprintf("exec_%d_%d", time.Now().Unix(), time.Now().Nanosecond())
}
