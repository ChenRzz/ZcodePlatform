import { useEffect, useState } from "react";
import { getManagedClasses, createClass, updateClass, deleteClass } from "../../services/class";
import type { CreateClassRequest, UpdateClassInfoRequest, DeleteClassRequest } from "../../dto/request/class.ts";
import type { ClassInfo } from "../../dto/response/class.ts";

const ManageMyClasses = () => {
    const [classes, setClasses] = useState<ClassInfo[]>([]);
    const [newClass, setNewClass] = useState<CreateClassRequest>({
        class_name: "",
        class_code: "",
        class_description: "",
        class_manager_z_code_id: "",
        class_manager_name: "",
    });
    const [editingClass, setEditingClass] = useState<UpdateClassInfoRequest | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchClasses = async () => {
            setLoading(true);
            try {
                const data = await getManagedClasses();
                if (data.length === 0) {
                    setError("Have Not Created Any Classes");
                } else {
                    setClasses(data);
                    setError(null);
                }
                setLoading(false);
            } catch (err) {
                setError("Failed to load classes.");
                setLoading(false);
            }
        };
        fetchClasses();
    }, []);

    const handleCreateClass = async () => {
        if (!newClass.class_manager_z_code_id || !newClass.class_manager_name
            ||!newClass.class_name ||!newClass.class_code ||!newClass.class_description) {
            setError("Please provide all information.");
            return;
        }
        if (!newClass.class_manager_z_code_id || isNaN(Number(newClass.class_manager_z_code_id))) {
            setError("Please enter a valid number for the Class Manager Z Code ID.");
            return;
        }

        try {
            const newClassData: CreateClassRequest = {
                ...newClass,
            };

            await createClass(newClassData);
            setNewClass({
                class_name: "",
                class_code: "",
                class_description: "",
                class_manager_z_code_id: "",
                class_manager_name: "",
            });
            const data = await getManagedClasses();
            setClasses(data);
        } catch (err) {
            setError("Failed to create class.");
        }
    };

    const handleUpdateClass = async () => {
        if (editingClass) {
            if (!editingClass.class_manager_z_code_id || !editingClass.class_manager_name
                ||!editingClass.class_name ||!editingClass.class_code ||!editingClass.class_description) {
                setError("Please provide all information.");
                return;
            }
            if (!editingClass.class_manager_z_code_id || isNaN(Number(editingClass.class_manager_z_code_id))) {
                setError("Please enter a valid number for the Class Manager Z Code ID.");
                return;
            }
            try {
                await updateClass(editingClass);
                setEditingClass(null); // 更新后重置编辑状态
                const data = await getManagedClasses();
                setClasses(data);
            } catch (err) {
                setError("Failed to update class.");
            }
        }
    };

    const handleDeleteClass = async (classId: number) => {
        try {
            const deleteRequest: DeleteClassRequest = { class_id: classId };
            await deleteClass(deleteRequest);
            const data = await getManagedClasses();
            setClasses(data);
        } catch (err) {
            setError("Failed to delete class.");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <h2 className="my-4">Manage Your Classes</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            {/* Create New Class */}
            <div className="my-4">
                <h4>Create New Class</h4>
                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Class Name"
                            value={newClass.class_name}
                            onChange={(e) => setNewClass({ ...newClass, class_name: e.target.value })}
                        />
                        <input
                            type="text"
                            className="form-control mt-2"
                            placeholder="Class Code"
                            value={newClass.class_code}
                            onChange={(e) => setNewClass({ ...newClass, class_code: e.target.value })}
                        />
                        <textarea
                            className="form-control mt-2"
                            placeholder="Class Description"
                            value={newClass.class_description}
                            onChange={(e) => setNewClass({ ...newClass, class_description: e.target.value })}
                        />
                        <input
                            type="text"
                            className="form-control mt-2"
                            placeholder="Class Manager Name"
                            value={newClass.class_manager_name}
                            onChange={(e) => setNewClass({ ...newClass, class_manager_name: e.target.value })}
                        />
                        <input
                            type="text"
                            className="form-control mt-2"
                            placeholder="Please enter class manager Zcode"
                            value={newClass.class_manager_z_code_id}
                            onChange={(e) =>
                                setNewClass({
                                    ...newClass,
                                    class_manager_z_code_id:e.target.value,
                                })
                            }
                        />
                        <button className="btn btn-primary mt-3" onClick={handleCreateClass}>
                            Create Class
                        </button>
                    </div>
                </div>
            </div>

            {/* Existing Classes */}
            <div className="my-4">
                <h4>Your Created Classes</h4>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {classes.map((cls) => (
                        <div className="col" key={cls.class_id}>
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <h5 className="card-title">{cls.class_name}</h5>
                                    <p className="card-text">{cls.class_description}</p>
                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <span className="badge bg-primary">Code: {cls.class_code}</span>
                                        <small className="text-muted">{cls.class_manager_name}</small>
                                    </div>
                                </div>
                                <div className="card-footer d-flex justify-content-between">
                                    <button
                                        className="btn btn-info btn-sm"
                                        onClick={() =>
                                            setEditingClass({
                                                class_id: cls.class_id,
                                                class_name: cls.class_name,
                                                class_code: cls.class_code,
                                                class_description: cls.class_description,
                                                class_manager_z_code_id: cls.class_manager_zcode_id ? cls.class_manager_zcode_id.toString() : "",
                                                class_manager_name: cls.class_manager_name,
                                            })
                                        }
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDeleteClass(cls.class_id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Edit Class */}
            {editingClass && (
                <div className="my-4">
                    <h4>Edit Class</h4>
                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <input
                                type="text"
                                className="form-control"
                                value={editingClass.class_name}
                                onChange={(e) => setEditingClass({ ...editingClass, class_name: e.target.value })}
                            />
                            <input
                                type="text"
                                className="form-control mt-2"
                                value={editingClass.class_code}
                                onChange={(e) => setEditingClass({ ...editingClass, class_code: e.target.value })}
                            />
                            <textarea
                                className="form-control mt-2"
                                value={editingClass.class_description}
                                onChange={(e) => setEditingClass({ ...editingClass, class_description: e.target.value })}
                            />
                            <input
                                type="text"
                                className="form-control mt-2"
                                value={editingClass.class_manager_name}
                                onChange={(e) => setEditingClass({ ...editingClass, class_manager_name: e.target.value })}
                            />
                            <input
                                type="text"
                                className="form-control mt-2"
                                value={editingClass.class_manager_z_code_id}
                                onChange={(e) =>
                                    setEditingClass({
                                        ...editingClass,
                                        class_manager_z_code_id: e.target.value,
                                    })
                                }
                            />
                            <button className="btn btn-primary mt-3" onClick={handleUpdateClass}>
                                Update Class
                            </button>
                            <button
                                className="btn btn-secondary mt-3 ms-2"
                                onClick={() => setEditingClass(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageMyClasses;
