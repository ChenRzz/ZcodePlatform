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
            localStorage.removeItem("token");
            setUsername(null);
            navigate("/login");
        }
    };

    return (
        <header className="bg-light shadow-sm py-3 px-4">
            <div className="d-flex justify-content-between align-items-center">
                {/* 左侧 Logo */}
                <div className="h4 text-primary mb-0">
                    <Link to="/" className="text-primary text-decoration-none">
                        Zcode Platform
                    </Link>
                </div>



                {/* 右侧用户信息/登录注册 */}
                <nav className="d-flex gap-3 align-items-center">
                    {checkLoginStatus() ? (
                        <>
                            <Link to="/userinfo" className="text-muted text-decoration-none">
                                👤 {username}
                            </Link>
                            <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-link text-primary">
                                Login
                            </Link>
                            <Link to="/register" className="btn btn-link text-primary">
                                Register
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Navbar;
