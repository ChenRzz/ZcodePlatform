package handllers

import (
	"MScProject/core_app/application"
	"MScProject/core_app/webInterface/request_struct"
	"github.com/gin-gonic/gin"
	"net/http"
)

type IClassHandler interface {
	CreateClass(c *gin.Context)
	DeleteClass(c *gin.Context)
	UpdateClassInfo(c *gin.Context)
	FindClassByID(c *gin.Context)
	FindClassByClassCode(c *gin.Context)

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
}

type ClassHandler struct {
	ClassApplication application.IClassApplication
}

func NewClassHandler(classApplication application.IClassApplication) *ClassHandler {
	return &ClassHandler{classApplication}
}

func (h *ClassHandler) CreateClass(c *gin.Context) {
	var req request_struct.CreateClassRequest
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := h.ClassApplication.CreateClass(req.ClassName, req.ClassCode, req.ClassDescription, req.ClassManagerZCodeID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "successfully create the class " + req.ClassCode})
	return
}
func (h *ClassHandler) DeleteClass(c *gin.Context) {
	var req request_struct.DeleteClassRequest
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
	var req request_struct.UpdateClassInfoRequest
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := h.ClassApplication.UpdateClassInfo(req.ClassID, req.ClassName, req.ClassCode, req.ClassDescription, req.ClassManagerZCodeID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "successfully update the class " + req.ClassCode})
	return
}

func (h *ClassHandler) FindClassByID(c *gin.Context) {
	var req request_struct.FindClassByIDRequest
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	class, err := h.ClassApplication.FindClassByID(req.ClassID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "class information",
		"data":    class,
	})
	return
}
func (h *ClassHandler) FindClassByClassCode(c *gin.Context) {
	var req request_struct.FindClassByClassCodeRequest
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	class, err := h.ClassApplication.FindClassByClassCode(req.ClassCode)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "class information",
		"data":    class,
	})
	return
}

func (h *ClassHandler) CreateLecture(c *gin.Context) {
	var req request_struct.CreateLectureRequest
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	err := h.ClassApplication.CreateLecture(req.ClassID, req.LectureName, req.LectureDescription, req.StartTime, req.EndTime, req.LecturerZCodeID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "successfully create lecture"})
	return
}
func (h *ClassHandler) DeleteLecture(c *gin.Context) {
	var req request_struct.DeleteLectureRequest
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
	var req request_struct.UpdateLectureInfoRequest
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := h.ClassApplication.UpdateLectureInfo(req.LectureID, req.ClassID, req.LectureName, req.LectureDescription, req.StartTime, req.EndTime, req.LecturerZCodeID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "successfully update the lecture"})
	return
}
func (h *ClassHandler) FindLectureByLectureID(c *gin.Context) {
	var req request_struct.FindLectureByIDRequest
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	lecture, err := h.ClassApplication.FindLectureByLectureID(req.LectureID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "lecture information",
		"data":    lecture,
	})
	return
}
func (h *ClassHandler) FindLecturesByClassID(c *gin.Context) {
	var req request_struct.FindLecturesByClassIDRequest
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	lectures, err := h.ClassApplication.FindLecturesByClassID(req.ClassID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "lecture information",
		"data":    lectures,
	})
	return
}

func (h *ClassHandler) AddParticipantToClass(c *gin.Context) {
	var req request_struct.AddParticipantToClassRequest
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
	var req request_struct.DeleteClassParticipantsRequest
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
	var req request_struct.SetRoleForParticipantRequest
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
	var req request_struct.FindClassByParticipantZCodeIDRequest
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	classes, err := h.ClassApplication.FindClassesByParticipantZCodeID(req.UserZCodeID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "classes and participants information",
		"data":    classes,
	})
	return
}
func (h *ClassHandler) FindParticipantsByClassID(c *gin.Context) {
	var req request_struct.FindParticipantByClassID
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	Participants, err := h.ClassApplication.FindParticipantsByClassID(req.ClassID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "classes and participants information",
		"data":    Participants,
	})
	return
}
