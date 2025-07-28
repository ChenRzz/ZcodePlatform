package entities

import (
	"time"
)

type Class struct {
	BaseEntity
	ClassName        string `gorm:"size:255;unique"`
	ClassDescription string
	ClassManagerID   uint
}

type Lecture struct {
	BaseEntity
	LectureName        string `gorm:"size:255"`
	LectureDescription string
	ClassID            uint
	StartTime          time.Time
	EndTime            time.Time
	LecturerID         uint
}

type ClassStudent struct {
	ClassID uint `gorm:"primaryKey"`
	UserID  uint `gorm:"primaryKey"`
}
