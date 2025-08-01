package request_struct

import "time"

type CreateClassRequest struct {
	ClassName           string
	ClassCode           string
	ClassDescription    string
	ClassManagerZCodeID uint64
}

type DeleteClassRequest struct {
	ClassID uint
}

type UpdateClassInfoRequest struct {
	ClassID             uint
	ClassName           string
	ClassCode           string
	ClassDescription    string
	ClassManagerZCodeID uint64
}

type FindClassByIDRequest struct {
	ClassID uint
}
type FindClassByClassCodeRequest struct {
	ClassCode string
}

type CreateLectureRequest struct {
	ClassID            uint
	LectureName        string
	LectureDescription string
	StartTime          *time.Time
	EndTime            *time.Time
	LecturerZCodeID    uint64
}

type DeleteLectureRequest struct {
	LectureID uint
}

type UpdateLectureInfoRequest struct {
	LectureID          uint
	ClassID            uint
	LectureName        string
	LectureDescription string
	StartTime          *time.Time
	EndTime            *time.Time
	LecturerZCodeID    uint64
}

type FindLectureByIDRequest struct {
	LectureID uint
}

type FindLecturesByClassIDRequest struct {
	ClassID uint
}

type AddParticipantToClassRequest struct {
	ClassID     uint
	ClassName   string
	UserZCodeID uint64
	Username    string
	UserRole    string
}

type DeleteClassParticipantsRequest struct {
	ClassParticipantsID uint
}

type SetRoleForParticipantRequest struct {
	ClassParticipantsID uint
	Role                string
}

type FindClassByParticipantZCodeIDRequest struct {
	UserZCodeID uint64
}

type FindParticipantByClassID struct {
	ClassID uint
}
