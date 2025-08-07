import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {getMyClasses} from "../../services/class.ts";
import type {UserJoinedClassesInfo} from "../../dto/response/class.ts";

const MyClasses = () => {
    const [classes, setClasses] = useState<UserJoinedClassesInfo[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyClasses = async () => {
            try {
                const data = await getMyClasses();
                if (Array.isArray(data)) {
                    setClasses(data);
                } else {
                    console.error("Invalid data format from GetAllClasses:", data);
                    setClasses([]);
                }
            } catch (err) {
                console.error("Failed to fetch joined classes:", err);
                setClasses([]);
            }
        };
        fetchMyClasses();
    }, []);

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">🧑‍🏫 My Joined Classes</h2>
            <div className="row">
                {classes.map((cls) => (
                    <div className="col-md-4 mb-4" key={cls.class_participant_id}>
                        <div
                            className="card h-100 shadow-sm"
                            onClick={() => navigate(`/class/${cls.class_id}`)}
                            style={{ cursor: "pointer" }}
                        >
                            <div className="card-body">
                                <h5 className="card-title">{cls.class_name}</h5>
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <span className="badge bg-success">ClassCode: {cls.class_code}</span>
                                    <small className="text-muted">Professor: {cls.class_manager_name}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {classes.length === 0 && (
                    <p className="text-muted text-center mt-4">You haven’t joined any classes yet.</p>
                )}
            </div>
        </div>
    );
};

export default MyClasses;
