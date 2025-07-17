package model

type User struct {
	BaseEntity
	Username string `gorm:"size:100;unique"`
	Password string `gorm:"size:255"`
	Email    string `gorm:"size:100;unique"`

	Roles        []Role `gorm:"many2many:user_roles"`
	Lectures     []Lecture
	Classes      []Class `gorm:"many2many:class_students"`
	CodeSnippets []CodeSnippet
}

type Role struct {
	ID       uint   `gorm:"primaryKey"`
	RoleName string `gorm:"size:100;unique"`

	Users []User `gorm:"many2many:user_roles"`
	Auths []Auth `gorm:"many2many:role_auths"`
}

type Auth struct {
	ID       uint   `gorm:"primaryKey"`
	AuthName string `gorm:"size:255；unique"`

	Roles []Role `gorm:"many2many:role_auths"`
}

type UserRole struct {
	UserID uint `gorm:"primaryKey"`
	RoleID uint `gorm:"primaryKey"`
}
type RoleAuth struct {
	RoleID uint `gorm:"primaryKey"`
	AuthID uint `gorm:"primaryKey"`
}
