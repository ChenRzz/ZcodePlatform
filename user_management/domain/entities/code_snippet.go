package entities

type CodeSnippet struct {
	BaseEntity
	LectureID uint
	UserID    uint
	Content   string
}
