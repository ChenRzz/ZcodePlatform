package entity

import (
	"MScProject/base"
)

type User struct {
	base.BaseEntity
	Username string `gorm:"size:100;unique"`
	Password string `gorm:"size:255"`
	Email    string `gorm:"size:100;unique"`
}
