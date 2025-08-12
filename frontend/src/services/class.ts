// src/services/class.ts
import axios from "../utils/axios";
import type {ClassInfo, UserJoinedClassesInfo} from "../dto/response/class.ts";
import type {
    AddParticipantToClassRequest,
    CreateClassRequest,
    DeleteClassRequest,
    UpdateClassInfoRequest
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