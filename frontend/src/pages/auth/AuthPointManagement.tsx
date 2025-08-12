import { useState, useEffect } from "react";
import { getAllAuthPoints, createAuthPoint, deleteAuthPoint, updateAuthPoint, getAuthPointByPermission } from "../../services/auth_permit.ts";
import type { CreateAuthPointRequest, UpdateAuthPointRequest, DeleteAuthPointRequest, getAuthPointRequestByPermission } from "../../dto/request/auth.ts";
import type {AuthPointInfo} from "../../dto/response/auth.ts";
import { Modal, Button, Form } from "react-bootstrap";

const AuthPointManagementPage = () => {
    const [authPoints, setAuthPoints] = useState<AuthPointInfo[]>([]); // AuthPoint 列表
    const [showModal, setShowModal] = useState(false); // 控制模态框显示与隐藏
    const [currentAuthPoint, setCurrentAuthPoint] = useState<AuthPointInfo | null>(null); // 当前编辑的 AuthPoint
    const [requestMethod, setRequestMethod] = useState(""); // 请求方法
    const [requestPath, setRequestPath] = useState(""); // 请求路径
    const [permissionCode, setPermissionCode] = useState(""); // 权限码
    const [isEditing, setIsEditing] = useState(false); // 是否为编辑模式
    const [searchPermissionCode, setSearchPermissionCode] = useState(""); // 搜索框中的权限码

    // 获取所有 AuthPoints 数据
    useEffect(() => {
        const fetchAuthPoints = async () => {
            try {
                const data = await getAllAuthPoints();
                setAuthPoints(data);
            } catch (err) {
                console.error("Failed to fetch auth points:", err);
            }
        };
        fetchAuthPoints();
    }, []);

    // 打开模态框，准备创建或更新 AuthPoint
    const handleShowModal = (authPoint?: AuthPointInfo) => {
        if (authPoint) {
            setRequestMethod(authPoint.request_method);
            setRequestPath(authPoint.request_path);
            setPermissionCode(authPoint.permission_code);
            setCurrentAuthPoint(authPoint);
            setIsEditing(true);  // 进入编辑模式
        } else {
            setRequestMethod("");
            setRequestPath("");
            setPermissionCode("");
            setCurrentAuthPoint(null);
            setIsEditing(false);  // 进入创建模式
        }
        setShowModal(true);
    };

    // 关闭模态框并清空数据
    const handleCloseModal = () => {
        setShowModal(false);
        setRequestMethod("");
        setRequestPath("");
        setPermissionCode("");
    };

    // 创建 AuthPoint
    const handleCreateAuthPoint = async () => {
        try {
            const newAuthPoint: CreateAuthPointRequest = {
                request_method: requestMethod,
                request_path: requestPath,
                permission_code: permissionCode,
            };
            const result = await createAuthPoint(newAuthPoint);
            if (result.message) {
                alert("AuthPoint created successfully!");
                setAuthPoints((prevPoints) => [
                    ...prevPoints,
                    { auth_point_id: Date.now(), request_method:requestMethod, request_path:requestPath, permission_code: permissionCode },
                ]);
            } else if (result.error) {
                alert("Error: " + result.error);
            } else {
                alert("Unknown response from server.");
            }
            handleCloseModal();
        } catch (err) {
            console.error("Failed to create AuthPoint:", err);
        }
    };

    // 更新 AuthPoint
    const handleUpdateAuthPoint = async () => {
        if (currentAuthPoint) {
            try {
                const updatedAuthPoint: UpdateAuthPointRequest = {
                    auth_point_id: currentAuthPoint.auth_point_id,
                    request_method: requestMethod,
                    request_path: requestPath,
                    permission_code: permissionCode,
                };
                const result = await updateAuthPoint(updatedAuthPoint);
                if (result.message) {
                    const updatedList = authPoints.map((ap) =>
                        ap.auth_point_id === currentAuthPoint.auth_point_id ? updatedAuthPoint : ap
                    );
                    setAuthPoints(updatedList);
                } else {
                    alert("Failed to update AuthPoint.");
                }
                handleCloseModal();
            } catch (err) {
                console.error("Failed to update AuthPoint:", err);
            }
        }
    };


    const handleDeleteAuthPoint = async (authPointId: number) => {
        try {
            const authpointidde:DeleteAuthPointRequest={
                auth_point_id: authPointId
            }
            const result = await deleteAuthPoint(authpointidde);
            if (result.message) {
                setAuthPoints((prevPoints) => prevPoints.filter((ap) => ap.auth_point_id !== authPointId));
            } else {
                alert("Error: Unable to delete AuthPoint.");
            }
        } catch (err) {
            console.error("Failed to delete AuthPoint:", err);
        }
    };

    // 搜索 AuthPoint
    const handleSearchAuthPoint = async () => {
        if (!searchPermissionCode) {
            alert("Please enter a permission code.");
            return;
        }
        try {
            const searchRequest: getAuthPointRequestByPermission = { permission_code: searchPermissionCode };
            const result = await getAuthPointByPermission(searchRequest);
            setAuthPoints([result]);
        } catch (err) {
            console.error("Failed to search AuthPoint:", err);
            alert("Failed to search AuthPoint.");
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">AuthPoint Management</h1>

            {/* 搜索框 */}
            <Form className="mb-4 d-flex">
                <Form.Control
                    type="text"
                    placeholder="Search by Permission Code"
                    value={searchPermissionCode}
                    onChange={(e) => setSearchPermissionCode(e.target.value)}
                />
                <Button variant="primary" className="ms-2" onClick={handleSearchAuthPoint}>
                    Search
                </Button>
            </Form>

            {/* 创建按钮 */}
            <Button variant="primary" onClick={() => handleShowModal()}>
                Create AuthPoint
            </Button>

            {/* AuthPoint 列表 */}
            <div className="mt-4">
                <table className="table table-bordered">
                    <thead>
                    <tr>
                        <th>Request Method</th>
                        <th>Request Path</th>
                        <th>Permission Code</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {authPoints.map((authPoint) => (
                        <tr key={authPoint.auth_point_id}>
                            <td>{authPoint.request_method}</td>
                            <td>{authPoint.request_path}</td>
                            <td>{authPoint.permission_code}</td>
                            <td>
                                <Button
                                    variant="warning"
                                    className="me-2"
                                    onClick={() => handleShowModal(authPoint)}
                                >
                                    Update
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDeleteAuthPoint(authPoint.auth_point_id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Modal - Create / Update AuthPoint */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? "Update AuthPoint" : "Create AuthPoint"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formRequestMethod">
                            <Form.Label>Request Method</Form.Label>
                            <Form.Control
                                type="text"
                                value={requestMethod}
                                onChange={(e) => setRequestMethod(e.target.value)}
                                placeholder="Enter request method"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formRequestPath">
                            <Form.Label>Request Path</Form.Label>
                            <Form.Control
                                type="text"
                                value={requestPath}
                                onChange={(e) => setRequestPath(e.target.value)}
                                placeholder="Enter request path"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPermissionCode">
                            <Form.Label>Permission Code</Form.Label>
                            <Form.Control
                                type="text"
                                value={permissionCode}
                                onChange={(e) => setPermissionCode(e.target.value)}
                                placeholder="Enter permission code"
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
                        onClick={isEditing ? handleUpdateAuthPoint : handleCreateAuthPoint} // 根据是否编辑来决定调用哪个函数
                    >
                        {isEditing ? "Update" : "Create"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AuthPointManagementPage;
