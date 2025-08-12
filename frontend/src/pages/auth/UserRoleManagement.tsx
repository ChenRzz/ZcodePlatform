import { useState } from "react";
import { getUserInfoByZCode } from "../../services/user.ts";
import type { UserInfos } from "../../dto/response/user";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const UserSearchPage = () => {
    const [zcode, setZcode] = useState("");
    const [userInfo, setUserInfo] = useState<UserInfos | null>(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSearch = async () => {
        setError("");
        setUserInfo(null);
        try {
            const data = await getUserInfoByZCode({ user_zcode_id: zcode });
            setUserInfo(data);
        } catch (err) {
            setError("User not found.");
        }
    };

    return (
        <div className="container mt-5">
            <h2>User Role Management</h2>
            <Form className="mb-3">
                <Form.Group>
                    <Form.Label>Enter User ZCode:</Form.Label>
                    <Form.Control
                        type="text"
                        value={zcode}
                        onChange={(e) => setZcode(e.target.value)}
                    />
                </Form.Group>
                <Button className="mt-2" onClick={handleSearch}>
                    Search
                </Button>
            </Form>

            {error && <div className="alert alert-danger">{error}</div>}

            {userInfo && (
                <div className="card p-3 mt-3">
                    <p><b>ID:</b> {userInfo.user_id}</p>
                    <p><b>Name:</b> {userInfo.user_name}</p>
                    <p><b>Email:</b> {userInfo.user_email}</p>
                    <p><b>ZCode:</b> {userInfo.user_z_code}</p>
                    <Button
                        onClick={() => navigate(`/manage-roles/${userInfo.user_id}`)}
                    >
                        Manage Roles
                    </Button>
                </div>
            )}
        </div>
    );
};

export default UserSearchPage;
