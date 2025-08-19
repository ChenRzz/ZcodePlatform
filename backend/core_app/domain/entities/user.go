package entities

type User struct {
	BaseEntity
	Username string `gorm:"size:100;unique"`
	Password string `gorm:"size:255"`
	Email    string `gorm:"size:100;unique"`
	ZCodeID  uint64 `gorm:"unique"`
}

func (User) TableName() string {
	return "users"
}
