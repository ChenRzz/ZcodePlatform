import { useState, useEffect } from "react";
import { getAllRoles, createRole, deleteRole, updateRole } from "../../services/auth_permit.ts";
import type { RoleInfo } from "../../dto/response/auth.ts";
import type { CreateRoleRequest, DeleteRoleRequest, UpdateRoleRequest } from "../../dto/request/auth.ts";
import { Modal, Button, Form } from "react-bootstrap";

const RoleManagementPage = () => {
    const [roles, setRoles] = useState<RoleInfo[]>([]); // 角色列表
    const [showModal, setShowModal] = useState(false); // 控制模态框显示与隐藏
    const [currentRole, setCurrentRole] = useState<RoleInfo | null>(null); // 当前编辑的角色
    const [roleName, setRoleName] = useState(""); // 角色名称
    const [roleDescription, setRoleDescription] = useState(""); // 角色描述
    const [isEditing, setIsEditing] = useState(false); // 是否为编辑模式

    // 获取所有角色数据
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const data = await getAllRoles();
                setRoles(data);
            } catch (err) {
                console.error("Failed to fetch roles:", err);
            }
        };
        fetchRoles();
    }, []);
    console.log(roles)
    // 打开模态框，准备创建或更新角色
    const handleShowModal = (role?: RoleInfo) => {
        if (role) {
            setRoleName(role.role_name);
            setRoleDescription(role.role_description);
            setCurrentRole(role);
            setIsEditing(true);  // 进入编辑模式
        } else {
            setRoleName("");
            setRoleDescription("");
            setCurrentRole(null);
            setIsEditing(false);  // 进入创建模式
        }
        setShowModal(true);
    };

    // 关闭模态框并清空数据
    const handleCloseModal = () => {
        setShowModal(false);
        setRoleName("");
        setRoleDescription("");
    };

    // 创建角色
    const handleCreateRole = async () => {
        try {
            const newRole: CreateRoleRequest = {
                role_name: roleName,
                description: roleDescription,
            };
            const result = await createRole(newRole);
            if (result.message) {
                alert("Role created successfully!");
                setRoles((prevRoles) => [...prevRoles, { role_name: roleName, role_description: roleDescription, role_id: Date.now() }]);
            } else if (result.error) {
                alert("Error: " + result.error);
            } else {
                alert("Unknown response from server.");
            }
            handleCloseModal();
        } catch (err) {
            console.error("Failed to create role:", err);
        }
    };
    const fetchRoles = async () => {
        try {
            const data = await getAllRoles(); // 获取角色数据
            setRoles(data); // 更新状态，渲染角色列表
        } catch (err) {
            console.error("Failed to fetch roles:", err);
        }
    };

    // 更新角色
    const handleUpdateRole = async () => {
        if (currentRole) {
            try {
                const updatedRole: UpdateRoleRequest = {
                    role_id: currentRole.role_id,
                    role_name: roleName,
                    description: roleDescription,
                };
                const result = await updateRole(updatedRole);
                if (result.message) {
                    fetchRoles();
                }else{
                    alert("Failed to update role");
                }
                handleCloseModal();
            } catch (err) {
                console.error("Failed to update role:", err);
            }
        }
    };

    // 删除角色
    const handleDeleteRole = async (roleId: number) => {
        try {
            const roleid:DeleteRoleRequest={
                role_id:roleId
            }
            const result = await deleteRole(roleid);
            if (result.message) {
                setRoles((prevRoles) => prevRoles.filter((role) => role.role_id !== roleId));
            } else {
                alert("Error: Unable to delete role.");
            }
        } catch (err) {
            console.error("Failed to delete role:", err);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Role Management</h1>

            {/* 创建按钮 */}
            <Button variant="primary" onClick={() => handleShowModal()}>
                Create Role
            </Button>

            {/* 角色列表 */}
            <div className="mt-4">
                <table className="table table-bordered">
                    <thead>
                    <tr>
                        <th>Role Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {roles.map((role) => (
                        <tr key={role.role_id}>
                            <td>{role.role_name}</td>
                            <td>{role.role_description}</td>
                            <td>
                                <Button
                                    variant="warning"
                                    className="me-2"
                                    onClick={() => handleShowModal(role)}
                                >
                                    Update
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDeleteRole(role.role_id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Modal - Create / Update Role */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? "Update Role" : "Create Role"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formRoleName">
                            <Form.Label>Role Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={roleName}
                                onChange={(e) => setRoleName(e.target.value)}
                                placeholder="Enter role name"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formRoleDescription">
                            <Form.Label>Role Description</Form.Label>
                            <Form.Control
                                type="text"
                                value={roleDescription}
                                onChange={(e) => setRoleDescription(e.target.value)}
                                placeholder="Enter role description"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        onClick={isEditing ? handleUpdateRole : handleCreateRole} // 根据是否编辑来决定调用哪个函数
                    >
                        {isEditing ? "Update" : "Create"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default RoleManagementPage;
