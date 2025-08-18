package execution

import (
	"time"
)

type ExecutionRequest struct {
	LectureID   uint   `json:"lecture_id" binding:"required"`
	UserZCode   string `json:"user_zcode" binding:"required"`
	Code        string `json:"code" binding:"required"`
	Language    string `json:"language" binding:"required"`
	DocumentKey string `json:"document_key"`
}

type ExecutionResult struct {
	ID         string    `json:"id"`
	LectureID  uint      `json:"lecture_id"`
	UserZCode  string    `json:"user_zcode"`
	Code       string    `json:"code"`
	Language   string    `json:"language"`
	Output     string    `json:"output"`
	Error      string    `json:"error,omitempty"`
	ExitCode   int       `json:"exit_code"`
	DurationMS int64     `json:"duration_ms"`
	ExecutedAt time.Time `json:"executed_at"`
	Status     string    `json:"status"` // "running", "completed", "failed", "timeout"
}

type ExecutionConfig struct {
	TimeoutSeconds int     `json:"timeout_seconds"`
	MemoryLimitMB  int     `json:"memory_limit_mb"`
	CPULimit       float64 `json:"cpu_limit"`
	NetworkAccess  bool    `json:"network_access"`
}

var DefaultExecutionConfig = ExecutionConfig{
	TimeoutSeconds: 10,
	MemoryLimitMB:  128,
	CPULimit:       0.5,
	NetworkAccess:  false,
}

var TeacherExecutionConfig = ExecutionConfig{
	TimeoutSeconds: 30,
	MemoryLimitMB:  256,
	CPULimit:       1.0,
	NetworkAccess:  false,
}

type Executor interface {
	Execute(code string, config ExecutionConfig) (*ExecutionResult, error)
}
