import { useState, useEffect } from "react";
import { getClassByID, getLecturesByClassID, createLecture, deleteLecture, updateLecture } from "../../services/class";
import { ArrowLeft, Trash, Edit, PlusCircle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import type { ClassInfo, LectureInfo } from "../../dto/response/class.ts";
import type { CreateLectureRequest, UpdateLectureRequest, DeleteLectureRequest } from "../../dto/request/class.ts";

const ClassManagement = () => {
    const { classId } = useParams<{ classId: string }>();
    const navigate = useNavigate();

    const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
    const [lectures, setLectures] = useState<LectureInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [isCreating, setIsCreating] = useState(false);
    const [newLecture, setNewLecture] = useState<CreateLectureRequest>({
        class_id: parseInt(classId || "0"),
        lecture_name: "",
        lecture_description: "",
        start_time: null,
        end_time: null,
        lecturer_z_code_id: "",
        lecturer_name: ""
    });

    const [editingLecture, setEditingLecture] = useState<LectureInfo | null>(null);

    // 转成 datetime-local 格式字符串，方便输入框显示
    const toDatetimeLocal = (value: string | null | undefined) => {
        if (!value) return "";
        return value.length >= 16 ? value.substring(0, 16) : value;
    };

    // 格式化时间字符串，发送给后台用（补足秒和时区Z）
    const formatDateTime = (value: string | null) => {
        if (!value) return null;
        let datetime = value;
        if (!datetime.endsWith(':00')) {
            datetime += ':00';
        }
        return datetime + 'Z';
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!classId) return;
            try {
                setLoading(true);
                const classData = await getClassByID({ class_id: parseInt(classId) });
                setClassInfo(classData);
                const lecturesData = await getLecturesByClassID({ class_id: parseInt(classId) });
                setLectures(lecturesData || []);
            } catch (err) {
                console.error("Failed to fetch data:", err);
                setError("Failed to load class details.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [classId]);

    const handleCreateLecture = async () => {
        try {
            await createLecture({
                ...newLecture,
                start_time: formatDateTime(newLecture.start_time),
                end_time: formatDateTime(newLecture.end_time)
            });
            if (classId) {
                const lecturesData = await getLecturesByClassID({ class_id: parseInt(classId) });
                setLectures(lecturesData || []);
            }
            setIsCreating(false);
            setNewLecture({
                class_id: parseInt(classId || "0"),
                lecture_name: "",
                lecture_description: "",
                start_time: null,
                end_time: null,
                lecturer_z_code_id: "",
                lecturer_name: ""
            });
        } catch (err) {
            console.error("Failed to create lecture:", err);
            setError("Failed to create lecture.");
        }
    };

    const handleDeleteLecture = async (lectureId: number) => {
        try {
            const deleteRequest: DeleteLectureRequest = { lecture_id: lectureId };
            await deleteLecture(deleteRequest);
            setLectures(lectures.filter(lecture => lecture.lecture_id !== lectureId));
        } catch (err) {
            console.error("Failed to delete lecture:", err);
            setError("Failed to delete lecture.");
        }
    };

    const handleUpdateLecture = async () => {
        if (!editingLecture) return;
        try {
            const updateRequest: UpdateLectureRequest = {
                lecture_id: editingLecture.lecture_id,
                class_id: parseInt(classId || "0"),
                lecture_name: editingLecture.lecture_name,
                lecture_description: editingLecture.lecture_description,
                start_time: formatDateTime(editingLecture.start_time),
                end_time: formatDateTime(editingLecture.end_time),
                lecturer_z_code_id: editingLecture.lecturer_z_code_id,
                lecturer_name: editingLecture.lecturer_name
            };
            const updatedLecture = await updateLecture(updateRequest);
            setLectures(lectures.map(lecture => lecture.lecture_id === updatedLecture.lecture_id ? updatedLecture : lecture));
            setEditingLecture(null);
        } catch (err) {
            console.error("Failed to update lecture:", err);
            setError("Failed to update lecture.");
        }
    };

    const handleEditLecture = (lecture: LectureInfo) => {
        setEditingLecture({ ...lecture });
    };

    if (loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted">Loading class details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
                <div className="text-center" style={{ maxWidth: '400px' }}>
                    <div className="alert alert-danger mb-4">{error}</div>
                    <button onClick={() => navigate(-1)} className="btn btn-primary">
                        Return
                    </button>
                </div>
            </div>
        );
    }

    if (!classInfo) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
                <div className="text-center" style={{ maxWidth: '400px' }}>
                    <p className="text-muted mb-4">No class details available</p>
                    <button onClick={() => navigate(-1)} className="btn btn-primary">
                        Return
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            <div className="row justify-content-center">
                <div className="col-12">
                    {/* Return Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="btn btn-link text-decoration-none p-0 mb-4"
                        style={{ color: '#6c757d' }}
                    >
                        <ArrowLeft size={16} className="me-1" />
                        Return
                    </button>

                    {/* Class Info */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h1 className="card-title h4 mb-0">{classInfo.class_name}</h1>
                            <p className="text-muted small">Class Code: {classInfo.class_code}</p>
                            <p className="text-muted small">Manager: {classInfo.class_manager_name}</p>
                            <p className="text-muted small">{classInfo.created_at}</p>
                        </div>
                    </div>

                    {/* Create Lecture */}
                    <button onClick={() => setIsCreating(true)} className="btn btn-success mb-3">
                        <PlusCircle size={16} className="me-2" />
                        Create New Lecture
                    </button>

                    {isCreating && (
                        <div className="card mb-4">
                            <div className="card-body">
                                <h6 className="fw-bold">Create New Lecture</h6>
                                <div>
                                    <input type="text" className="form-control mb-2" placeholder="Lecture Name"
                                           value={newLecture.lecture_name}
                                           onChange={(e) => setNewLecture({ ...newLecture, lecture_name: e.target.value })}
                                    />
                                    <textarea className="form-control mb-2" placeholder="Lecture Description"
                                              value={newLecture.lecture_description}
                                              onChange={(e) => setNewLecture({ ...newLecture, lecture_description: e.target.value })}
                                    />
                                    <input
                                        type="datetime-local"
                                        className="form-control mb-2"
                                        value={toDatetimeLocal(newLecture.start_time)}
                                        onChange={(e) => setNewLecture({ ...newLecture, start_time: e.target.value })}
                                    />
                                    <input
                                        type="datetime-local"
                                        className="form-control mb-2"
                                        value={toDatetimeLocal(newLecture.end_time)}
                                        onChange={(e) => setNewLecture({ ...newLecture, end_time: e.target.value })}
                                    />
                                    <input type="text" className="form-control mb-2" placeholder="Lecturer ZCode"
                                           value={newLecture.lecturer_z_code_id}
                                           onChange={(e) => setNewLecture({ ...newLecture, lecturer_z_code_id: e.target.value })}
                                    />
                                    <input type="text" className="form-control mb-2" placeholder="Lecturer Name"
                                           value={newLecture.lecturer_name}
                                           onChange={(e) => setNewLecture({ ...newLecture, lecturer_name: e.target.value })}
                                    />
                                    <button onClick={handleCreateLecture} className="btn btn-primary mt-2">
                                        Create Lecture
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Edit Lecture */}
                    {editingLecture && (
                        <div className="card mb-4">
                            <div className="card-body">
                                <h6 className="fw-bold">Edit Lecture</h6>
                                <div>
                                    <input type="text" className="form-control mb-2" placeholder="Lecture Name"
                                           value={editingLecture.lecture_name}
                                           onChange={(e) => setEditingLecture({ ...editingLecture, lecture_name: e.target.value })}
                                    />
                                    <textarea className="form-control mb-2" placeholder="Lecture Description"
                                              value={editingLecture.lecture_description}
                                              onChange={(e) => setEditingLecture({ ...editingLecture, lecture_description: e.target.value })}
                                    />
                                    <input
                                        type="datetime-local"
                                        className="form-control mb-2"
                                        value={toDatetimeLocal(editingLecture.start_time)}
                                        onChange={(e) => setEditingLecture({ ...editingLecture, start_time: e.target.value })}
                                    />
                                    <input
                                        type="datetime-local"
                                        className="form-control mb-2"
                                        value={toDatetimeLocal(editingLecture.end_time)}
                                        onChange={(e) => setEditingLecture({ ...editingLecture, end_time: e.target.value })}
                                    />
                                    <input type="text" className="form-control mb-2" placeholder="Lecturer ZCode"
                                           value={editingLecture.lecturer_z_code_id}
                                           onChange={(e) => setEditingLecture({ ...editingLecture, lecturer_z_code_id: e.target.value })}
                                    />
                                    <input type="text" className="form-control mb-2" placeholder="Lecturer Name"
                                           value={editingLecture.lecturer_name}
                                           onChange={(e) => setEditingLecture({ ...editingLecture, lecturer_name: e.target.value })}
                                    />
                                    <button onClick={handleUpdateLecture} className="btn btn-primary mt-2 me-2">
                                        Update Lecture
                                    </button>
                                    <button onClick={() => setEditingLecture(null)} className="btn btn-secondary mt-2">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Lectures List */}
                    <div className="card shadow-sm">
                        <div className="card-header bg-white">
                            <h2 className="card-title h5 mb-0">
                                Lectures List ({lectures.length})
                            </h2>
                        </div>
                        <div className="card-body p-0">
                            {lectures.length === 0 ? (
                                <div className="p-4 text-center">
                                    <p className="text-muted small mb-0">There are no lectures scheduled.</p>
                                </div>
                            ) : (
                                <div className="list-group list-group-flush">
                                    {lectures.map((lecture) => (
                                        <div key={lecture.lecture_id} className="list-group-item list-group-item-action">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6 className="fw-bold mb-2">{lecture.lecture_name}</h6>
                                                    <p className="text-muted small mb-2">{lecture.lecture_description}</p>
                                                    <p className="text-muted small mb-1">
                                                        Start: {lecture.start_time ? new Date(lecture.start_time).toLocaleString() : "N/A"}
                                                    </p>
                                                    <p className="text-muted small mb-1">
                                                        End: {lecture.end_time ? new Date(lecture.end_time).toLocaleString() : "N/A"}
                                                    </p>
                                                    <p className="text-muted small mb-0">
                                                        Lecturer: {lecture.lecturer_name || "N/A"}
                                                    </p>
                                                </div>
                                                <div className="d-flex">
                                                    <button onClick={() => handleEditLecture(lecture)} className="btn btn-sm btn-outline-primary me-2" title="Edit">
                                                        <Edit size={16} />
                                                    </button>
                                                    <button onClick={() => handleDeleteLecture(lecture.lecture_id)} className="btn btn-sm btn-outline-danger" title="Delete">
                                                        <Trash size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassManagement;
