import { useState } from 'react';
import { loginUser } from '../../services/user';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
const Login = () => {
    const navigate = useNavigate();
    const {setUsername,setUserZcode,setRoles} = useUser();
    const [usernameinput, setUsernameInput] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async () => {
        try {
            const response = await loginUser(usernameinput, password);
            const token = response.token;
            const backendUsername = response.username;
            const backendUserZcode=response.userZcode;
            const roleNames: string[] = response.user_role;

            localStorage.setItem('token', token);
            localStorage.setItem('username', backendUsername);
            localStorage.setItem('userZcode', backendUserZcode.toString());
            localStorage.setItem('user_roles', JSON.stringify(roleNames));

            setUsername(backendUsername);
            setUserZcode(backendUserZcode);
            setRoles(roleNames);
            setMessage('🎉 Login successful!');
            setTimeout(() => navigate('/'), 1500);
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
                        value={usernameinput}
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
