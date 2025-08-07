package service

import (
	"MScProject/core_app/domain/entities"
	"MScProject/core_app/domain/repository"
	"MScProject/core_app/dto/request"
	"MScProject/public_tools"
	"errors"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"regexp"
)

type IUserService interface {
	Register(db *gorm.DB, username, password, email string) error
	LogOff(db *gorm.DB, userid uint, password string) error
	Login(db *gorm.DB, username, password string) (bool, error, uint, uint64)
	ChangeUserPassword(db *gorm.DB, userid uint, oldPassword, newPassword string) error
	GetUserInfo(db *gorm.DB, userid uint) (*request.UserinfoDTO, error)
	AdminResetPassword(db *gorm.DB, username string, password string) error
	FindByUserZCode(db *gorm.DB, userZcode uint64) (*entities.User, error)
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
	Zcode, err := public_tools.Generate11DigitZCodeID()
	if err != nil {
		return err
	}
	var newUser = entities.User{Username: username, Password: string(hashPassword), Email: email, ZCodeID: Zcode}
	if err := u.UserRepository.CreateUser(db, &newUser); err != nil {
		return err
	}
	return nil
}

func (u *UserService) Login(db *gorm.DB, username, password string) (bool, error, uint, uint64) {
	usr, err := u.UserRepository.FindByUsername(db, username)
	if err != nil {
		return false, err, 0, 0
	}
	err = bcrypt.CompareHashAndPassword([]byte(usr.Password), []byte(password))
	if err != nil {
		return false, errors.New("Password is incorrect"), 0, 0
	}
	return true, nil, usr.ID, usr.ZCodeID
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

func (u *UserService) GetUserInfo(db *gorm.DB, userid uint) (*request.UserinfoDTO, error) {
	usr, err := u.UserRepository.FindByID(db, userid)
	if err != nil {
		return nil, err
	}
	var userinfo request.UserinfoDTO
	userinfo.UserID = usr.ID
	userinfo.UserEmail = usr.Email
	userinfo.UserZCode = usr.ZCodeID
	userinfo.UserName = usr.Username
	return &userinfo, nil
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

func (u *UserService) AdminResetPassword(db *gorm.DB, username string, password string) error {
	usr, err := u.UserRepository.FindByUsername(db, username)
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

func (u *UserService) FindByUserZCode(db *gorm.DB, userZcode uint64) (*entities.User, error) {
	usr, err := u.UserRepository.FindByZCode(db, userZcode)
	return usr, err
}
