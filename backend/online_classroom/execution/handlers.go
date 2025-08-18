package execution

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func ExecuteCodeHandler(c *gin.Context) {
	var req ExecutionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid request format",
		})
		return
	}

	if req.Code == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Code cannot be empty",
		})
		return
	}

	if req.Language != "python" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Only Python is supported",
		})
		return
	}

	userRole := c.Query("role")
	if userRole == "" {
		userRole = "student"
	}

	result, err := GlobalExecutionManager.ExecuteCode(req, userRole)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    result,
	})
}

func GetExecutionResultHandler(c *gin.Context) {
	executionID := c.Param("id")
	if executionID == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Execution ID is required",
		})
		return
	}

	result, err := GlobalExecutionManager.GetResult(executionID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"error":   "Execution result not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    result,
	})
}
