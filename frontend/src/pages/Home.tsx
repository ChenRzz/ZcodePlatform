// pages/Home.tsx
import { useEffect, useState } from "react";
import { GetAllClasses } from "../services/class";
import type {ClassInfo} from "../dto/response/class.ts";
import { useNavigate } from "react-router-dom";


const Home = () => {
    const [classes, setClasses] = useState<ClassInfo[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const data = await GetAllClasses();
                if (Array.isArray(data)) {
                    setClasses(data);
                } else {
                    console.error("Invalid data format from GetAllClasses:", data);
                    setClasses([]);
                }
            } catch (err) {
                console.error("Failed to fetch classes:", err);
                setClasses([]);
            }
        };
        fetchClasses();
    }, []);

    return (
        <>
            <div className="d-flex flex-column align-items-center justify-content-center vh-50 bg-light text-center p-4">
                <h1 className="display-4 text-dark mb-4">Welcome to Zcode Platform</h1>
                <p className="lead text-muted">Your Collaborative Classroom Coding Solution</p>
            </div>

            <div className="container mt-4">
                <h2 className="text-center mb-4">📚 All Classes</h2>
                <div className="row">
                    {classes.map((cls) => (
                        <div className="col-md-4 mb-4" key={cls.class_id}>
                            <div
                                className="card h-100 shadow-sm class-card"
                                onClick={() => navigate(`/class/${cls.class_id}`)}
                                style={{ cursor: "pointer" }}
                            >
                                <div className="card-body">
                                    <h5 className="card-title">{cls.class_name}</h5>
                                    <p className="card-text text-truncate">{cls.class_description}</p>
                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <span className="badge bg-primary">Code: {cls.class_code}</span>
                                        <small className="text-muted">{cls.class_manager_name}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Home;
