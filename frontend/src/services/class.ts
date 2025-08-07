// src/services/class.ts
import axios from "../utils/axios";
import type {ClassInfo, UserJoinedClassesInfo} from "../dto/response/class.ts";

export const GetAllClasses = async (): Promise<ClassInfo[]> => {
    const res = await axios.get("/class/all");
    return res.data.data;
};

export const getMyClasses = async (): Promise<UserJoinedClassesInfo[]> => {
    const response = await axios.get("/class/participant/my_classes");
    return response.data.data;
};