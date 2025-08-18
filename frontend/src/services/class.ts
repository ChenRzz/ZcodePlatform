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


