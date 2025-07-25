package base

type CodeSnippet struct {
	BaseEntity
	LectureID uint
	UserID    uint
	Content   string

	User    User
	Lecture Lecture
}
