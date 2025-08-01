package entities

import "time"

type BaseEntity struct {
	ID        uint       `gorm:"primaryKey" json:"id"`
	CreatedAt *time.Time `json:"created_at"`
	IsDelete  bool       `json:"is_delete"`
	DeletedAt *time.Time `json:"deleted_at"`
}
