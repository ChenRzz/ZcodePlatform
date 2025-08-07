import axios from "../utils/axios"


export const registerUser = async (username: string, email: string, password: string) => {
    const res = await axios.post("/user/register", {
        username,
        email,
        password,
    });
    return res.data;
};

export const loginUser = async (username: string, password: string) => {
    const res = await axios.post("/user/login", {
        username,
        password,
    });
    return res.data;
};

export const logoutUser = async () => {
    return await axios.post("/auth_user/logout");
};

export const getUserInfo = async () => {
    const res = await axios.get("/auth_user/userinfo");
    return res.data.data;
};

export const changePassword = async (oldPassword: string, newPassword: string) => {
    const res = await axios.post("/auth_user/change_password", {
        old_password: oldPassword,
        new_password: newPassword,
    });
    return res.data;
};

export const logoffUser = async (password: string) => {
    const res = await axios.post("/auth_user/logoff", {
        password,
    });
    return res.data;
};