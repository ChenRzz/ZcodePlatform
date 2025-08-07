package entities

import (
	"time"
)

type Class struct {
	BaseEntity
	ClassName           string `gorm:"size:255" json:"class_name"`
	ClassCode           string `gorm:"size:10;unique" json:"class_code"`
	ClassDescription    string `gorm:"type:text" json:"class_description"`
	ClassManagerZCodeID uint64 `json:"class_manager_zcode_id"`
	ClassManagerName    string `json:"class_manager_name"`
}

type Lecture struct {
	BaseEntity
	LectureName        string     `gorm:"size:255" json:"lecture_name"`
	LectureDescription string     `gorm:"type:text" json:"lecture_description"`
	ClassID            uint       `json:"class_id"`
	StartTime          *time.Time `json:"start_time"`
	EndTime            *time.Time `json:"end_time"`
	LecturerZCodeID    uint64     `json:"lecturer_zcode_id"`
	LecturerName       string     `gorm:"size 255" json:"lecturer_name"`
}

type ClassParticipants struct {
	BaseEntity
	ClassID     uint   `json:"class_id"`
	ClassName   string `json:"class_name"`
	UserZCodeID uint64 `json:"user_zcode_id"`
	Username    string `json:"username"`
	UserRole    string `json:"user_role"`
}
