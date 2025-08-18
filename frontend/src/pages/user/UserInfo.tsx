import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {getUserInfo, changePassword, logoffUser, logoutUser} from "../../services/user";

interface UserInfo {
    user_id: bigint;
    user_name: string;
    user_email: string;
    user_z_code: bigint;
}

function UserInfo() {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const navigate = useNavigate();
    const fetchUserInfo = async () => {
        try {
            const data = await getUserInfo();
            setUserInfo(data);
        } catch (error) {
            console.error("Error fetching user info:", error);
        }
    };

    const handleChangePassword = async () => {
        const oldPassword = prompt("Enter your current password:");
        const newPassword = prompt("Enter your new password:");
        if (oldPassword && newPassword) {
            try {
                await changePassword(oldPassword, newPassword);
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

    const handleLogoff = async () => {
        const password = prompt("Enter your current password:");
        if (password) {
            try {
                await logoffUser(password);
                alert("Log off successfully!");
                localStorage.removeItem("token");
                navigate("/");
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
                <strong>Username:</strong> {userInfo.user_name}
            </div>
            <div className="mb-3">
                <strong>Email:</strong> {userInfo.user_email}
            </div>
            <div className="mb-3">
                <strong>ZCode:</strong> {userInfo.user_z_code}
            </div>
            <div className="mb-3">
                <button onClick={handleChangePassword} className="btn btn-outline-primary btn-sm">Change Password
                </button>
            </div>
            <div className="mb-3">
                <button onClick={handleLogoff} className="btn btn-outline-danger btn-sm">Log Off</button>
            </div>
        </div>
    );
}

export default UserInfo;
