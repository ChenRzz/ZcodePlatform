package response

import (
	"time"
)

type ClassInfo struct {
	ClassID             uint       `json:"class_id"`
	CreatedAt           *time.Time `json:"created_at"`
	ClassName           string     `json:"class_name"`
	ClassCode           string     `json:"class_code"`
	ClassDescription    string     `json:"class_description"`
	ClassManagerZCodeID uint64     `json:"class_manager_z_code_id"`
	ClassManagerName    string     `json:"class_manager_name"`
}

type LectureInfo struct {
	LectureID          uint       `json:"lecture_id"`
	CreatedAt          *time.Time `json:"created_at"`
	LectureName        string     `json:"lecture_name"`
	LectureDescription string     `json:"lecture_description"`
	ClassID            uint       `json:"class_id"`
	StartTime          *time.Time `json:"start_time"`
	EndTime            *time.Time `json:"end_time"`
	LecturerZCodeID    uint64     `json:"lecturer_z_code_id"`
	LecturerName       string     `json:"lecturer_name"`
}
type ClassParticipantInfo struct {
	ClassParticipantID uint   `json:"class_participant_id"`
	ClassID            uint   `json:"class_id"`
	ClassName          string `json:"class_name"`
	UserZCodeID        uint64 `json:"user_zcode_id"`
	Username           string `json:"username"`
	UserRole           string `json:"user_role"`
}

type UserJoinedClassesInfo struct {
	ClassParticipantID uint       `json:"class_participant_id"`
	ClassID            uint       `json:"class_id"`
	ClassName          uint       `json:"class_name"`
	ClassCode          string     `json:"class_code"`
	ClassManagerName   string     `json:"class_manager_name"`
	CreatedAt          *time.Time `json:"created_at"`
}
