package handllers

import (
	"MScProject/core_app/application"
	"MScProject/core_app/dto/request"
	"MScProject/core_app/dto/response"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
)

type IClassHandler interface {
	CreateClass(c *gin.Context)
	DeleteClass(c *gin.Context)
	UpdateClassInfo(c *gin.Context)
	FindClassByID(c *gin.Context)
	FindClassByClassCode(c *gin.Context)
	FindClassByManagerZCode(c *gin.Context)
	FindAllClasses(c *gin.Context)

	CreateLecture(c *gin.Context)
	DeleteLecture(c *gin.Context)
	UpdateLectureInfo(c *gin.Context)
	FindLectureByLectureID(c *gin.Context)
	FindLecturesByClassID(c *gin.Context)

	AddParticipantToClass(c *gin.Context)
	DeleteParticipantFromClass(c *gin.Context)
	SetRoleForParticipant(c *gin.Context)
	FindClassesByParticipantZCodeID(c *gin.Context)
	FindParticipantsByClassID(c *gin.Context)
	FindUserClasses(c *gin.Context)
}

type ClassHandler struct {
	ClassApplication application.IClassApplication
}

func NewClassHandler(classApplication application.IClassApplication) *ClassHandler {
	return &ClassHandler{classApplication}
}

func (h *ClassHandler) CreateClass(c *gin.Context) {
	var req request.CreateClass
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := h.ClassApplication.CreateClass(req.ClassName, req.ClassCode, req.ClassDescription, req.ClassManagerZCodeID, req.ClassManagerName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "successfully create the class " + req.ClassCode})
	return
}
func (h *ClassHandler) DeleteClass(c *gin.Context) {
	var req request.DeleteClass
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	err := h.ClassApplication.DeleteClass(req.ClassID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "successfully create the class"})
	return
}

func (h *ClassHandler) UpdateClassInfo(c *gin.Context) {
	var req request.UpdateClassInfo
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := h.ClassApplication.UpdateClassInfo(req.ClassID, req.ClassName, req.ClassCode, req.ClassDescription, req.ClassManagerZCodeID, req.ClassManagerName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "successfully update the class " + req.ClassCode})
	return
}

