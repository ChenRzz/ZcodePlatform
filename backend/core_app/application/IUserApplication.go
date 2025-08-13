package application

import (
	"MScProject/core_app/domain/entities"
	"MScProject/core_app/domain/service"
	"MScProject/core_app/dto/request"
	"MScProject/core_app/infrastructure"
	"errors"
	"fmt"
	"gorm.io/gorm"
)

type IUserApplication interface {
	Register(username, password, email string) error
	Login(username, password string) (uint, uint64, error)
	LogOff(userid uint, password string) error
	ChangeUserPassword(userid uint, oldPassword, newPassword string) error
	AdminRestPassword(username string, newPassword string) error
	GetUserInfo(userid uint) (*request.UserinfoDTO, error)
	FindByUserZCode(userZcode uint64) (*entities.User, error)
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
		err := u.UserService.Register(tx, username, password, email)
		if err != nil {
			return err
		}
		sql := `select id from users where username=?`
		var userid uint
		err = tx.Raw(sql, username).Scan(&userid).Error
		if err != nil {
			return err
		}
		sql = `INSERT INTO user_role (user_id, role_id, created_at, is_delete)
		VALUES (?, ?, NOW(), 0)`
		err = tx.Exec(sql, userid, 4).Error
		if err != nil {
			fmt.Println("添加角色失败:", err)
			return err
		}
		return nil
	})
	return err
}
func (u *UserApplication) Login(username, password string) (uint, uint64, error) {
	db := infrastructure.GetDB()
	valid, err, uid, uzcode := u.UserService.Login(db, username, password)
	if err != nil {
		return 0, 0, err
	}
	if !valid {
		return 0, 0, errors.New("Incorrect username ot password")
	}
	return uid, uzcode, nil

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
func (u *UserApplication) GetUserInfo(userid uint) (*request.UserinfoDTO, error) {
	db := infrastructure.GetDB()
	userinfo, err := u.UserService.GetUserInfo(db, userid)
	if err != nil {
		return nil, err
	}
	return userinfo, nil
}

func (u *UserApplication) FindByUserZCode(userZcode uint64) (*entities.User, error) {
	db := infrastructure.GetDB()
	user, err := u.UserService.FindByUserZCode(db, userZcode)
	return user, err
}
