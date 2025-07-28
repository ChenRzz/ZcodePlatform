import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { logoutUser } from "../services/user";

function Navbar() {
    const { username, setUsername } = useUser(); // 使用 UserContext
    const navigate = useNavigate();

    // 检查 token 和 username 来判断是否已登录
    const checkLoginStatus = () => {
        const token = localStorage.getItem("token");
        return token && username;
    };

    const handleLogout = async () => {
        try {
            await logoutUser(); // 调用注销的 API
            alert("Logged out successfully!");
        } catch (err) {
            console.warn("Logout failed:", err);
        } finally {
            // 清除 token 和 username，更新状态
            localStorage.removeItem("token");
            setUsername(null);
            navigate("/login"); // 重定向到登录页面
        }
    };

    return (
        <header className="bg-light shadow-sm py-3 px-4">
            <div className="d-flex justify-content-between align-items-center">
                <div className="h4 text-primary">
                    <Link to="/" className="text-primary text-decoration-none">
                        Zcode Platform
                    </Link>
                </div>
                <nav className="d-flex gap-3 align-items-center">
                    {checkLoginStatus() ? (
                        <>
                        <Link to="/userinfo" className="text-muted">
                                👤 {username}
                            </Link>
                            <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-link text-primary">Login</Link>
                            <Link to="/register" className="btn btn-link text-primary">Register</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Navbar;
