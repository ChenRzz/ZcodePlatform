import { useEffect, useState } from "react";
import {
    getAuthPointOfRole,
    setAuthPointToRole,
    deleteAuthPointOfRole,
    getAllAuthPoints,
} from "../../services/auth_permit.ts";

import type {RoleAuthPointsInfo,AuthPointInfo} from "../../dto/response/auth.ts";
import type {SetAuthPointToRoleRequest} from "../../dto/request/auth.ts";
import { Button, Modal, Form, Alert, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";

const RoleAuthPointPage = () => {
    const { roleId } = useParams<{ roleId: string }>();
    const [roleAuthPoints, setRoleAuthPoints] = useState<RoleAuthPointsInfo[]>([]);
    const [allAuthPoints, setAllAuthPoints] = useState<AuthPointInfo[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedAuthPointIds, setSelectedAuthPointIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!roleId) return;

        setLoading(true);
        setError(null);

        Promise.all([getAuthPointOfRole({ role_id: Number(roleId) }), getAllAuthPoints()])
            .then(([rolePoints, allPoints]) => {
                setRoleAuthPoints(rolePoints || []);
                setAllAuthPoints(allPoints || []);
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to load permissions");
                setLoading(false);
                console.error("Failed to load permissions",err)
            });
    }, [roleId]);

    const fetchRoleAuthPoints = async () => {
        if (!roleId) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getAuthPointOfRole({ role_id: Number(roleId) });
            setRoleAuthPoints(data || []);
        } catch {
            setError("Failed to load role permissions");
        }
        setLoading(false);
    };

    const handleDelete = async (roleAuthPointId: number) => {
        try {
            await deleteAuthPointOfRole({ role_auth_point_id: roleAuthPointId });
            await fetchRoleAuthPoints();
        } catch {
            alert("Failed to delete permission");
        }
    };

    const handleAddClick = () => {
        setSelectedAuthPointIds([]);
        setShowAddModal(true);
    };

    const toggleSelectAuthPoint = (id: number) => {
        setSelectedAuthPointIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleAddAuthPoints = async () => {
        if (!roleId) return;
        const payload: SetAuthPointToRoleRequest[] = selectedAuthPointIds.map(auth_point_id => ({
            role_id: Number(roleId),
            auth_point_id,
        }));
        try {
            await setAuthPointToRole(payload);
            setShowAddModal(false);
            await fetchRoleAuthPoints();
        } catch {
            alert("Failed to add permissions");
        }
    };
    
    const availableAuthPoints = allAuthPoints.filter(ap =>
        !roleAuthPoints.some(rp => rp.permission_code === ap.permission_code)
    );

    if (loading) return <div className="text-center"><Spinner animation="border" /> Loading...</div>;

    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <div className="container mt-5">
            <h2>Manage Auth Points for Role ID: {roleId}</h2>
            <Button onClick={handleAddClick} className="mb-3">Add Permission</Button>

            <table className="table table-bordered">
                <thead>
                <tr>
                    <th>Request Method</th>
                    <th>Request Path</th>
                    <th>Permission Code</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {roleAuthPoints.length === 0 ? (
                    <tr><td colSpan={4} className="text-center">No permissions assigned</td></tr>
                ) : (
                    roleAuthPoints.map(rap => (
                        <tr key={rap.role_auth_point_id}>
                            <td>{rap.request_method}</td>
                            <td>{rap.request_path}</td>
                            <td>{rap.permission_code}</td>
                            <td>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(rap.role_auth_point_id)}>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>

            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Permissions</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {availableAuthPoints.length === 0 ? (
                        <div>No available permissions to add</div>
                    ) : (
                        <Form>
                            {availableAuthPoints.map(ap => (
                                <Form.Check
                                    key={ap.auth_point_id}
                                    type="checkbox"
                                    id={`authpoint-${ap.auth_point_id}`}
                                    label={`${ap.permission_code} (${ap.request_method} ${ap.request_path})`}
                                    checked={selectedAuthPointIds.includes(ap.auth_point_id)}
                                    onChange={() => toggleSelectAuthPoint(ap.auth_point_id)}
                                />
                            ))}
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleAddAuthPoints} disabled={selectedAuthPointIds.length === 0}>Add Selected</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default RoleAuthPointPage;
