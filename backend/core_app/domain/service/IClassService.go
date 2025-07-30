package service

import (
	"MScProject/core_app/domain/entities"
	"MScProject/core_app/domain/repository"
	"gorm.io/gorm"
	"time"
)

type IClassService interface {
	CreateClass(db *gorm.DB, className string, classCode string, classDescription string, classManagerZCodeID uint64) error
	DeleteClass(db *gorm.DB, classID uint) error
	UpdateClassInfo(db *gorm.DB, classID uint, className string, classCode string, classDescription string, classManagerZCodeID uint64) error
	FindClassByID(db *gorm.DB, classID uint) (*entities.Class, error)
	FindClassByClassCode(db *gorm.DB, classCode string) (*entities.Class, error)

	CreateLecture(db *gorm.DB, ClassID uint, LectureName string, LectureDescription string,
		StartTime *time.Time, EndTime *time.Time, LecturerZCodeID uint64) error
	DeleteLecture(db *gorm.DB, LectureID uint) error
	UpdateLectureInfo(db *gorm.DB, LectureID uint, ClassID uint, LectureName string, LectureDescription string,
		StartTime *time.Time, EndTime *time.Time, LecturerZCodeID uint64) error
	FindLectureByLectureID(db *gorm.DB, LectureID uint) (*entities.Lecture, error)
	FindLecturesByClassID(db *gorm.DB, ClassID uint) ([]*entities.Lecture, error)

	AddParticipantToClass(db *gorm.DB, ClassID uint, ClassName string, UserZCodeID uint64, Username string, UserRole string) error
	DeleteParticipantFromClass(db *gorm.DB, ClassParticipantsID uint) error
	SetRoleForParticipant(db *gorm.DB, classParticipantsID uint, Role string) error
	FindClassesByParticipantZCodeID(db *gorm.DB, UserZCodeID uint64) ([]*entities.ClassParticipants, error)
	FindParticipantsByClassID(db *gorm.DB, ClassID uint) ([]*entities.ClassParticipants, error)
}

type ClassService struct {
	ClassRepo repository.IClassRepo
}

func NewClassService(ClassRepo repository.IClassRepo) *ClassService {
	return &ClassService{ClassRepo: ClassRepo}
}

func (c *ClassService) CreateClass(db *gorm.DB, className string, classCode string, classDescription string, classManagerZCodeID uint64) error {
	var newClass = entities.Class{ClassName: className, ClassCode: classCode, ClassDescription: classDescription, ClassManagerZCodeID: classManagerZCodeID}
	err := c.ClassRepo.CreateClass(db, &newClass)
	if err != nil {
		return err
	}
	return nil
}
func (c *ClassService) DeleteClass(db *gorm.DB, classID uint) error {
	err := c.ClassRepo.DeleteClass(db, classID)
	if err != nil {
		return err
	}
	return nil
}
func (c *ClassService) UpdateClassInfo(db *gorm.DB, classID uint, className string, classCode string, classDescription string, classManagerZCodeID uint64) error {
	class, err := c.ClassRepo.FindClassByID(db, classID)
	if err != nil {
		return err
	}
	class.ClassName = className
	class.ClassCode = classCode
	class.ClassDescription = classDescription
	class.ClassManagerZCodeID = classManagerZCodeID
	err = c.ClassRepo.UpdateClass(db, class)
	if err != nil {
		return err
	}
	return nil
}
func (c *ClassService) FindClassByID(db *gorm.DB, classID uint) (*entities.Class, error) {
	class, err := c.ClassRepo.FindClassByID(db, classID)
	if err != nil {
		return nil, err
	}
	return class, nil
}
func (c *ClassService) FindClassByClassCode(db *gorm.DB, classCode string) (*entities.Class, error) {
	class, err := c.ClassRepo.FindClassByClassCode(db, classCode)
	if err != nil {
		return nil, err
	}
	return class, nil
}

