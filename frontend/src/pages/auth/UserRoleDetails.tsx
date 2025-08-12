import { useEffect, useState } from "react";
import {getUserRolesByUID,DeleteUserRole,setUserRole,getAllRoles} from "../../services/auth_permit.ts";
import type { UserRolesInfo } from "../../dto/response/auth";
import type { RoleInfo } from "../../dto/response/auth";
import {Button, Modal, Form, Alert, Spinner} from "react-bootstrap";
import { useParams } from "react-router-dom";
import type {setUserRoleRequest} from "../../dto/request/auth.ts";

const ManageUserRolesPage = () => {
    const { userId } = useParams<{ userId: string }>();
    const [userRoles, setUserRoles] = useState<UserRolesInfo[]>([]);
    const [allRoles, setAllRoles] = useState<RoleInfo[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;
        fetchUserRoles();
        fetchAllRoles();
    }, [userId]);

    const fetchUserRoles = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getUserRolesByUID({ user_id: Number(userId) });
            setUserRoles(data || []); // 防止 null
        } catch (err) {
            setError("Failed to load user roles.");
        } finally {
            setLoading(false);
        }
    };

    const fetchAllRoles = async () => {
        try {
            const data = await getAllRoles();
            setAllRoles(data);
        } catch (err) {
            console.error("Failed to load all roles:", err);
        }
    };

    const handleDeleteRole = async (userRoleId: number) => {
        try {
            await DeleteUserRole({ user_role_id: userRoleId });
            fetchUserRoles();
        } catch (err) {
            setError("Failed to delete role.");
        }
    };

    const handleAddClick = () => {
        setSelectedRoleIds([]);
        setShowAddModal(true);
    };

    const toggleSelectRole = (id: number) => {
        setSelectedRoleIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleAddRoles = async () => {
        if (!userId) return;
        try {
            const payload: setUserRoleRequest[] = selectedRoleIds.map(role_id => ({
                user_id: Number(userId),
                role_id,
                assigned_by: 1, // 硬编码为 1
            }));
            await setUserRole(payload);
            setShowAddModal(false);
            fetchUserRoles();
        } catch (err) {
            setError("Failed to add roles.");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Manage Roles for User ID: {userId}</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {loading ? (
                <div className="text-center my-4">
                    <Spinner animation="border" /> Loading...
                </div>
            ) : (
                <>
                    <Button onClick={handleAddClick} className="mb-3">
                        Add Role
                    </Button>
                    <table className="table table-bordered">
                        <thead>
                        <tr>
                            <th>Role Name</th>
                            <th>Description</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {userRoles.length > 0 ? (
                            userRoles.map(role => (
                                <tr key={role.user_role_id}>
                                    <td>{role.role_name}</td>
                                    <td>{role.description}</td>
                                    <td>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDeleteRole(role.user_role_id)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="text-center text-muted">
                                    No roles assigned
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </>
            )}

            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Roles</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {allRoles.map(role => (
                            <Form.Check
                                key={role.role_id}
                                type="checkbox"
                                id={`role-${role.role_id}`}
                                label={`${role.role_name} (${role.role_description})`}
                                checked={selectedRoleIds.includes(role.role_id)}
                                onChange={() => toggleSelectRole(role.role_id)}
                            />
                        ))}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleAddRoles}
                        disabled={selectedRoleIds.length === 0}
                    >
                        Add Selected
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ManageUserRolesPage;