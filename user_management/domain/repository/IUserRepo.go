package repository

import (
	"MScProject/user_management/domain/entities"
	"errors"
	"gorm.io/gorm"
	"time"
)

type IUserRepository interface {
	FindByUsername(db *gorm.DB, username string) (*entities.User, error)
	FindByID(db *gorm.DB, UserID uint) (*entities.User, error)
	FindByEmail(db *gorm.DB, UserEmail string) (*entities.User, error)
	CreateUser(db *gorm.DB, user *entities.User) error
	UpdateUser(db *gorm.DB, user *entities.User) error
	DeleteUser(db *gorm.DB, UserID uint) error
}

type UserRepoMsql struct {
}

func NewUserRepoMsql() *UserRepoMsql {
	return &UserRepoMsql{}
}

func (u *UserRepoMsql) FindByUsername(db *gorm.DB, username string) (*entities.User, error) {
	var usr entities.User
	err := db.Where("username = ?", username).First(&usr).Error
	if err != nil {
		return nil, errors.New("user not found")
	}
	return &usr, nil
}
func (u *UserRepoMsql) FindByID(db *gorm.DB, userID uint) (*entities.User, error) {
	var usr entities.User
	err := db.Where("ID = ?", userID).First(&usr).Error
	if err != nil {
		return nil, errors.New("user not found")
	}
	return &usr, nil
}
func (u *UserRepoMsql) FindByEmail(db *gorm.DB, UserEmail string) (*entities.User, error) {
	var usr entities.User
	err := db.Where("Email = ?", UserEmail).First(&usr).Error
	if err != nil {
		return nil, errors.New("user not found")
	}
	return &usr, nil
}
func (u *UserRepoMsql) CreateUser(db *gorm.DB, user *entities.User) error {
	err := db.Create(user).Error
	if err != nil {
		return errors.New("Failed to create user")
	}
	return nil
}
func (u *UserRepoMsql) UpdateUser(db *gorm.DB, user *entities.User) error {
	err := db.Save(user).Error
	if err != nil {
		return errors.New("Failed to Update user")
	}
	return nil
}
func (u *UserRepoMsql) DeleteUser(db *gorm.DB, UserID uint) error {
	var usr entities.User
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
