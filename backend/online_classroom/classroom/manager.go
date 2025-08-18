package classroom

import (
	"MScProject/online_classroom/types"
	"fmt"
	"log"
	"sync"
	"time"
)

type ClassroomManager struct {
	classrooms map[uint]*types.Classroom
	mutex      sync.RWMutex
}

var GlobalClassroomManager = &ClassroomManager{
	classrooms: make(map[uint]*types.Classroom),
}

func (cm *ClassroomManager) GetOrCreateClassroom(lectureID uint, teacherZCode string) *types.Classroom {
	cm.mutex.Lock()
	defer cm.mutex.Unlock()

	if classroom, exists := cm.classrooms[lectureID]; exists {
		return classroom
	}
	classroom := types.NewClassroom(lectureID, teacherZCode)
	cm.classrooms[lectureID] = classroom

	log.Printf("Create new classroom: ID=%d, Teacher=%s", lectureID, teacherZCode)
	return classroom
}

func (cm *ClassroomManager) GetClassroom(lectureID uint) *types.Classroom {
	cm.mutex.RLock()
	defer cm.mutex.RUnlock()

	if classroom, exists := cm.classrooms[lectureID]; exists {
		return classroom
	}
	return nil
}

func (cm *ClassroomManager) AddUser(lectureID uint, userZCode, userName, userRole string) error {
	classroom := cm.GetClassroom(lectureID)
	if classroom == nil {
		return fmt.Errorf("classroom %d not exist", lectureID)
	}

	user := &types.User{
		ZCode:    userZCode,
		Name:     userName,
		Role:     userRole,
		JoinedAt: time.Now(),
	}

	classroom.AddUser(user)
	log.Printf("user enter classroom: %s (%s) -> classroom %d", userName, userRole, lectureID)

	return nil
}

func (cm *ClassroomManager) RemoveUser(lectureID uint, userZCode string) error {
	classroom := cm.GetClassroom(lectureID)
	if classroom == nil {
		return fmt.Errorf("classroom %d not exist", lectureID)
	}

	classroom.RemoveUser(userZCode)
	log.Printf("user leave the classroom: %s <- classroom %d", userZCode, lectureID)

	if classroom.GetUserCount() == 0 {
		cm.deleteClassroom(lectureID)
	}

	return nil
}

func (cm *ClassroomManager) AddChatMessage(lectureID uint, senderID, content string) (*types.ChatMessage, error) {
	classroom := cm.GetClassroom(lectureID)
	if classroom == nil {
		return nil, fmt.Errorf("classroom %d not exist", lectureID)
	}

	message := classroom.AddChatMessage(senderID, content)
	log.Printf("chat message add: %s -> classroom %d", senderID, lectureID)

	return message, nil
}

func (cm *ClassroomManager) GetClassroomState(lectureID uint) map[string]interface{} {
	classroom := cm.GetClassroom(lectureID)
	if classroom == nil {
		return map[string]interface{}{
			"online_users":  []interface{}{},
			"chat_messages": []interface{}{},
			"online_count":  0,
		}
	}

	return map[string]interface{}{
		"lecture_id":    classroom.LectureID,
		"teacher_zcode": classroom.TeacherZCode,
		"online_users":  classroom.GetUsers(),
		"chat_messages": classroom.GetChatMessages(),
		"online_count":  classroom.GetUserCount(),
		"created_at":    classroom.CreatedAt,
	}
}

func (cm *ClassroomManager) deleteClassroom(lectureID uint) {
	cm.mutex.Lock()
	defer cm.mutex.Unlock()

	delete(cm.classrooms, lectureID)
	log.Printf("classroom has been deleted: ID=%d", lectureID)
}

func (cm *ClassroomManager) GetStats() map[string]interface{} {
	cm.mutex.RLock()
	defer cm.mutex.RUnlock()

	totalUsers := 0
	classroomStats := make([]map[string]interface{}, 0)

	for lectureID, classroom := range cm.classrooms {
		userCount := classroom.GetUserCount()
		totalUsers += userCount

		classroomStats = append(classroomStats, map[string]interface{}{
			"lecture_id":    lectureID,
			"teacher_zcode": classroom.TeacherZCode,
			"user_count":    userCount,
			"created_at":    classroom.CreatedAt,
		})
	}

	return map[string]interface{}{
		"total_classrooms": len(cm.classrooms),
		"total_users":      totalUsers,
		"classrooms":       classroomStats,
	}
}
