import  { useEffect, useState } from "react";
import { getAllRoles } from "../../services/auth_permit.ts";
import type{ RoleInfo } from "../../dto/response/auth.ts";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const RoleListPage = () => {
    const [roles, setRoles] = useState<RoleInfo[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        getAllRoles().then(setRoles).catch(console.error);
    }, []);

    const goToManageAuthPoint = (roleId: number) => {
        navigate(`/role/${roleId}/authpoints`);
    };

    return (
        <div className="container mt-5">
            <h1>Role List</h1>
            <table className="table table-bordered">
                <thead>
                <tr><th>Role Name</th><th>Description</th><th>Actions</th></tr>
                </thead>
                <tbody>
                {roles.map(role => (
                    <tr key={role.role_id}>
                        <td>{role.role_name}</td>
                        <td>{role.role_description}</td>
                        <td>
                            <Button onClick={() => goToManageAuthPoint(role.role_id)}>
                                Manage Auth Point
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default RoleListPage;
