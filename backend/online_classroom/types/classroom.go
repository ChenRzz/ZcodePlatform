package types

import (
	"sync"
	"time"
)

type Classroom struct {
	LectureID    uint      `json:"lecture_id"`
	TeacherZCode string    `json:"teacher_zcode"`
	CreatedAt    time.Time `json:"created_at"`

	OnlineUsers map[string]*User `json:"online_users"`
	UsersMutex  sync.RWMutex     `json:"-"`

	ChatMessages []*ChatMessage `json:"chat_messages"`
	ChatMutex    sync.RWMutex   `json:"-"`
}

type ChatMessage struct {
	ID        string    `json:"id"`
	SenderID  string    `json:"sender_id"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
}

func NewClassroom(lectureID uint, teacherZCode string) *Classroom {
	return &Classroom{
		LectureID:    lectureID,
		TeacherZCode: teacherZCode,
		CreatedAt:    time.Now(),
		OnlineUsers:  make(map[string]*User),
		ChatMessages: make([]*ChatMessage, 0),
	}
}

func (c *Classroom) AddUser(user *User) {
	c.UsersMutex.Lock()
	defer c.UsersMutex.Unlock()
	c.OnlineUsers[user.ZCode] = user
}

func (c *Classroom) RemoveUser(zcode string) {
	c.UsersMutex.Lock()
	defer c.UsersMutex.Unlock()
	delete(c.OnlineUsers, zcode)
}

func (c *Classroom) GetUserCount() int {
	c.UsersMutex.RLock()
	defer c.UsersMutex.RUnlock()
	return len(c.OnlineUsers)
}

func (c *Classroom) GetUsers() []*User {
	c.UsersMutex.RLock()
	defer c.UsersMutex.RUnlock()

	users := make([]*User, 0, len(c.OnlineUsers))
	for _, user := range c.OnlineUsers {
		users = append(users, user)
	}
	return users
}

func (c *Classroom) GetUser(zcode string) *User {
	c.UsersMutex.RLock()
	defer c.UsersMutex.RUnlock()
	return c.OnlineUsers[zcode]
}

func (c *Classroom) AddChatMessage(senderID, content string) *ChatMessage {
	c.ChatMutex.Lock()
	defer c.ChatMutex.Unlock()

	msg := &ChatMessage{
		ID:        generateMessageID(),
		SenderID:  senderID,
		Content:   content,
		CreatedAt: time.Now(),
	}

	c.ChatMessages = append(c.ChatMessages, msg)

	if len(c.ChatMessages) > 100 {
		c.ChatMessages = c.ChatMessages[1:]
	}

	return msg
}

func (c *Classroom) GetChatMessages() []*ChatMessage {
	c.ChatMutex.RLock()
	defer c.ChatMutex.RUnlock()

	messages := make([]*ChatMessage, len(c.ChatMessages))
	copy(messages, c.ChatMessages)
	return messages
}

func generateMessageID() string {
	return time.Now().Format("20060102150405") + "_" +
		time.Now().Format("000000")
}
