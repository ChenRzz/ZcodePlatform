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
    const response = await axios.post('/user/login', { username, password });
    return response.data;
}

