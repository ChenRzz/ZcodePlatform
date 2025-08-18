package types

import "time"

type WSMessage struct {
	Type      string      `json:"type"`
	Data      interface{} `json:"data"`
	Sender    string      `json:"sender"`
	Target    string      `json:"target,omitempty"`
	Timestamp int64       `json:"timestamp"`
}

type YjsData struct {
	DocumentKey string `json:"document_key"`
	Update      []byte `json:"update"`
	StateVector []byte `json:"state_vector,omitempty"`
	Requester   string `json:"requester,omitempty"`
}

type ChatData struct {
	Message string `json:"message"`
}

type User struct {
	ZCode    string    `json:"zcode"`
	Name     string    `json:"name"`
	Role     string    `json:"role"` // "teacher" | "student"
	JoinedAt time.Time `json:"joined_at"`
}

const (
	MSG_YJS_UPDATE        = "yjs_update"
	MSG_YJS_SYNC_REQUEST  = "yjs_sync_request"
	MSG_YJS_SYNC_RESPONSE = "yjs_sync_response"
	MSG_CHAT_MESSAGE      = "chat_message"
	MSG_USER_JOIN         = "user_join"
	MSG_USER_LEAVE        = "user_leave"
	MSG_CONNECTION_ACK    = "connection_ack"
	MSG_ERROR             = "error"
	MSG_TEACHER_EXECUTION = "teacher_execution"
	MSG_STUDENT_EXECUTION = "student_execution"
)