func (c *ClassService) CreateLecture(db *gorm.DB, ClassID uint, LectureName string, LectureDescription string,
	StartTime *time.Time, EndTime *time.Time, LecturerZCodeID uint64) error {
	var lecture = entities.Lecture{ClassID: ClassID, LectureName: LectureName, LectureDescription: LectureDescription,
		StartTime: StartTime, EndTime: EndTime, LecturerZCodeID: LecturerZCodeID}
	err := c.ClassRepo.CreateLecture(db, &lecture)
	if err != nil {
		return err
	}
	return nil
}
func (c *ClassService) DeleteLecture(db *gorm.DB, LectureID uint) error {
	err := c.ClassRepo.DeleteLecture(db, LectureID)
	if err != nil {
		return err
	}
	return nil
}
func (c *ClassService) UpdateLectureInfo(db *gorm.DB, LectrueID uint, ClassID uint, LectureName string, LectureDescription string,
	StartTime *time.Time, EndTime *time.Time, LecturerZCodeID uint64) error {
	lecture, err := c.ClassRepo.FindLectureByLectureID(db, LectrueID)
	if err != nil {
		return nil
	}
	lecture.ClassID = ClassID
	lecture.LectureName = LectureName
	lecture.LectureDescription = LectureDescription
	lecture.StartTime = StartTime
	lecture.EndTime = EndTime
	lecture.LecturerZCodeID = LecturerZCodeID
	err = c.ClassRepo.UpdateLecture(db, lecture)
	if err != nil {
		return err
	}
	return nil
}
func (c *ClassService) FindLectureByLectureID(db *gorm.DB, LectureID uint) (*entities.Lecture, error) {
	lecture, err := c.ClassRepo.FindLectureByLectureID(db, LectureID)
	if err != nil {
		return nil, err
	}
	return lecture, nil

}
func (c *ClassService) FindLecturesByClassID(db *gorm.DB, ClassID uint) ([]*entities.Lecture, error) {
	lectures, err := c.ClassRepo.FindLectureByClassID(db, ClassID)
	if err != nil {
		return nil, err
	}
	return lectures, nil
}

func (c *ClassService) AddParticipantToClass(db *gorm.DB, ClassID uint, ClassName string, UserZCodeID uint64, Username string, UserRole string) error {
	var classParticipant = entities.ClassParticipants{ClassID: ClassID, ClassName: ClassName, UserZCodeID: UserZCodeID, Username: Username, UserRole: UserRole}
	err := c.ClassRepo.AddClassParticipant(db, &classParticipant)
	if err != nil {
		return err
	}
	return nil
}
func (c *ClassService) DeleteParticipantFromClass(db *gorm.DB, ClassParticipantsID uint) error {
	err := c.ClassRepo.DeleteClassParticipant(db, ClassParticipantsID)
	if err != nil {
		return err
	}
	return nil
}

func (c *ClassService) SetRoleForParticipant(db *gorm.DB, classParticipantsID uint, Role string) error {
	classparticipant, err := c.ClassRepo.FindClassParticipantByID(db, classParticipantsID)
	if err != nil {
		return err
	}
	classparticipant.UserRole = Role
	err = c.ClassRepo.UpdateClassParticipant(db, classparticipant)
	return err
}

func (c *ClassService) FindClassesByParticipantZCodeID(db *gorm.DB, UserZCodeID uint64) ([]*entities.ClassParticipants, error) {
	classes, err := c.ClassRepo.FindClassByParticipantsZCodeID(db, UserZCodeID)
	if err != nil {
		return nil, err
	}
	return classes, nil
}
func (c *ClassService) FindParticipantsByClassID(db *gorm.DB, ClassID uint) ([]*entities.ClassParticipants, error) {
	participants, err := c.ClassRepo.FindParticipantsByClassID(db, ClassID)
	if err != nil {
		return nil, err
	}
	return participants, nil
}
