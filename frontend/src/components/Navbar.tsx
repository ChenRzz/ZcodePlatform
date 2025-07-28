import { Link } from "react-router-dom";

function Navbar() {
    // 模拟用户是否登录（后续可替换为真实状态）
    const isLoggedIn = false;
    const username = "crz";

    return (
        <header className="bg-white shadow-sm py-4 px-8 flex justify-between items-center">
            <div className="text-2xl font-bold text-blue-600">
                Zcode Platform
            </div>
            <nav className="space-x-4">
                {isLoggedIn ? (
                    <>
                        <span className="text-gray-700 font-medium">👤 {username}</span>
                        <button className="text-red-500 hover:underline">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
                        <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
                    </>
                )}
            </nav>
        </header>
    );
}

export default Navbar;