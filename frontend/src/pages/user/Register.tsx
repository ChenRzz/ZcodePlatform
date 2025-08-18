import { useState } from 'react';
import { registerUser } from '../../services/user';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async () => {
        try {
            await registerUser(username, email, password);
            setMessage('🎉 Registration successful!');
            setTimeout(() => navigate('/login'), 1500);
        } catch (error: any) {
            setMessage(`❌ Registration failed: ${error.response?.data?.error || error.message}`);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card p-4" style={{ width: '100%', maxWidth: '500px' }}>
                <h2 className="text-center mb-4">Create your account</h2>

                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                        id="username"
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        id="email"
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                    onClick={handleRegister}
                >
                    Register
                </button>

                {message && (
                    <p className="text-center text-danger">{message}</p>
                )}

                <p className="text-center">
                    Already have an account? <a href="/login" className="text-primary">Login</a>
                </p>
            </div>
        </div>
    );
};

export default Register;
