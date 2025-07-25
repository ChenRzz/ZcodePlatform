package repository

import (
	"MScProject/user_management/domain/entity"
	"errors"
	"gorm.io/gorm"
	"time"
)

type IUserRepository interface {
	FindByUsername(db *gorm.DB, username string) (*entity.User, error)
	FindByID(db *gorm.DB, UserID uint) (*entity.User, error)
	FindByEmail(db *gorm.DB, UserEmail string) (*entity.User, error)
	CreateUser(db *gorm.DB, user *entity.User) error
	UpdateUser(db *gorm.DB, user *entity.User) error
	DeleteUser(db *gorm.DB, UserID uint) error
}

type UserRepoMsql struct {
}

func NewUserRepoMsql() *UserRepoMsql {
	return &UserRepoMsql{}
}

func (u *UserRepoMsql) FindByUsername(db *gorm.DB, username string) (*entity.User, error) {
	var usr entity.User
	err := db.Where("username = ?", username).First(&usr).Error
	if err != nil {
		return nil, errors.New("user not found")
	}
	return &usr, nil
}
func (u *UserRepoMsql) FindByID(db *gorm.DB, userID uint) (*entity.User, error) {
	var usr entity.User
	err := db.Where("ID = ?", userID).First(&usr).Error
	if err != nil {
		return nil, errors.New("user not found")
	}
	return &usr, nil
}
func (u *UserRepoMsql) FindByEmail(db *gorm.DB, UserEmail string) (*entity.User, error) {
	var usr entity.User
	err := db.Where("Email = ?", UserEmail).First(&usr).Error
	if err != nil {
		return nil, errors.New("user not found")
	}
	return &usr, nil
}
func (u *UserRepoMsql) CreateUser(db *gorm.DB, user *entity.User) error {
	err := db.Create(user).Error
	if err != nil {
		return errors.New("Failed to create user")
	}
	return nil
}
func (u *UserRepoMsql) UpdateUser(db *gorm.DB, user *entity.User) error {
	err := db.Save(user).Error
	if err != nil {
		return errors.New("Failed to Update user")
	}
	return nil
}
func (u *UserRepoMsql) DeleteUser(db *gorm.DB, UserID uint) error {
	var usr entity.User
	err := db.Model(usr).Updates(
		map[string]interface{}{
			"is_deleted": gorm.Expr("id"),
			"deleted_at": time.Now(),
		}).Error
	if err != nil {
		return errors.New("Failed to update user")
	}
	return nil
}
