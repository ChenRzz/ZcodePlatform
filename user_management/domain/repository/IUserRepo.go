package repository

import (
	"MScProject/user_management/domain/entity"
	"errors"
	"gorm.io/gorm"
	"time"
)

type IUserRepository interface {
	FindByUsername(username string) (*entity.User, error)
	FindByID(UserID uint) (*entity.User, error)
	FindByEmail(UserEmail string) (*entity.User, error)
	CreateUser(user *entity.User) error
	UpdateUser(user *entity.User) error
	DeleteUser(UserID uint) error
}

type UserRepoMsql struct {
	db *gorm.DB
}

func NewUserRepoMsql(db *gorm.DB) *UserRepoMsql {
	return &UserRepoMsql{db}
}

func (u *UserRepoMsql) FindByUsername(username string) (*entity.User, error) {
	var usr entity.User
	err := u.db.Where("username = ?", username).First(&usr).Error
	if err != nil {
		return nil, errors.New("user not found")
	}
	return &usr, nil
}
func (u *UserRepoMsql) FindByID(userID uint) (*entity.User, error) {
	var usr entity.User
	err := u.db.Where("ID = ?", userID).First(&usr).Error
	if err != nil {
		return nil, errors.New("user not found")
	}
	return &usr, nil
}
func (u *UserRepoMsql) FindByEmail(UserEmail string) (*entity.User, error) {
	var usr entity.User
	err := u.db.Where("Email = ?", UserEmail).First(&usr).Error
	if err != nil {
		return nil, errors.New("user not found")
	}
	return &usr, nil
}
func (u *UserRepoMsql) CreateUser(user *entity.User) error {
	err := u.db.Create(user).Error
	if err != nil {
		return errors.New("Failed to create user")
	}
	return nil
}
func (u *UserRepoMsql) UpdateUser(user *entity.User) error {
	err := u.db.Save(user).Error
	if err != nil {
		return errors.New("Failed to Update user")
	}
	return nil
}
func (u *UserRepoMsql) DeleteUser(UserID uint) error {
	var usr entity.User
	err := u.db.Model(usr).Updates(
		map[string]interface{}{
			"is_deleted": gorm.Expr("id"),
			"deleted_at": time.Now(),
		}).Error
	if err != nil {
		return errors.New("Failed to update user")
	}
	return nil
}
