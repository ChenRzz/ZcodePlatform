package websocket

import (
	"github.com/gorilla/websocket"
	"sync"
	"time"
)

type WSConnection struct {
	Conn      *websocket.Conn `json:"-"`
	UserZCode string          `json:"user_zcode"`
	UserRole  string          `json:"user_role"`
	LectureID uint            `json:"lecture_id"`

	SendChan  chan []byte `json:"-"`
	CloseChan chan bool   `json:"-"`

	IsActive    bool      `json:"is_active"`
	ConnectedAt time.Time `json:"connected_at"`
	LastPing    time.Time `json:"last_ping"`

	Mutex sync.Mutex `json:"-"`
}

func NewWSConnection(conn *websocket.Conn, userZCode, userRole string, lectureID uint) *WSConnection {
	return &WSConnection{
		Conn:        conn,
		UserZCode:   userZCode,
		UserRole:    userRole,
		LectureID:   lectureID,
		SendChan:    make(chan []byte, 256),
		CloseChan:   make(chan bool),
		IsActive:    true,
		ConnectedAt: time.Now(),
		LastPing:    time.Now(),
	}
}

func (ws *WSConnection) SendMessage(message []byte) error {
	ws.Mutex.Lock()
	defer ws.Mutex.Unlock()

	if !ws.IsActive {
		return nil
	}

	select {
	case ws.SendChan <- message:
		return nil
	default:
		return nil
	}
}

func (ws *WSConnection) Close() {
	ws.Mutex.Lock()
	defer ws.Mutex.Unlock()

	if ws.IsActive {
		ws.IsActive = false
		close(ws.SendChan)
		ws.Conn.Close()
	}
}

func (ws *WSConnection) IsTimeout(timeout time.Duration) bool {
	return time.Since(ws.LastPing) > timeout
}
