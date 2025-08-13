// src/dto/class.ts

export interface ClassInfo {
    class_id: number;
    created_at: string | null;
    class_name: string;
    class_code: string;
    class_description: string;
    class_manager_zcode_id: bigint;
    class_manager_name: string;
}


export interface LectureInfo {
    lecture_id: number;
    created_at: string | null;
    lecture_name: string;
    lecture_description: string;
    class_id: number;
    start_time: string | null;
    end_time: string | null;
    lecturer_z_code_id: string;
    lecturer_name: string;
}

export interface ClassParticipantInfo {
    class_participant_id: number;
    class_id: number;
    class_name: string;
    user_zcode_id: bigint;
    username: string;
    user_role: string;
}

export interface UserJoinedClassesInfo {
    class_participant_id:number;
    class_id:number;
    class_name:string;
    class_code:string;
    class_manager_name:string;
    created_at:string;
}