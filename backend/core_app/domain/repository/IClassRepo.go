package repository

import (
	"MScProject/core_app/domain/entities"
	"errors"
	"gorm.io/gorm"
)

type IClassRepo interface {
	CreateClass(db *gorm.DB, class *entities.Class) error
	UpdateClass(db *gorm.DB, class *entities.Class) error
	DeleteClass(db *gorm.DB, classID uint) error
	FindClassByID(db *gorm.DB, classID uint) (*entities.Class, error)
	FindClassByClassCode(db *gorm.DB, classCode string) (*entities.Class, error)

	CreateLecture(db *gorm.DB, lecture *entities.Lecture) error
	UpdateLecture(db *gorm.DB, lecture *entities.Lecture) error
	DeleteLecture(db *gorm.DB, lectureID uint) error
	FindLectureByLectureID(db *gorm.DB, lectureID uint) (*entities.Lecture, error)
	FindLectureByClassID(db *gorm.DB, classID uint) ([]*entities.Lecture, error)

	AddClassParticipant(db *gorm.DB, classParticipant *entities.ClassParticipants) error
	UpdateClassParticipant(db *gorm.DB, classParticipant *entities.ClassParticipants) error
	DeleteClassParticipant(db *gorm.DB, classParticipantID uint) error
	FindClassParticipantByID(db *gorm.DB, classParticipantID uint) (*entities.ClassParticipants, error)
	FindParticipantsByClassID(db *gorm.DB, classID uint) ([]*entities.ClassParticipants, error)
	FindClassByParticipantsZCodeID(db *gorm.DB, participantZCodeID uint64) ([]*entities.ClassParticipants, error)
}

type ClassRepo struct {
}

func NewClassRepo() *ClassRepo {
	return &ClassRepo{}
}

func (c *ClassRepo) CreateClass(db *gorm.DB, class *entities.Class) error {
	err := db.Create(class).Error
	if err != nil {
		return errors.New("Database: failed to create the class")
	}
	return nil
}

func (c *ClassRepo) UpdateClass(db *gorm.DB, class *entities.Class) error {
	err := db.Save(class).Error
	if err != nil {
		return errors.New("Database: failed to update the classs")
	}
	return nil
}
func (c *ClassRepo) DeleteClass(db *gorm.DB, classID uint) error {
	err := db.Delete(&entities.Class{}, classID).Error
	if err != nil {
		return errors.New("Database: failde to delete the class")
	}
	return nil
}
func (c *ClassRepo) FindClassByID(db *gorm.DB, classID uint) (*entities.Class, error) {
	var cls entities.Class
	err := db.Where("ID=?", classID).First(&cls).Error
	if err != nil {
		return nil, errors.New("Database:class not found")
	}
	return &cls, nil
}
func (c *ClassRepo) FindClassByClassCode(db *gorm.DB, classCode string) (*entities.Class, error) {
	var cls entities.Class
	err := db.Where("ClassCode=?", classCode).First(&cls).Error
	if err != nil {
		return nil, errors.New("Database:class not found")
	}
	return &cls, nil
}

func (c *ClassRepo) CreateLecture(db *gorm.DB, lecture *entities.Lecture) error {
	err := db.Create(lecture).Error
	if err != nil {
		return errors.New("DataBase:Failed to create the lecture")
	}
	return nil
}
func (c *ClassRepo) UpdateLecture(db *gorm.DB, lecture *entities.Lecture) error {
	err := db.Save(lecture).Error
	if err != nil {
		return errors.New("DataBase: Failed to update the lecture")
	}
	return nil

}
func (c *ClassRepo) DeleteLecture(db *gorm.DB, lectureID uint) error {
	err := db.Delete(&entities.Lecture{}, lectureID).Error
	if err != nil {
		return errors.New("DataBase:Failed to delete the lecture")
	}
	return nil
}
func (c *ClassRepo) FindLectureByLectureID(db *gorm.DB, lectureID uint) (*entities.Lecture, error) {
	var lecture entities.Lecture
	err := db.Where("ID=?", lectureID).First(&lecture).Error
	if err != nil {
		return nil, errors.New("Database: lecture not found")
	}
	return &lecture, nil
}

func (c *ClassRepo) FindLectureByClassID(db *gorm.DB, classID uint) ([]*entities.Lecture, error) {
	var lectures []*entities.Lecture
	err := db.Where("ClassID=?", classID).Find(&lectures).Error
	if err != nil {
		return nil, errors.New("Database:failed to find lecture")
	}
	return lectures, nil
}

func (c *ClassRepo) AddClassParticipant(db *gorm.DB, classParticipant *entities.ClassParticipants) error {
	err := db.Create(classParticipant).Error
	if err != nil {
		return errors.New("Database: failed to add user to class")
	}
	return nil
}
func (c *ClassRepo) DeleteClassParticipant(db *gorm.DB, classParticipantID uint) error {
	err := db.Delete(&entities.ClassParticipants{}, classParticipantID).Error
	if err != nil {
		return errors.New("Database: failed to logoff user from the class")
	}
	return nil
}
func (c *ClassRepo) UpdateClassParticipant(db *gorm.DB, classParticipant *entities.ClassParticipants) error {
	err := db.Save(classParticipant).Error
	if err != nil {
		return errors.New("Database: failed to update relationship between class and participant")
	}
	return nil
}
func (c *ClassRepo) FindClassParticipantByID(db *gorm.DB, classParticipantID uint) (*entities.ClassParticipants, error) {
	var classparticipant entities.ClassParticipants
	err := db.Where("ID=?", classParticipantID).First(&classparticipant).Error
	if err != nil {
		return nil, errors.New("Database: Failed to find the record")
	}
	return &classparticipant, nil

}
func (c *ClassRepo) FindParticipantsByClassID(db *gorm.DB, classID uint) ([]*entities.ClassParticipants, error) {
	var classparticipants []*entities.ClassParticipants
	err := db.Where("ClassID=?", classID).Find(&classparticipants).Error
	if err != nil {
		return nil, errors.New("Database: failed to find participants")
	}
	return classparticipants, nil

}
func (c *ClassRepo) FindClassByParticipantsZCodeID(db *gorm.DB, participantZCodeID uint64) ([]*entities.ClassParticipants, error) {
	var classparticipants []*entities.ClassParticipants
	err := db.Where("UserZCodeID=?", participantZCodeID).Find(&classparticipants).Error
	if err != nil {
		return nil, errors.New("Database: failed to find class")
	}
	return classparticipants, nil
}
