package entities

import (
	"time"
)

type Class struct {
	BaseEntity
	ClassName           string `gorm:"size:255"`
	ClassCode           string `gorm:"size:10;unique"`
	ClassDescription    string `gorm:"type:text"`
	ClassManagerZCodeID uint64
	ClassManagerName    string
}

type Lecture struct {
	BaseEntity
	LectureName        string `gorm:"size:255"`
	LectureDescription string `gorm:"type:text"`
	ClassID            uint
	StartTime          *time.Time
	EndTime            *time.Time
	LecturerZCodeID    uint64
	LecturerName       string `gorm:"size 255"`
}

type ClassParticipants struct {
	BaseEntity
	ClassID     uint `gorm:"primaryKey"`
	ClassName   string
	UserZCodeID uint64 `gorm:"primaryKey"`
	Username    string
	UserRole    string `gorm:"primaryKey"`
}
