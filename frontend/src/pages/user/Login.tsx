import { useState } from 'react';
import { loginUser } from '../../services/user';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
const Login = () => {
    const navigate = useNavigate();
    const { setUsername } = useUser();
    const [username, setUsernameInput] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async () => {
        try {
            const response = await loginUser(username, password);
            const token = response.token;

            // 存储 Token 到本地（也可以根据需要使用 cookie）
            localStorage.setItem('token', token);
            setUsername(username)
            setMessage('🎉 Login successful!');
            setTimeout(() => navigate('/'), 1500); // 登录成功后跳转首页
        } catch (error: any) {
            setMessage(`❌ Login failed: ${error.response?.data?.error || error.message}`);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card p-4" style={{ width: '100%', maxWidth: '500px' }}>
                <h2 className="text-center mb-4">Welcome back</h2>

                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                        id="username"
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsernameInput(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        id="password"
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    className="btn btn-primary w-100 mb-3"
                    onClick={handleLogin}
                >
                    Login
                </button>

                {message && (
                    <p className="text-center text-danger">{message}</p>
                )}

                <p className="text-center">
                    Don't have an account? <a href="/register" className="text-primary">Register</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
