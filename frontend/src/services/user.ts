import axios from 'axios';

const API_BASE = 'http://localhost:8081'; // 替换为你的后端地址和端口

export const registerUser = async (username: string, email: string, password: string) => {
    const res = await axios.post(`${API_BASE}/user/register`, {
        username,
        email,
        password
    });
    return res.data;
};
export async function loginUser(username: string, password: string) {
    const response = await axios.post(`${API_BASE}/user/login`, { username, password });
    return response.data;
}
export const logoutUser = async () => {
    const token = localStorage.getItem("token");
    return await axios.post(
            `${API_BASE}/auth_user/logout`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};

export const getUserInfo = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE}/auth_user/userinfo`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// 重设密码
export const changePassword = async (oldPassword:string,newPassword:string) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
        `${API_BASE}/auth_user/change_password`,
        { old_password: oldPassword,new_password:newPassword},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};
export const logoffUser = async (password:string) => {
    const token = localStorage.getItem("token");
    return await axios.post(
        `${API_BASE}/auth_user/logoff`,
        {password:password},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};
