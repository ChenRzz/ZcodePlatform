package online_classroom

import (
	"MScProject/online_classroom/classroom"
	"MScProject/online_classroom/websocket"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"strconv"
)

type JoinClassroomRequest struct {
	LectureID     uint   `json:"lecture_id" binding:"required"`
	ZCode         string `json:"zcode" binding:"required"`
	LecturerZcode string `json:"lecturer_zcode" binding:"required"`
	Name          string `json:"name"`
}

type JoinClassroomResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

func JoinClassroomHandler(c *gin.Context) {
	var req JoinClassroomRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, JoinClassroomResponse{
			Success: false,
			Error:   "Invalid request parameters",
		})
		return
	}

	if req.Name == "" {
		req.Name = req.ZCode
	}
	userrole := "student"
	if req.LecturerZcode == req.ZCode {
		userrole = "teacher"
	}
	log.Println(req, userrole)
	wsURL := "ws://localhost:8081/ws/classroom/" + strconv.Itoa(int(req.LectureID)) +
		"?zcode=" + req.ZCode + "&role=" + userrole + "&name=" + req.Name

	c.JSON(http.StatusOK, JoinClassroomResponse{
		Success: true,
		Data: gin.H{
			"lecture_id":    req.LectureID,
			"user_zcode":    req.ZCode,
			"user_name":     req.Name,
			"user_role":     userrole,
			"websocket_url": wsURL,
			"message":       "Ready to join classroom",
		},
	})
}

func GetClassroomStateHandler(c *gin.Context) {
	lectureIDStr := c.Param("lecture_id")
	lectureID, err := strconv.ParseUint(lectureIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid lecture ID",
		})
		return
	}

	zcode := c.Query("zcode")
	if zcode == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Missing zcode parameter",
		})
		return
	}

	classroomState := classroom.GlobalClassroomManager.GetClassroomState(uint(lectureID))

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    classroomState,
	})
}

func WebSocketUpgradeHandler(c *gin.Context) {
	lectureIDStr := c.Param("lecture_id")
	lectureID, err := strconv.ParseUint(lectureIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid lecture ID"})
		return
	}

	websocket.GlobalWSManager.HandleWebSocket(c.Writer, c.Request, uint(lectureID))
}

func GetStatsHandler(c *gin.Context) {
	wsStats := websocket.GlobalWSManager.GetStats()
	classroomStats := classroom.GlobalClassroomManager.GetStats()

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"websocket": wsStats,
			"classroom": classroomStats,
			"timestamp": gin.H{
				"server_time": "now",
			},
		},
	})
}
