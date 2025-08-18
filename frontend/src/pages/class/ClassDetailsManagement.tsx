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

    const toDatetimeLocal = (value: string | null | undefined): string => {
        if (!value) return "";
        try {
            const date = new Date(value);
            if (isNaN(date.getTime())) return "";

            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');

            return `${year}-${month}-${day}T${hours}:${minutes}`;
        } catch (error) {
            console.error('Error converting to datetime-local:', error);
            return "";
        }
    };

    const formatDisplayTime = (value: string | null): string => {
        if (!value) return "N/A";
        try {
            const date = new Date(value);
            if (isNaN(date.getTime())) return "N/A";

            return date.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        } catch (error) {
            console.error('Error formatting display time:', error);
            return "N/A";
        }
    };

    const formatDateTime = (value: string | null) => {
        if (!value) return null;
        try {
            if (value.includes('T') && !value.includes('Z')) {
                const localDate = new Date(value);
                if (isNaN(localDate.getTime())) return null;
                return localDate.toISOString();
            }

            const date = new Date(value);
            if (isNaN(date.getTime())) return null;

            return date.toISOString();
        } catch (error) {
            console.error('Error formatting datetime:', error);
            return null;
        }
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
            const lectureData = {
                ...newLecture,
                start_time: formatDateTime(newLecture.start_time),
                end_time: formatDateTime(newLecture.end_time)
            };

            console.log('Creating lecture with data:', lectureData);

            await createLecture(lectureData);
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
        if (!confirm('Are you sure you want to delete this lecture?')) {
            return;
        }

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

            console.log('Updating lecture with data:', updateRequest);

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

    const handleEnterClassroom = (lectureId: number, lecturerZcode:string) => {
        navigate(`/classroom/${lectureId}/${lecturerZcode}`);
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
                            <p className="text-muted small">{formatDisplayTime(classInfo.created_at)}</p>
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
                                    <div className="mb-2">
                                        <label className="form-label small">Lecture Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter lecture name"
                                            value={newLecture.lecture_name}
                                            onChange={(e) => setNewLecture({ ...newLecture, lecture_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label small">Lecture Description</label>
                                        <textarea
                                            className="form-control"
                                            placeholder="Enter lecture description"
                                            value={newLecture.lecture_description}
                                            onChange={(e) => setNewLecture({ ...newLecture, lecture_description: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label small">Start Time</label>
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            value={toDatetimeLocal(newLecture.start_time)}
                                            onChange={(e) => setNewLecture({ ...newLecture, start_time: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label small">End Time</label>
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            value={toDatetimeLocal(newLecture.end_time)}
                                            onChange={(e) => setNewLecture({ ...newLecture, end_time: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label small">Lecturer ZCode</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter lecturer Z code"
                                            value={newLecture.lecturer_z_code_id}
                                            onChange={(e) => setNewLecture({ ...newLecture, lecturer_z_code_id: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label small">Lecturer Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter lecturer name"
                                            value={newLecture.lecturer_name}
                                            onChange={(e) => setNewLecture({ ...newLecture, lecturer_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="d-flex gap-2 mt-3">
                                        <button onClick={handleCreateLecture} className="btn btn-primary">
                                            Create Lecture
                                        </button>
                                        <button onClick={() => setIsCreating(false)} className="btn btn-secondary">
                                            Cancel
                                        </button>
                                    </div>
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
                                    <div className="mb-2">
                                        <label className="form-label small">Lecture Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter lecture name"
                                            value={editingLecture.lecture_name}
                                            onChange={(e) => setEditingLecture({ ...editingLecture, lecture_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label small">Lecture Description</label>
                                        <textarea
                                            className="form-control"
                                            placeholder="Enter lecture description"
                                            value={editingLecture.lecture_description}
                                            onChange={(e) => setEditingLecture({ ...editingLecture, lecture_description: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label small">Start Time</label>
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            value={toDatetimeLocal(editingLecture.start_time)}
                                            onChange={(e) => setEditingLecture({ ...editingLecture, start_time: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label small">End Time</label>
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            value={toDatetimeLocal(editingLecture.end_time)}
                                            onChange={(e) => setEditingLecture({ ...editingLecture, end_time: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label small">Lecturer ZCode</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter lecturer Z code"
                                            value={editingLecture.lecturer_z_code_id}
                                            onChange={(e) => setEditingLecture({ ...editingLecture, lecturer_z_code_id: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label small">Lecturer Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter lecturer name"
                                            value={editingLecture.lecturer_name}
                                            onChange={(e) => setEditingLecture({ ...editingLecture, lecturer_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="d-flex gap-2 mt-3">
                                        <button onClick={handleUpdateLecture} className="btn btn-primary">
                                            Update Lecture
                                        </button>
                                        <button onClick={() => setEditingLecture(null)} className="btn btn-secondary">
                                            Cancel
                                        </button>
                                    </div>
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
                                                        <strong>Start:</strong> {formatDisplayTime(lecture.start_time)}
                                                    </p>
                                                    <p className="text-muted small mb-1">
                                                        <strong>End:</strong> {formatDisplayTime(lecture.end_time)}
                                                    </p>
                                                    <p className="text-muted small mb-0">
                                                        <strong>Lecturer:</strong> {lecture.lecturer_name || "N/A"}
                                                    </p>
                                                </div>
                                                <div className="d-flex gap-2">
                                                    <button
                                                        onClick={() => handleEnterClassroom(lecture.lecture_id,lecture.lecturer_z_code_id)}
                                                        className="btn btn-sm btn-success"
                                                        title="Enter Online Classroom"
                                                    >
                                                        Enter
                                                    </button>
                                                    <button onClick={() => handleEditLecture(lecture)} className="btn btn-sm btn-outline-primary" title="Edit">
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