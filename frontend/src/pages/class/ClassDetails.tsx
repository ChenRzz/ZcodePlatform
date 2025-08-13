import { useState, useEffect } from "react";
import { getClassByID, getLecturesByClassID } from "../../services/class";
import { getMyClasses } from "../../services/class";
import { ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import type { ClassInfo, LectureInfo, UserJoinedClassesInfo } from "../../dto/response/class.ts";

const ClassDetails = () => {
    const { classId } = useParams<{ classId: string }>();
    const navigate = useNavigate();

    const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
    const [lectures, setLectures] = useState<LectureInfo[]>([]);
    const [userClasses, setUserClasses] = useState<UserJoinedClassesInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!classId) return;

            try {
                setLoading(true);

                const classData = await getClassByID({ class_id: parseInt(classId) });
                setClassInfo(classData);

                const lecturesData = await getLecturesByClassID({ class_id: parseInt(classId) });
                setLectures(lecturesData || []); // 确保lecturesData不为null

                const userJoinedClasses = await getMyClasses();
                setUserClasses(userJoinedClasses || []);

            } catch (err) {
                console.error("Failed to fetch data:", err);
                setError("Failed to load class details.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [classId]);

    const isClassJoined = (classCode: string) => {
        return userClasses.some((cls) => cls.class_code === classCode);
    };

    const formatDateTime = (dateTime: string | null) => {
        if (!dateTime) return "Not Set";
        try {
            return new Date(dateTime).toLocaleString('zh-CN');
        } catch (error) {
            return "Invalid Date";
        }
    };

    const handleEnterLecture = (lectureId: number) => {
        if (!classInfo || !isClassJoined(classInfo.class_code)) return;
        navigate(`/lecture/${lectureId}`);
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
                <div className="text-center" style={{maxWidth: '400px'}}>
                    <div className="alert alert-danger mb-4">{error}</div>
                    <button
                        onClick={() => navigate(-1)}
                        className="btn btn-primary"
                    >
                        Return
                    </button>
                </div>
            </div>
        );
    }

    if (!classInfo) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
                <div className="text-center" style={{maxWidth: '400px'}}>
                    <p className="text-muted mb-4">No class details available</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="btn btn-primary"
                    >
                        Return
                    </button>
                </div>
            </div>
        );
    }

    const hasJoined = isClassJoined(classInfo.class_code);

    return (
        <div className="container-fluid py-4">
            <div className="row justify-content-center">
                <div className="col-12">
                    {/* Return Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="btn btn-link text-decoration-none p-0 mb-4"
                        style={{color: '#6c757d'}}
                    >
                        <ArrowLeft size={16} className="me-1" />
                        Return
                    </button>

                    {/* Class Information Card */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h1 className="card-title h4 mb-0">
                                        {classInfo.class_name}
                                    </h1>
                                    <span className={`badge ${hasJoined ? 'bg-success' : 'bg-secondary'}`}>
                                        {hasJoined ? 'Joined' : 'Not Joined'}
                                    </span>
                                </div>

                                <div className="text-muted small">
                                    <div className="mb-1">Class Code: {classInfo.class_code}</div>
                                    <div className="mb-1">Manager: {classInfo.class_manager_name}</div>
                                    {classInfo.created_at && (
                                        <div>Created: {formatDateTime(classInfo.created_at)}</div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h6 className="fw-bold text-dark mb-2">Class Description:</h6>
                                <p className="text-muted small lh-base">
                                    {classInfo.class_description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Lectures List Card */}
                    <div className="card shadow-sm">
                        <div className="card-header bg-white">
                            <h2 className="card-title h5 mb-0">
                                Lectures List ({lectures?.length || 0})
                            </h2>
                        </div>

                        <div className="card-body p-0">
                            {!lectures || lectures.length === 0 ? (
                                <div className="p-4 text-center">
                                    <p className="text-muted small mb-0">There are no lectures scheduled.</p>
                                </div>
                            ) : (
                                <div className="list-group list-group-flush">
                                    {lectures.map((lecture) => (
                                        <div key={lecture.lecture_id} className="list-group-item list-group-item-action border-0">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div className="flex-grow-1 me-3">
                                                    <h6 className="fw-bold mb-2">
                                                        {lecture.lecture_name}
                                                    </h6>

                                                    <p className="text-muted small mb-3 lh-base">
                                                        {lecture.lecture_description}
                                                    </p>

                                                    <div className="text-muted" style={{fontSize: '0.75rem'}}>
                                                        <div className="mb-1">Lecturer: {lecture.lecturer_name}</div>
                                                        <div className="mb-1">Start At: {formatDateTime(lecture.start_time)}</div>
                                                        <div>End At: {formatDateTime(lecture.end_time)}</div>
                                                    </div>
                                                </div>

                                                <div className="flex-shrink-0">
                                                    <button
                                                        onClick={() => handleEnterLecture(lecture.lecture_id)}
                                                        disabled={!hasJoined}
                                                        className={`btn btn-sm ${
                                                            hasJoined
                                                                ? 'btn-primary'
                                                                : 'btn-secondary'
                                                        }`}
                                                        title={!hasJoined ? "Please join the class first" : "Enter lecture"}
                                                        style={{fontSize: '0.75rem'}}
                                                    >
                                                        Enter
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Not Joined Warning */}
                    {!hasJoined && (
                        <div className="alert alert-warning mt-4" role="alert">
                            <small>Please join the class first to access lectures.</small>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClassDetails;