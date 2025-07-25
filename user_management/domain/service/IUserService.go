package service

import (
	"MScProject/user_management/domain/entity"
	"MScProject/user_management/domain/repository"
	"errors"
	"golang.org/x/crypto/bcrypt"
	"regexp"
)

type IUserService interface {
	Register(username, password, email string) error
	LogOff(userid int, password string) (bool, error)
	Login(username, password string) (uint, error)
	ChangeUserPassword(userid uint, oldPassword, newPassword string) error
	GetUserInfo(userid uint) (username, email string, err error)
	AdminResetPassword(userid uint, password string) error
}

type UserService struct {
	UserRepository repository.IUserRepository
}

func NewUserService(userRepository repository.IUserRepository) *UserService {
	return &UserService{userRepository}
}

func (u *UserService) Register(username, password, email string) error {
	userRegex := `^[a-zA-Z0-9]+$`
	matched, err := regexp.MatchString(userRegex, username)
	if err != nil || !matched {
		return errors.New("Username should only contain a-z, A-Z and 0-9")
	}
	usr, _ := u.UserRepository.FindByUsername(username)
	if usr != nil {
		return errors.New("Username has already been used")
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
	if err := u.UserRepository.CreateUser(&newUser); err != nil {
		return err
	}
	return nil
}

func (u *UserService) Login(username, password string) (uint, error) {
	usr, err := u.UserRepository.FindByUsername(username)
	if err != nil {
		return 0, err
	}
	err = bcrypt.CompareHashAndPassword([]byte(usr.Password), []byte(password))
	if err != nil {
		return 0, errors.New("Password is incorrect")
	}
	return usr.ID, nil
}

func (u *UserService) ChangeUserPassword(userid uint, oldPassword, newPassword string) error {
	usr, err := u.UserRepository.FindByID(userid)
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
	err = u.UserRepository.UpdateUser(usr)
	if err != nil {
		return err
	}
	return nil
}

func (u *UserService) GetUserInfo(userid uint) (username, email string, err error) {
	usr, err := u.UserRepository.FindByID(userid)
	if err != nil {
		return "", "", err
	}
	return usr.Username, usr.Email, nil
}
func (u *UserService) LogOff(userid uint, password string) (bool, error) {
	usr, err := u.UserRepository.FindByID(userid)
	if err != nil {
		return false, err
	}
	err = bcrypt.CompareHashAndPassword([]byte(usr.Password), []byte(password))
	if err != nil {
		return false, errors.New("Please enter correct password")
	}
	err = u.UserRepository.DeleteUser(userid)
	if err != nil {
		return false, err
	}
	return true, nil
}

func (u *UserService) AdminResetPassword(userid uint, password string) error {
	usr, err := u.UserRepository.FindByID(userid)
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
	err = u.UserRepository.UpdateUser(usr)
	return err
}
