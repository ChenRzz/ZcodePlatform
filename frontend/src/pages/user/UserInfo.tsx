import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {getUserInfo, changePassword, logoffUser, logoutUser} from "../../services/user";

interface UserInfo {
    username: string;
    email: string;
}

function UserInfo() {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const navigate = useNavigate();

    // 获取用户信息
    const fetchUserInfo = async () => {
        try {
            const data = await getUserInfo();
            setUserInfo(data);
        } catch (error) {
            console.error("Error fetching user info:", error);
        }
    };

    // 重设密码
    const handleChangePassword = async () => {
        const oldPassword = prompt("Enter your current password:");
        const newPassword = prompt("Enter your new password:");
        if (oldPassword && newPassword) {
            try {
                await changePassword(oldPassword, newPassword); // 调用修改密码的 API
                alert("Password changed successfully");
                await logoutUser();
                navigate("/login")

            } catch (error) {
                console.error("Error changing password:", error);
                alert("Failed to change password");
            }
        } else {
            alert("Both fields are required");
        }
    };

    // 注销
    const handleLogoff = async () => {
        const password = prompt("Enter your current password:");
        if (password) {
            try {
                await logoffUser(password);
                alert("Log off successfully!");
                localStorage.removeItem("token"); // 清除 token
                navigate("/"); // 重定向到首页
            } catch (error) {
                console.error("Error logging off:", error);
                alert("Failed to log off");
            }
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    if (!userInfo) return <div>Loading...</div>;

    return (
        <div className="container">
            <h2>User Information</h2>
            <div className="mb-3">
                <strong>Username:</strong> {userInfo.username}
            </div>
            <div className="mb-3">
                <strong>Email:</strong> {userInfo.email}
            </div>
            <div className="mb-3">
                <button onClick={handleChangePassword} className="btn btn-outline-primary btn-sm">Change Password</button>
            </div>
            <div className="mb-3">
                <button onClick={handleLogoff} className="btn btn-outline-danger btn-sm">Log Off</button>
            </div>
        </div>
    );
}

export default UserInfo;
