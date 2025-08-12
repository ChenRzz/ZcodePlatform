export interface CreateClassRequest {
    class_name: string;
    class_code: string;
    class_description: string;
    class_manager_z_code_id: string;
    class_manager_name:string;
}

export interface DeleteClassRequest {
    class_id: number;
}

export interface UpdateClassInfoRequest {
    class_id: number;
    class_name: string;
    class_code: string;
    class_description: string;
    class_manager_z_code_id: string;
    class_manager_name:string;
}

export interface FindClassByIDRequest {
    class_id: number;
}

export interface FindClassByClassCodeRequest {
    class_code: string;
}

export interface CreateLectureRequest {
    class_id: number;
    lecture_name: string;
    lecture_description: string;
    start_time: string | null; // ISO 格式时间字符串
    end_time: string | null;
    lecturer_z_code_id: string;
}

export interface DeleteLectureRequest {
    lecture_id: number;
}

export interface UpdateLectureInfoRequest {
    lecture_id: number;
    class_id: number;
    lecture_name: string;
    lecture_description: string;
    start_time: string | null;
    end_time: string | null;
    lecturer_z_code_id: string;
}

export interface FindLectureByIDRequest {
    lecture_id: number;
}

export interface FindLecturesByClassIDRequest {
    class_id: number;
}

export interface AddParticipantToClassRequest {
    class_id: number;
    class_name: string;
    user_zcode_id: string;
    username: string;
    user_role: string;
}

export interface DeleteClassParticipantsRequest {
    class_participants_id: number;
}

export interface SetRoleForParticipantRequest {
    class_participants_id: number;
    role: string;
}

export interface FindClassByParticipantZCodeIDRequest {
    user_zcode_id: string;
}

export interface FindParticipantByClassIDRequest {
    class_id: number;
}