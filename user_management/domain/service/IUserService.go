package service

import (
	"MScProject/user_management/domain/entity"
	"MScProject/user_management/domain/repository"
	"errors"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"regexp"
)

type IUserService interface {
	Register(db *gorm.DB, username, password, email string) error
	LogOff(db *gorm.DB, userid uint, password string) error
	Login(db *gorm.DB, username, password string) (bool, error, uint)
	ChangeUserPassword(db *gorm.DB, userid uint, oldPassword, newPassword string) error
	GetUserInfo(db *gorm.DB, userid uint) (username, email string, err error)
	AdminResetPassword(db *gorm.DB, userid uint, password string) error
}

type UserService struct {
	UserRepository repository.IUserRepository
}

func NewUserService(userRepository repository.IUserRepository) *UserService {
	return &UserService{userRepository}
}

func (u *UserService) Register(db *gorm.DB, username, password, email string) error {
	userRegex := `^[a-zA-Z0-9]+$`
	matched, err := regexp.MatchString(userRegex, username)
	if err != nil || !matched {
		return errors.New("UsernameInfo should only contain a-z, A-Z and 0-9")
	}
	usr, _ := u.UserRepository.FindByUsername(db, username)
	if usr != nil {
		return errors.New("UsernameInfo has already been used")
	}
	passwordRegex := `^[a-zA-Z0-9]+$`
	matched, err = regexp.MatchString(passwordRegex, password)
	if err != nil || !matched {
		return errors.New("Password should only contain a-z, A-Z and 0-9")
	}
	hashPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	var newUser = entity.User{Username: username, Password: string(hashPassword), Email: email}
	if err := u.UserRepository.CreateUser(db, &newUser); err != nil {
		return err
	}
	return nil
}

func (u *UserService) Login(db *gorm.DB, username, password string) (bool, error, uint) {
	usr, err := u.UserRepository.FindByUsername(db, username)
	if err != nil {
		return false, err, 0
	}
	err = bcrypt.CompareHashAndPassword([]byte(usr.Password), []byte(password))
	if err != nil {
		return false, errors.New("Password is incorrect"), 0
	}
	return true, nil, usr.ID
}

func (u *UserService) ChangeUserPassword(db *gorm.DB, userid uint, oldPassword, newPassword string) error {
	usr, err := u.UserRepository.FindByID(db, userid)
	if err != nil {
		return err
	}
	err = bcrypt.CompareHashAndPassword([]byte(usr.Password), []byte(oldPassword))
	if err != nil {
		return errors.New("Please enter correct password")
	}
	passwordRegex := `^[a-zA-Z0-9]+$`
	matched, err := regexp.MatchString(passwordRegex, newPassword)
	if err != nil || !matched {
		return errors.New("New password should only contain a-z, A-Z and 0-9")
	}
	hashPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	usr.Password = string(hashPassword)
	err = u.UserRepository.UpdateUser(db, usr)
	if err != nil {
		return err
	}
	return nil
}

func (u *UserService) GetUserInfo(db *gorm.DB, userid uint) (username, email string, err error) {
	usr, err := u.UserRepository.FindByID(db, userid)
	if err != nil {
		return "", "", err
	}
	return usr.Username, usr.Email, nil
}
func (u *UserService) LogOff(db *gorm.DB, userid uint, password string) error {
	usr, err := u.UserRepository.FindByID(db, userid)
	if err != nil {
		return err
	}
	err = bcrypt.CompareHashAndPassword([]byte(usr.Password), []byte(password))
	if err != nil {
		return errors.New("Please enter correct password")
	}
	err = u.UserRepository.DeleteUser(db, userid)
	if err != nil {
		return err
	}
	return nil
}

func (u *UserService) AdminResetPassword(db *gorm.DB, userid uint, password string) error {
	usr, err := u.UserRepository.FindByID(db, userid)
	if err != nil {
		return err
	}
	passwordRegex := `^[a-zA-Z0-9]+$`
	matched, err := regexp.MatchString(passwordRegex, password)
	if err != nil || !matched {
		return errors.New("Password should only contain a-z, A-Z and 0-9")
	}
	hashPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	usr.Password = string(hashPassword)
	err = u.UserRepository.UpdateUser(db, usr)
	return err
}
