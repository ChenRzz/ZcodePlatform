import { useState } from 'react';
import { loginUser } from '../../services/user';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async () => {
        try {
            const response = await loginUser(username, password);
            const token = response.token;

            // 存储 Token 到本地（也可以根据需要使用 cookie）
            localStorage.setItem('token', token);
            setMessage('✅ Login successful!');
            setTimeout(() => navigate('/'), 1500); // 登录成功后跳转首页
        } catch (error: any) {
            setMessage(`❌ Login failed: ${error.response?.data?.error || error.message}`);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">Welcome back</h2>

                <input
                    className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />

                <input
                    className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />

                <button
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={handleLogin}
                >
                    Login
                </button>

                {message && (
                    <p className="mt-4 text-sm text-center text-red-600">{message}</p>
                )}

                <p className="mt-6 text-sm text-center text-gray-500">
                    Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Register</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