func (h *ClassHandler) FindClassByID(c *gin.Context) {
	var req request.FindClassByID
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	class, err := h.ClassApplication.FindClassByID(req.ClassID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	var classinfo response.ClassInfo
	classinfo.ClassID = class.ID
	classinfo.ClassName = class.ClassName
	classinfo.ClassCode = class.ClassCode
	classinfo.ClassManagerName = class.ClassManagerName
	classinfo.ClassManagerZCodeID = class.ClassManagerZCodeID
	classinfo.CreatedAt = class.CreatedAt
	classinfo.ClassDescription = class.ClassDescription
	c.JSON(http.StatusOK, gin.H{
		"message": "class information",
		"data":    classinfo,
	})
	return
}
func (h *ClassHandler) FindClassByClassCode(c *gin.Context) {
	var req request.FindClassByClassCode
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	class, err := h.ClassApplication.FindClassByClassCode(req.ClassCode)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	var classinfo response.ClassInfo
	classinfo.ClassID = class.ID
	classinfo.ClassName = class.ClassName
	classinfo.ClassCode = class.ClassCode
	classinfo.ClassManagerName = class.ClassManagerName
	classinfo.ClassManagerZCodeID = class.ClassManagerZCodeID
	classinfo.CreatedAt = class.CreatedAt
	classinfo.ClassDescription = class.ClassDescription
	c.JSON(http.StatusOK, gin.H{
		"message": "class information",
		"data":    classinfo,
	})
	return
}

func (h *ClassHandler) CreateLecture(c *gin.Context) {
	var req request.CreateLecture
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	fmt.Println(req)
	err := h.ClassApplication.CreateLecture(req.ClassID, req.LectureName, req.LectureDescription, req.StartTime, req.EndTime, req.LecturerZCodeID, req.LecturerName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "successfully create lecture"})
	return
}
func (h *ClassHandler) DeleteLecture(c *gin.Context) {
	var req request.DeleteLecture
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	err := h.ClassApplication.DeleteLecture(req.LectureID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "successfully delete the lecture"})
	return
}
func (h *ClassHandler) UpdateLectureInfo(c *gin.Context) {
	var req request.UpdateLectureInfo
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := h.ClassApplication.UpdateLectureInfo(req.LectureID, req.ClassID, req.LectureName, req.LectureDescription, req.StartTime, req.EndTime, req.LecturerZCodeID, req.LecturerName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "successfully update the lecture"})
	return
}
func (h *ClassHandler) FindLectureByLectureID(c *gin.Context) {
	var req request.FindLectureByID
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	lecture, err := h.ClassApplication.FindLectureByLectureID(req.LectureID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	//LectureID          uint       `json:"lecture_id"`
	//CreatedAt          *time.Time `json:"created_at"`
	//LectureName        string     `json:"lecture_name"`
	//LectureDescription string     `json:"lecture_description"`
	//ClassID            uint       `json:"class_id"`
	//StartTime          *time.Time `json:"start_time"`
	//EndTime            *time.Time `json:"end_time"`
	//LecturerZCodeID    uint64     `json:"lecturer_z_code_id"`
	//LecturerName       string     `json:"lecturer_name"`
	var lectureinfo response.LectureInfo
	lectureinfo.LectureID = lecture.ID
	lectureinfo.CreatedAt = lecture.CreatedAt
	lectureinfo.LectureName = lecture.LectureName
	lectureinfo.LectureDescription = lecture.LectureDescription
	lectureinfo.ClassID = lecture.ClassID
	lectureinfo.StartTime = lecture.EndTime
	lectureinfo.LecturerZCodeID = lecture.LecturerZCodeID
	lectureinfo.LecturerName = lecture.LecturerName
	lectureinfo.EndTime = lecture.EndTime
	c.JSON(http.StatusOK, gin.H{
		"message": "lecture information",
		"data":    lectureinfo,
	})
	return
}
func (h *ClassHandler) FindLecturesByClassID(c *gin.Context) {
	var req request.FindLecturesByClassID
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	lectures, err := h.ClassApplication.FindLecturesByClassID(req.ClassID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	var lecturesinfo []response.LectureInfo
	for _, lecture := range lectures {
		var lectureinfo response.LectureInfo
		lectureinfo.LectureID = lecture.ID
		lectureinfo.CreatedAt = lecture.CreatedAt
		lectureinfo.LectureName = lecture.LectureName
		lectureinfo.LectureDescription = lecture.LectureDescription
		lectureinfo.ClassID = lecture.ClassID
		lectureinfo.StartTime = lecture.EndTime
		lectureinfo.LecturerZCodeID = lecture.LecturerZCodeID
		lectureinfo.LecturerName = lecture.LecturerName
		lectureinfo.EndTime = lecture.EndTime
		lecturesinfo = append(lecturesinfo, lectureinfo)
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "lecture information",
		"data":    lecturesinfo,
	})
	return
}

func (h *ClassHandler) AddParticipantToClass(c *gin.Context) {
	var req request.AddParticipantToClass
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := h.ClassApplication.AddParticipantToClass(req.ClassID, req.ClassName, req.UserZCodeID, req.Username, req.UserRole)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "successfully add the participant " + string(req.UserZCodeID)})
	return
}
func (h *ClassHandler) DeleteParticipantFromClass(c *gin.Context) {
	var req request.DeleteClassParticipants
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := h.ClassApplication.DeleteParticipantFromClass(req.ClassParticipantsID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "successfully delete the participant "})
	return
}
func (h *ClassHandler) SetRoleForParticipant(c *gin.Context) {
	var req request.SetRoleForParticipant
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := h.ClassApplication.SetRoleForParticipant(req.ClassParticipantsID, req.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "successfully set the Role"})
	return
}
func (h *ClassHandler) FindClassesByParticipantZCodeID(c *gin.Context) {
	uZcode, exist := c.Get("Zcode")
	if !exist {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Can not find User Zcode"})
		return
	}
	userZcode := uZcode.(uint64)
	classes, err := h.ClassApplication.FindClassesByParticipantZCodeID(userZcode)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	var classparticipantinfo []response.ClassParticipantInfo
	for _, classpar := range classes {
		var classparticipant response.ClassParticipantInfo
		classparticipant.ClassParticipantID = classpar.ID
		classparticipant.ClassID = classpar.ClassID
		classparticipant.ClassName = classpar.ClassName
		classparticipant.UserZCodeID = classpar.UserZCodeID
		classparticipant.Username = classpar.Username
		classparticipant.UserRole = classpar.UserRole
		classparticipantinfo = append(classparticipantinfo, classparticipant)

	}

	c.JSON(http.StatusOK, gin.H{
		"message": "classes and participants information",
		"data":    classparticipantinfo,
	})
	return
}
func (h *ClassHandler) FindParticipantsByClassID(c *gin.Context) {
	var req request.FindParticipantByClassID
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	classes, err := h.ClassApplication.FindParticipantsByClassID(req.ClassID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	var classparticipantinfo []response.ClassParticipantInfo
	for _, classpar := range classes {
		var classparticipant response.ClassParticipantInfo
		classparticipant.ClassParticipantID = classpar.ID
		classparticipant.ClassID = classpar.ClassID
		classparticipant.ClassName = classpar.ClassName
		classparticipant.UserZCodeID = classpar.UserZCodeID
		classparticipant.Username = classpar.Username
		classparticipant.UserRole = classpar.UserRole
		classparticipantinfo = append(classparticipantinfo, classparticipant)

	}
	c.JSON(http.StatusOK, gin.H{
		"message": "classes and participants information",
		"data":    classparticipantinfo,
	})
	return
}

func (h *ClassHandler) FindAllClasses(c *gin.Context) {
	classes, err := h.ClassApplication.FindAllClasses()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	var classesinfo []response.ClassInfo
	for _, class := range classes {
		var classinfo response.ClassInfo
		classinfo.ClassID = class.ID
		classinfo.ClassName = class.ClassName
		classinfo.ClassCode = class.ClassCode
		classinfo.ClassManagerName = class.ClassManagerName
		classinfo.ClassManagerZCodeID = class.ClassManagerZCodeID
		classinfo.CreatedAt = class.CreatedAt
		classinfo.ClassDescription = class.ClassDescription
		classesinfo = append(classesinfo, classinfo)
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "successfully get all classes",
		"data":    classesinfo,
	})
	return
}

