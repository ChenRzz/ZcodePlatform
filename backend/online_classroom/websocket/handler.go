package websocket

import (
	"MScProject/online_classroom/classroom"
	"MScProject/online_classroom/types"
	"github.com/goccy/go-json"
	"github.com/gorilla/websocket"
	"log"
	"time"
)

func (wm *WSManager) handleConnection(wsConn *WSConnection) {
	defer func() {
		classroomData := classroom.GlobalClassroomManager.GetClassroom(wsConn.LectureID)
		var userName string
		if classroomData != nil {
			if user := classroomData.GetUser(wsConn.UserZCode); user != nil {
				userName = user.Name
			}
		}
		if userName == "" {
			userName = wsConn.UserZCode
		}
		wsConn.Close()
		wm.removeConnection(wsConn.LectureID, wsConn.UserZCode)
		classroom.GlobalClassroomManager.RemoveUser(wsConn.LectureID, wsConn.UserZCode)
		wm.broadcastUserLeave(wsConn.LectureID, wsConn.UserZCode, userName)
		log.Printf("WebSocket connection closed: user=%s", wsConn.UserZCode)
	}()

	go wm.writePump(wsConn)
	go wm.pingPump(wsConn)
	wm.sendConnectionAck(wsConn)
	wm.readPump(wsConn)
}

func (wm *WSManager) readPump(wsConn *WSConnection) {
	defer close(wsConn.CloseChan)
	wsConn.Conn.SetReadDeadline(time.Now().Add(60 * time.Second))
	wsConn.Conn.SetPongHandler(func(string) error {
		wsConn.Conn.SetReadDeadline(time.Now().Add(60 * time.Second))
		wsConn.LastPing = time.Now()
		return nil
	})

	for {
		_, messageBytes, err := wsConn.Conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("WebSocket closed unexpected: %v", err)
			}
			break
		}

		var message types.WSMessage
		if err := json.Unmarshal(messageBytes, &message); err != nil {
			log.Printf("unmarshal failed from %s: %v", wsConn.UserZCode, err)
			continue
		}

		wsConn.LastPing = time.Now()
		message.Sender = wsConn.UserZCode
		message.Timestamp = time.Now().Unix()

		wm.handleMessage(wsConn, &message)
	}
}

func (wm *WSManager) writePump(wsConn *WSConnection) {
	ticker := time.NewTicker(54 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case message, ok := <-wsConn.SendChan:
			wsConn.Conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if !ok {
				wsConn.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			if err := wsConn.Conn.WriteMessage(websocket.TextMessage, message); err != nil {
				log.Printf("failed to send message to %s: %v", wsConn.UserZCode, err)
				return
			}

		case <-ticker.C:
			wsConn.Conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if err := wsConn.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}

		case <-wsConn.CloseChan:
			return
		}
	}
}

func (wm *WSManager) pingPump(wsConn *WSConnection) {
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			if wsConn.IsTimeout(90 * time.Second) {
				log.Printf("user %s connect overtime", wsConn.UserZCode)
				wsConn.CloseChan <- true
				return
			}
		case <-wsConn.CloseChan:
			return
		}
	}
}

func (wm *WSManager) sendConnectionAck(wsConn *WSConnection) {
	ackMsg := types.WSMessage{
		Type:      types.MSG_CONNECTION_ACK,
		Sender:    "system",
		Timestamp: time.Now().Unix(),
		Data: map[string]interface{}{
			"user_zcode": wsConn.UserZCode,
			"user_role":  wsConn.UserRole,
			"lecture_id": wsConn.LectureID,
			"message":    "WebSocket connected successfully",
		},
	}

	if msgBytes, err := json.Marshal(ackMsg); err == nil {
		wsConn.SendMessage(msgBytes)
	}
}

func (wm *WSManager) handleMessage(wsConn *WSConnection, message *types.WSMessage) {
	log.Printf("recieve message: type=%s, sender=%s", message.Type, message.Sender)

	msgBytes, err := json.Marshal(message)
	if err != nil {
		log.Printf("failed to marshal message: %v", err)
		return
	}
	switch message.Type {
	case types.MSG_YJS_UPDATE:
		wm.handleYjsUpdate(wsConn, message, msgBytes)
	case types.MSG_YJS_SYNC_REQUEST:
		wm.handleYjsSyncRequest(wsConn, message, msgBytes)
	case types.MSG_YJS_SYNC_RESPONSE:
		wm.handleYjsSyncResponse(wsConn, message, msgBytes)
	case types.MSG_CHAT_MESSAGE:
		wm.handleChatMessage(wsConn, message, msgBytes)
	case types.MSG_TEACHER_EXECUTION:
		wm.handleTeacherExecution(wsConn, message, msgBytes)
	case types.MSG_STUDENT_EXECUTION:
		wm.handleStudentExecution(wsConn, message, msgBytes)
	default:
		log.Printf("Unknown messgae type: %s", message.Type)
	}
}

