package application

import (
	"MScProject/core_app/domain/entities"
	"MScProject/core_app/domain/service"
	"MScProject/core_app/dto/response"
	"MScProject/core_app/infrastructure"
	"gorm.io/gorm"
	"time"
)

type IClassApplication interface {
	CreateClass(className string, classCode string, classDescription string, classManagerZCodeID uint64, classManagerName string) error
	DeleteClass(classID uint) error
	UpdateClassInfo(classID uint, className string, classCode string, classDescription string, classManagerZCodeID uint64, classManagerName string) error
	FindClassByID(classID uint) (*entities.Class, error)
	FindClassByClassCode(classCode string) (*entities.Class, error)
	FindClassByManagerZCode(managerZode uint64) ([]*entities.Class, error)
	FindAllClasses() ([]*entities.Class, error)

	CreateLecture(ClassID uint, LectureName string, LectureDescription string, StartTime *time.Time, EndTime *time.Time, LecturerZCodeID uint64, LecturerName string) error
	DeleteLecture(LectureID uint) error
	UpdateLectureInfo(LectureID uint, ClassID uint, LectureName string, LectureDescription string, StartTime *time.Time, EndTime *time.Time, LecturerZCodeID uint64, LecturerName string) error
	FindLectureByLectureID(LectureID uint) (*entities.Lecture, error)
	FindLecturesByClassID(ClassID uint) ([]*entities.Lecture, error)

	AddParticipantToClass(ClassID uint, ClassName string, UserZCodeID uint64, Username string, UserRole string) error
	DeleteParticipantFromClass(ClassParticipantsID uint) error
	SetRoleForParticipant(classParticipantsID uint, Role string) error
	FindClassesByParticipantZCodeID(UserZCodeID uint64) ([]*entities.ClassParticipants, error)
	FindParticipantsByClassID(ClassID uint) ([]*entities.ClassParticipants, error)
	FindUserClasses(participantZCodeID uint64) ([]*response.UserJoinedClassesInfo, error)
}

type ClassApplication struct {
	ClassService service.IClassService
}

func NewClassApplication(classService service.IClassService) *ClassApplication {
	return &ClassApplication{
		ClassService: classService,
	}
}

func (c *ClassApplication) CreateClass(className string, classCode string, classDescription string, classManagerZCodeID uint64, classManagerName string) error {
	db := infrastructure.GetDB()
	return db.Transaction(
		func(tx *gorm.DB) error {
			return c.ClassService.CreateClass(tx, className, classCode, classDescription, classManagerZCodeID, classManagerName)
		})
}
func (c *ClassApplication) DeleteClass(classID uint) error {
	db := infrastructure.GetDB()
	return db.Transaction(
		func(tx *gorm.DB) error { return c.ClassService.DeleteClass(tx, classID) })
}

func (c *ClassApplication) UpdateClassInfo(classID uint, className string, classCode string, classDescription string, classManagerZCodeID uint64, classManagerName string) error {
	db := infrastructure.GetDB()
	return db.Transaction(
		func(tx *gorm.DB) error {
			return c.ClassService.UpdateClassInfo(tx, classID, className, classCode, classDescription, classManagerZCodeID, classManagerName)
		})

}

func (c *ClassApplication) FindClassByID(classID uint) (*entities.Class, error) {
	db := infrastructure.GetDB()
	var class *entities.Class
	var err error
	errs := db.Transaction(func(tx *gorm.DB) error {
		class, err = c.ClassService.FindClassByID(tx, classID)
		return err
	})
	if errs != nil {
		return nil, errs
	}
	return class, nil
}
func (c *ClassApplication) FindClassByClassCode(classCode string) (*entities.Class, error) {
	db := infrastructure.GetDB()
	var class *entities.Class
	var err error
	errs := db.Transaction(func(tx *gorm.DB) error {
		class, err = c.ClassService.FindClassByClassCode(tx, classCode)
		return err
	})
	if errs != nil {
		return nil, errs
	}
	return class, nil
}

