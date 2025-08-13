// src/services/class.ts
import axios from "../utils/axios";
import type {ClassInfo, LectureInfo, UserJoinedClassesInfo} from "../dto/response/class.ts";
import type {
    AddParticipantToClassRequest,
    CreateClassRequest, CreateLectureRequest,
    DeleteClassRequest, DeleteLectureRequest, getClassByIDRequest, getLecturesByClassIDRequest,
    UpdateClassInfoRequest, UpdateLectureRequest
} from "../dto/request/class.ts";

export const GetAllClasses = async (): Promise<ClassInfo[]> => {
    const res = await axios.get("/class/all");
    return res.data.data;
};

export const getMyClasses = async (): Promise<UserJoinedClassesInfo[]> => {
    const response = await axios.get("/class/participant/my_classes");
    return response.data.data;
};


export const JoinClass = async (classParti:AddParticipantToClassRequest) => {
    const response = await axios.post("/class/participant/add",classParti);
    return response.data;
};


export const getManagedClasses = async (): Promise<ClassInfo[]> => {
    const response = await axios.get("/class/byManagerZcode");
    return response.data.data;
};

export const createClass = async (classinfo:CreateClassRequest) => {
    const response = await axios.post("/class/create",classinfo);
    return response.data;
};

export const updateClass = async (classinfo:UpdateClassInfoRequest) => {
    const response = await axios.post("/class/update",classinfo);
    return response.data;
};
export const deleteClass = async (classid:DeleteClassRequest) => {
    const response = await axios.post("/class/delete",classid);
    return response.data;
};

//export interface ClassInfo {
//     class_id: number;
//     created_at: string | null;
//     class_name: string;
//     class_code: string;
//     class_description: string;
//     class_manager_zcode_id: bigint;
//     class_manager_name: string;
// }
export const getClassByID=async (classid:getClassByIDRequest):Promise<ClassInfo>=>{
    const response = await axios.post("/class/byID",classid);
    return response.data.data;
}
export const createLecture = async (lectureinfo:CreateLectureRequest) => {
    const response = await axios.post("/class/lecture/create",lectureinfo);
    return response.data;
};

export const updateLecture = async (lectureinfo:UpdateLectureRequest) => {
    const response = await axios.post("/class/lecture/update",lectureinfo);
    return response.data;
};
export const deleteLecture = async (lectureid:DeleteLectureRequest) => {
    const response = await axios.post("/class/lecture/delete",lectureid);
    return response.data;
};

export const getLecturesByClassID = async (classid:getLecturesByClassIDRequest): Promise<LectureInfo[]> => {
    const response = await axios.post("/class/lecture/byCID",classid);
    return response.data.data;
};
// export interface CreateLectureRequest {
//     class_id: number;
//     lecture_name:string;
//     lecture_description:string;
//     start_time:string | null;
//     end_time:string | null;
//     lecturer_z_code_id:string;
//     lecturer_name:string;
// }
//
// export interface DeleteLectureRequest {
//     lecture_id: number;
// }
//
// export interface UpdateLectureRequest {
//     lecture_id:number;
//     class_id: number;
//     lecture_name:string;
//     lecture_description:string;
//     start_time:string | null;
//     end_time:string | null;
//     lecturer_z_code_id:string;
//     lecturer_name:string;
// }
//
// export interface getLecturesByClassIDRequest {
//     class_id:number;
// }
// export interface LectureInfo {
//     lecture_id: number;
//     created_at: string | null;
//     lecture_name: string;
//     lecture_description: string;
//     class_id: number;
//     start_time: string | null;
//     end_time: string | null;
//     lecturer_z_code_id: string;
//     lecturer_name: string;
// }


