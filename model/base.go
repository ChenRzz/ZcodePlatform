package model

import "time"

type BaseEntity struct {
	ID        uint `gorm:"primaryKey"`
	CreatedAt time.Time
	IsDelete  bool
	DeletedAt time.Time
}