func (c *ClassApplication) CreateLecture(ClassID uint, LectureName string, LectureDescription string, StartTime *time.Time, EndTime *time.Time, LecturerZCodeID uint64, LecturerName string) error {
	db := infrastructure.GetDB()
	err := db.Transaction(func(tx *gorm.DB) error {
		return c.ClassService.CreateLecture(tx, ClassID, LectureName, LectureDescription, StartTime, EndTime, LecturerZCodeID, LecturerName)
	})
	return err
}
func (c *ClassApplication) DeleteLecture(LectureID uint) error {
	db := infrastructure.GetDB()
	err := db.Transaction(func(tx *gorm.DB) error {
		return c.ClassService.DeleteLecture(tx, LectureID)
	})
	return err
}
func (c *ClassApplication) UpdateLectureInfo(LectureID uint, ClassID uint, LectureName string, LectureDescription string, StartTime *time.Time, EndTime *time.Time, LecturerZCodeID uint64, LecturerName string) error {
	db := infrastructure.GetDB()
	err := db.Transaction(func(tx *gorm.DB) error {
		return c.ClassService.UpdateLectureInfo(tx, LectureID, ClassID, LectureName, LectureDescription, StartTime, EndTime, LecturerZCodeID, LecturerName)
	})
	return err
}
func (c *ClassApplication) FindLectureByLectureID(LectureID uint) (*entities.Lecture, error) {
	db := infrastructure.GetDB()
	var lecture *entities.Lecture
	var err error
	errs := db.Transaction(func(tx *gorm.DB) error {
		lecture, err = c.ClassService.FindLectureByLectureID(tx, LectureID)
		return err
	})
	if errs != nil {
		return nil, errs
	}
	return lecture, nil

}
func (c *ClassApplication) FindLecturesByClassID(ClassID uint) ([]*entities.Lecture, error) {
	db := infrastructure.GetDB()
	var lectures []*entities.Lecture
	var err error
	errs := db.Transaction(func(tx *gorm.DB) error {
		lectures, err = c.ClassService.FindLecturesByClassID(tx, ClassID)
		return err
	})
	if errs != nil {
		return nil, errs
	}
	return lectures, nil
}

func (c *ClassApplication) AddParticipantToClass(ClassID uint, ClassName string, UserZCodeID uint64, Username string, UserRole string) error {
	db := infrastructure.GetDB()
	return db.Transaction(
		func(tx *gorm.DB) error {
			return c.ClassService.AddParticipantToClass(tx, ClassID, ClassName, UserZCodeID, Username, UserRole)
		})
}
func (c *ClassApplication) DeleteParticipantFromClass(ClassParticipantsID uint) error {
	db := infrastructure.GetDB()
	return db.Transaction(
		func(tx *gorm.DB) error {
			return c.ClassService.DeleteParticipantFromClass(tx, ClassParticipantsID)
		})
}
func (c *ClassApplication) SetRoleForParticipant(classParticipantsID uint, Role string) error {
	db := infrastructure.GetDB()
	return db.Transaction(
		func(tx *gorm.DB) error {
			return c.ClassService.SetRoleForParticipant(tx, classParticipantsID, Role)
		})
}
func (c *ClassApplication) FindClassesByParticipantZCodeID(UserZCodeID uint64) ([]*entities.ClassParticipants, error) {
	db := infrastructure.GetDB()
	var classParticipants []*entities.ClassParticipants
	var err error
	errs := db.Transaction(func(tx *gorm.DB) error {
		classParticipants, err = c.ClassService.FindClassesByParticipantZCodeID(tx, UserZCodeID)
		return err
	})
	if errs != nil {
		return nil, errs
	}
	return classParticipants, nil
}
func (c *ClassApplication) FindParticipantsByClassID(ClassID uint) ([]*entities.ClassParticipants, error) {
	db := infrastructure.GetDB()
	var classParticipants []*entities.ClassParticipants
	var err error
	errs := db.Transaction(func(tx *gorm.DB) error {
		classParticipants, err = c.ClassService.FindParticipantsByClassID(tx, ClassID)
		return err
	})
	if errs != nil {
		return nil, errs
	}
	return classParticipants, nil
}

func (c *ClassApplication) FindAllClasses() ([]*entities.Class, error) {
	db := infrastructure.GetDB()
	return c.ClassService.FindAllClasses(db)
}
func (c *ClassApplication) FindUserClasses(participantZCodeID uint64) ([]*response.UserJoinedClassesInfo, error) {
	db := infrastructure.GetDB()
	return c.ClassService.FindUserClasses(db, participantZCodeID)
}

func (c *ClassApplication) FindClassByManagerZCode(managerZode uint64) ([]*entities.Class, error) {
	db := infrastructure.GetDB()
	return c.ClassService.FindClassByManagerZCode(db, managerZode)
}