func (h *ClassHandler) FindUserClasses(c *gin.Context) {
	uZcode, exist := c.Get("Zcode")
	if !exist {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Can not find User Zcode"})
		return
	}
	userZcode := uZcode.(uint64)
	userJoinedclasses, err := h.ClassApplication.FindUserClasses(userZcode)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "successfully find the classes",
		"data":    userJoinedclasses,
	})
	return
}

func (h *ClassHandler) FindClassByManagerZCode(c *gin.Context) {
	uZcode, exist := c.Get("Zcode")
	if !exist {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Can not find User Zcode"})
		return
	}
	userZcode := uZcode.(uint64)
	classes, err := h.ClassApplication.FindClassByManagerZCode(userZcode)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	var classesinfo []response.ClassInfo
	for _, class := range classes {
		var classinfo response.ClassInfo
		classinfo.ClassID = class.ID
		classinfo.ClassName = class.ClassName
		classinfo.ClassCode = class.ClassCode
		classinfo.ClassManagerName = class.ClassManagerName
		classinfo.ClassManagerZCodeID = class.ClassManagerZCodeID
		classinfo.CreatedAt = class.CreatedAt
		classinfo.ClassDescription = class.ClassDescription
		classesinfo = append(classesinfo, classinfo)
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "successfully get manager's classes",
		"data":    classesinfo,
	})
	return
}
