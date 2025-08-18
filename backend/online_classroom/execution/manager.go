package execution

import (
	"fmt"
	"log"
	"sync"
	"time"
)

type ExecutionManager struct {
	executor Executor
	results  map[string]*ExecutionResult
	mutex    sync.RWMutex
}

var GlobalExecutionManager *ExecutionManager

func init() {
	executor := NewPythonExecutor()

	if err := executor.CheckDockerAvailable(); err != nil {
		log.Printf("WARNING: Docker environment check failed: %v", err)
		log.Printf("Python code execution may not work properly")
	} else {
		log.Printf("Docker environment check passed")
	}

	GlobalExecutionManager = &ExecutionManager{
		executor: executor,
		results:  make(map[string]*ExecutionResult),
	}
}

func (em *ExecutionManager) ExecuteCode(req ExecutionRequest, userRole string) (*ExecutionResult, error) {
	var config ExecutionConfig
	if userRole == "teacher" {
		config = TeacherExecutionConfig
	} else {
		config = DefaultExecutionConfig
	}

	result := &ExecutionResult{
		ID:         generateExecutionID(),
		LectureID:  req.LectureID,
		UserZCode:  req.UserZCode,
		Code:       req.Code,
		Language:   req.Language,
		Status:     "running",
		ExecutedAt: time.Now(),
	}

	em.mutex.Lock()
	em.results[result.ID] = result
	em.mutex.Unlock()

	execResult, err := em.executor.Execute(req.Code, config)

	em.mutex.Lock()
	defer em.mutex.Unlock()

	if err != nil {
		result.Status = "failed"
		result.Error = err.Error()
	} else {
		result.Status = execResult.Status
		result.Output = execResult.Output
		result.Error = execResult.Error
		result.ExitCode = execResult.ExitCode
	}

	result.DurationMS = time.Since(result.ExecutedAt).Milliseconds()

	return result, nil
}

func (em *ExecutionManager) GetResult(id string) (*ExecutionResult, error) {
	em.mutex.RLock()
	defer em.mutex.RUnlock()

	if result, exists := em.results[id]; exists {
		return result, nil
	}

	return nil, fmt.Errorf("execution result not found")
}
