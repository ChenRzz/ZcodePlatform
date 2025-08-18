package websocket

import (
	"MScProject/online_classroom/classroom"
	"github.com/goccy/go-json"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"sync"
	"time"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

type WSManager struct {
	connections map[uint]map[string]*WSConnection
	mutex       sync.RWMutex
}

var GlobalWSManager = &WSManager{
	connections: make(map[uint]map[string]*WSConnection),
}

func (wm *WSManager) HandleWebSocket(w http.ResponseWriter, r *http.Request, lectureID uint) {
	zcode := r.URL.Query().Get("zcode")
	role := r.URL.Query().Get("role")
	name := r.URL.Query().Get("name")

	if zcode == "" || role == "" {
		http.Error(w, "Missing zcode or role parameter", http.StatusBadRequest)
		return
	}
	if name == "" {
		name = zcode
	}
	log.Printf("WebSocket connect request: user=%s, role=%s, lecture=%d", zcode, role, lectureID)

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("WebSocket upgrade failed: %v", err)
		return
	}
	wsConn := NewWSConnection(conn, zcode, role, lectureID)

	wm.addConnection(lectureID, zcode, wsConn)
	if role == "teacher" {
		classroom.GlobalClassroomManager.GetOrCreateClassroom(lectureID, zcode)
	}
	err = classroom.GlobalClassroomManager.AddUser(lectureID, zcode, name, role)
	if err != nil {
		log.Printf("Failed to add user to classroom: %v", err)
		conn.Close()
		return
	}

	wm.broadcastUserJoin(lectureID, zcode, name, role)

	log.Printf("WebSocket connect successful: user=%s, role=%s, lecture=%d", zcode, role, lectureID)

	go wm.handleConnection(wsConn)
}

func (wm *WSManager) addConnection(lectureID uint, userZCode string, conn *WSConnection) {
	wm.mutex.Lock()
	defer wm.mutex.Unlock()

	if wm.connections[lectureID] == nil {
		wm.connections[lectureID] = make(map[string]*WSConnection)
	}

	if oldConn, exists := wm.connections[lectureID][userZCode]; exists {
		log.Printf("close old connection of user %s ", userZCode)
		oldConn.Close()
	}

	wm.connections[lectureID][userZCode] = conn
}

func (wm *WSManager) removeConnection(lectureID uint, userZCode string) {
	wm.mutex.Lock()
	defer wm.mutex.Unlock()

	if lectureConns, exists := wm.connections[lectureID]; exists {
		delete(lectureConns, userZCode)

		if len(lectureConns) == 0 {
			delete(wm.connections, lectureID)
			log.Printf("close all connection of lecture: %d", lectureID)
		}
	}
}

func (wm *WSManager) getClassroomConnections(lectureID uint) map[string]*WSConnection {
	wm.mutex.RLock()
	defer wm.mutex.RUnlock()

	if conns, exists := wm.connections[lectureID]; exists {
		result := make(map[string]*WSConnection)
		for k, v := range conns {
			result[k] = v
		}
		return result
	}
	return make(map[string]*WSConnection)
}

func (wm *WSManager) SendToUser(lectureID uint, userZCode string, message []byte) error {
	wm.mutex.RLock()
	defer wm.mutex.RUnlock()

	if lectureConns, exists := wm.connections[lectureID]; exists {
		if conn, userExists := lectureConns[userZCode]; userExists && conn.IsActive {
			return conn.SendMessage(message)
		}
	}
	return nil
}

func (wm *WSManager) GetStats() map[string]interface{} {
	wm.mutex.RLock()
	defer wm.mutex.RUnlock()

	totalConnections := 0
	lectureStats := make(map[string]int)

	for lectureID, conns := range wm.connections {
		count := len(conns)
		totalConnections += count
		lectureStats[string(rune(lectureID))] = count
	}

	return map[string]interface{}{
		"total_connections": totalConnections,
		"lecture_stats":     lectureStats,
		"active_lectures":   len(wm.connections),
	}
}

func (wm *WSManager) BroadcastToOthers(lectureID uint, senderZCode string, message []byte) {
	wm.mutex.RLock()
	defer wm.mutex.RUnlock()

	if lectureConns, exists := wm.connections[lectureID]; exists {
		count := 0
		for userZCode, conn := range lectureConns {
			if userZCode != senderZCode && conn.IsActive {
				conn.SendMessage(message)
				count++
			}
		}
		log.Printf("Message broadcast to %d others in lecture %d", count, lectureID)
	}
}

func (wm *WSManager) BroadcastToAll(lectureID uint, message []byte) {
	wm.BroadcastToOthers(lectureID, "", message)
}

func (wm *WSManager) BroadcastToStudents(lectureID uint, message []byte) {
	wm.mutex.RLock()
	defer wm.mutex.RUnlock()

	if lectureConns, exists := wm.connections[lectureID]; exists {
		count := 0
		for _, conn := range lectureConns {
			if conn.UserRole == "student" && conn.IsActive {
				conn.SendMessage(message)
				count++
			}
		}
		log.Printf("Message broadcast to %d students in lecture %d", count, lectureID)
	}
}

func (wm *WSManager) SendToTeacher(lectureID uint, message []byte) error {
	wm.mutex.RLock()
	defer wm.mutex.RUnlock()

	if lectureConns, exists := wm.connections[lectureID]; exists {
		for _, conn := range lectureConns {
			if conn.UserRole == "teacher" && conn.IsActive {
				return conn.SendMessage(message)
			}
		}
	}
	log.Printf("Teacher not found in lecture %d", lectureID)
	return nil
}

func (wm *WSManager) broadcastUserJoin(lectureID uint, userZCode, userName, userRole string) {
	classroomState := classroom.GlobalClassroomManager.GetClassroomState(lectureID)

	joinMessage := map[string]interface{}{
		"type": "user_join",
		"data": map[string]interface{}{
			"user_zcode":   userZCode,
			"user_name":    userName,
			"user_role":    userRole,
			"online_users": classroomState["online_users"],
			"online_count": classroomState["online_count"],
		},
		"sender":    "system",
		"timestamp": time.Now().Unix(),
	}

	msgBytes, err := json.Marshal(joinMessage)
	if err != nil {
		log.Printf("Failed to marshal user join message: %v", err)
		return
	}

	wm.BroadcastToOthers(lectureID, userZCode, msgBytes)
	log.Printf("User join message broadcast: %s joined lecture %d", userName, lectureID)
}

func (wm *WSManager) broadcastUserLeave(lectureID uint, userZCode, userName string) {
	classroomState := classroom.GlobalClassroomManager.GetClassroomState(lectureID)

	leaveMessage := map[string]interface{}{
		"type": "user_leave",
		"data": map[string]interface{}{
			"user_zcode":   userZCode,
			"user_name":    userName,
			"online_users": classroomState["online_users"],
			"online_count": classroomState["online_count"],
		},
		"sender":    "system",
		"timestamp": time.Now().Unix(),
	}

	msgBytes, err := json.Marshal(leaveMessage)
	if err != nil {
		log.Printf("Failed to marshal user leave message: %v", err)
		return
	}

	wm.BroadcastToAll(lectureID, msgBytes)
	log.Printf("User leave message broadcast: %s left lecture %d", userName, lectureID)
}
