package request

import "time"

type CreateClass struct {
	ClassName           string `json:"class_name"`
	ClassCode           string `json:"class_code"`
	ClassDescription    string `json:"class_description"`
	ClassManagerZCodeID uint64 `json:"class_manager_z_code_id,string"`
	ClassManagerName    string `json:"class_manager_name"`
}

type DeleteClass struct {
	ClassID uint `json:"class_id"`
}

type UpdateClassInfo struct {
	ClassID             uint   `json:"class_id"`
	ClassName           string `json:"class_name"`
	ClassCode           string `json:"class_code"`
	ClassDescription    string `json:"class_description"`
	ClassManagerZCodeID uint64 `json:"class_manager_z_code_id,string"`
	ClassManagerName    string `json:"class_manager_name"`
}

type FindClassByID struct {
	ClassID uint `json:"class_id"`
}
type FindClassByClassCode struct {
	ClassCode string `json:"class_code"`
}

type CreateLecture struct {
	ClassID            uint       `json:"class_id"`
	LectureName        string     `json:"lecture_name"`
	LectureDescription string     `json:"lecture_description"`
	StartTime          *time.Time `json:"start_time"`
	EndTime            *time.Time `json:"end_time"`
	LecturerZCodeID    uint64     `json:"lecturer_z_code_id,string"`
	LecturerName       string     `json:"lecturer_name"`
}

type DeleteLecture struct {
	LectureID uint `json:"lecture_id"`
}

type UpdateLectureInfo struct {
	LectureID          uint       `json:"lecture_id"`
	ClassID            uint       `json:"class_id"`
	LectureName        string     `json:"lecture_name"`
	LectureDescription string     `json:"lecture_description"`
	StartTime          *time.Time `json:"start_time"`
	EndTime            *time.Time `json:"end_time"`
	LecturerZCodeID    uint64     `json:"lecturer_z_code_id,string"`
	LecturerName       string     `json:"lecturer_name"`
}

type FindLectureByID struct {
	LectureID uint `json:"lecture_id"`
}

type FindLecturesByClassID struct {
	ClassID uint `json:"class_id"`
}

type AddParticipantToClass struct {
	ClassID     uint   `json:"class_id"`
	ClassName   string `json:"class_name"`
	UserZCodeID uint64 `json:"user_zcode_id,string"`
	Username    string `json:"username"`
	UserRole    string `json:"user_role"`
}

type DeleteClassParticipants struct {
	ClassParticipantsID uint `json:"class_participants_id"`
}

type SetRoleForParticipant struct {
	ClassParticipantsID uint   `json:"class_participants_id"`
	Role                string `json:"role"`
}

type FindClassByParticipantZCodeID struct {
	UserZCodeID uint64 `json:"user_z_code_id"`
}

type FindParticipantByClassID struct {
	ClassID uint `json:"class_id"`
}
