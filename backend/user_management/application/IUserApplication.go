package application

import (
	"MScProject/user_management/domain/service"
	"MScProject/user_management/infrastructure"
	"errors"
	"gorm.io/gorm"
)

type IUserApplication interface {
	Register(username, password, email string) error
	Login(username, password string) (uint, error)
	LogOff(userid uint, password string) error
	ChangeUserPassword(userid uint, oldPassword, newPassword string) error
	AdminRestPassword(username string, newPassword string) error
	GetUserInfo(userid uint) (username, email string, err error)
}

type UserApplication struct {
	UserService service.IUserService
}

func NewUserApplication(userService service.IUserService) *UserApplication {
	return &UserApplication{userService}
}

func (u *UserApplication) Register(username, password, email string) error {
	db := infrastructure.GetDB()
	err := db.Transaction(func(tx *gorm.DB) error {
		return u.UserService.Register(tx, username, password, email)
	})
	return err
}
func (u *UserApplication) Login(username, password string) (uint, error) {
	db := infrastructure.GetDB()
	valid, err, uid := u.UserService.Login(db, username, password)
	if err != nil {
		return 0, err
	}
	if !valid {
		return 0, errors.New("Incorrect username ot password")
	}
	return uid, nil

}
func (u *UserApplication) LogOff(userid uint, password string) error {
	db := infrastructure.GetDB()

	return db.Transaction(func(tx *gorm.DB) error {
		err := u.UserService.LogOff(tx, userid, password)
		if err != nil {
			return err
		}
		return nil
	})
}
func (u *UserApplication) ChangeUserPassword(userid uint, oldPassword, newPassword string) error {
	db := infrastructure.GetDB()
	return db.Transaction(func(tx *gorm.DB) error {
		err := u.UserService.ChangeUserPassword(tx, userid, oldPassword, newPassword)
		if err != nil {
			return err
		}
		return nil
	})
}
func (u *UserApplication) AdminRestPassword(username string, newPassword string) error {
	db := infrastructure.GetDB()
	return db.Transaction(func(tx *gorm.DB) error {
		err := u.UserService.AdminResetPassword(tx, username, newPassword)
		if err != nil {
			return err
		}
		return nil
	})

}
func (u *UserApplication) GetUserInfo(userid uint) (username, email string, err error) {
	db := infrastructure.GetDB()
	usernames, emails, err := u.UserService.GetUserInfo(db, userid)
	if err != nil {
		return "", "", err
	}
	return usernames, emails, nil
}