func (wm *WSManager) handleYjsUpdate(wsConn *WSConnection, message *types.WSMessage, msgBytes []byte) {

	yjsDataBytes, err := json.Marshal(message.Data)
	if err != nil {
		log.Printf("Yjs message failed to marshal: %v", err)
		return
	}

	var yjsData types.YjsData
	if err := json.Unmarshal(yjsDataBytes, &yjsData); err != nil {
		log.Printf("Yjs message failed to marshal: %v", err)
		return
	}

	log.Printf("Yjs update: document_key=%s, sender_role=%s", yjsData.DocumentKey, wsConn.UserRole)

	if yjsData.DocumentKey == "teacher-code" {
		if wsConn.UserRole == "teacher" {
			wm.BroadcastToStudents(wsConn.LectureID, msgBytes)
			log.Printf("teacher broadcast to students")
		} else {
			log.Printf("alert: student try to update teacher's code")
		}
	} else if len(yjsData.DocumentKey) > 8 && yjsData.DocumentKey[:8] == "student-" {
		studentZCode := yjsData.DocumentKey[8:]

		if wsConn.UserRole == "student" && wsConn.UserZCode == studentZCode {
			wm.SendToTeacher(wsConn.LectureID, msgBytes)
			log.Printf("student %s code updates to teacher", studentZCode)
		} else if wsConn.UserRole == "teacher" {
			wm.SendToUser(wsConn.LectureID, studentZCode, msgBytes)
			log.Printf("teacher edit student %s 's code has send", studentZCode)
		} else {
			log.Printf("alert：user %s try to edit %s's code", wsConn.UserZCode, studentZCode)
		}
	}
}

func (wm *WSManager) handleYjsSyncRequest(wsConn *WSConnection, message *types.WSMessage, msgBytes []byte) {
	yjsDataBytes, err := json.Marshal(message.Data)
	if err != nil {
		return
	}

	var yjsData types.YjsData
	if err := json.Unmarshal(yjsDataBytes, &yjsData); err != nil {
		return
	}

	log.Printf("sync request: document_key=%s, requester=%s", yjsData.DocumentKey, wsConn.UserZCode)

	yjsData.Requester = wsConn.UserZCode
	message.Data = yjsData

	updatedMsgBytes, err := json.Marshal(message)
	if err != nil {
		return
	}

	var targetUser string
	if yjsData.DocumentKey == "teacher-code" {
		targetUser = "teacher"
		wm.SendToTeacher(wsConn.LectureID, updatedMsgBytes)
		log.Printf("sync request to teacher")
	} else if len(yjsData.DocumentKey) > 8 && yjsData.DocumentKey[:8] == "student-" {
		targetUser = yjsData.DocumentKey[8:]
		wm.SendToUser(wsConn.LectureID, targetUser, updatedMsgBytes)
		log.Printf("sync request to student: %s", targetUser)
	}
}

func (wm *WSManager) handleYjsSyncResponse(wsConn *WSConnection, message *types.WSMessage, msgBytes []byte) {
	yjsDataBytes, err := json.Marshal(message.Data)
	if err != nil {
		return
	}

	var yjsData types.YjsData
	if err := json.Unmarshal(yjsDataBytes, &yjsData); err != nil {
		return
	}
	log.Printf("sync response: document_key=%s, requester=%s", yjsData.DocumentKey, yjsData.Requester)

	if yjsData.Requester != "" {
		wm.SendToUser(wsConn.LectureID, yjsData.Requester, msgBytes)
		log.Printf("sync response: %s", yjsData.Requester)
	}
}

func (wm *WSManager) handleChatMessage(wsConn *WSConnection, message *types.WSMessage, msgBytes []byte) {
	chatDataBytes, err := json.Marshal(message.Data)
	if err != nil {
		log.Printf("failed to marshal chat messgae: %v", err)
		return
	}

	var chatData types.ChatData
	if err := json.Unmarshal(chatDataBytes, &chatData); err != nil {
		log.Printf("failed to unmarshal chat message: %v", err)
		return
	}

	log.Printf("chat message: sender=%s, content=%s", wsConn.UserZCode, chatData.Message)

	savedMessage, err := classroom.GlobalClassroomManager.AddChatMessage(
		wsConn.LectureID,
		wsConn.UserZCode,
		chatData.Message,
	)
	if err != nil {
		log.Printf("failed to save the chat message: %v", err)
		return
	}

	broadcastMessage := map[string]interface{}{
		"type": "chat_message",
		"data": map[string]interface{}{
			"id":         savedMessage.ID,
			"sender_id":  savedMessage.SenderID,
			"content":    savedMessage.Content,
			"created_at": savedMessage.CreatedAt.Unix(),
		},
		"sender":    wsConn.UserZCode,
		"timestamp": savedMessage.CreatedAt.Unix(),
	}

	broadcastMsgBytes, err := json.Marshal(broadcastMessage)
	if err != nil {
		log.Printf("failed to marshal chat broadcastMsg: %v", err)
		return
	}

	wm.BroadcastToOthers(wsConn.LectureID, wsConn.UserZCode, broadcastMsgBytes)
	wm.SendToUser(wsConn.LectureID, wsConn.UserZCode, broadcastMsgBytes)
	log.Printf("chat message has been broadcast")
}
func (wm *WSManager) handleTeacherExecution(wsConn *WSConnection, message *types.WSMessage, msgBytes []byte) {
	log.Printf("Teacher execution broadcast from: %s", wsConn.UserZCode)

	wm.BroadcastToStudents(wsConn.LectureID, msgBytes)
}

func (wm *WSManager) handleStudentExecution(wsConn *WSConnection, message *types.WSMessage, msgBytes []byte) {
	log.Printf("Student execution from: %s", wsConn.UserZCode)

	if wsConn.UserRole == "student" {
		wm.SendToTeacher(wsConn.LectureID, msgBytes)
		log.Printf("Student %s execution sent to teacher", wsConn.UserZCode)
	} else if wsConn.UserRole == "teacher" {
		if message.Target != "" {
			err := wm.SendToUser(wsConn.LectureID, message.Target, msgBytes)
			if err != nil {
				log.Printf("Failed to send execution result to student %s: %v", message.Target, err)
			} else {
				log.Printf("Teacher execution sent to student: %s", message.Target)
			}
		} else {
			wm.BroadcastToStudents(wsConn.LectureID, msgBytes)
			log.Printf("Teacher execution broadcast to all students (no target specified)")
		}
	}
}
