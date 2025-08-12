import  { useState, useEffect } from "react";
import { GetAllClasses, getMyClasses, JoinClass } from "../../services/class"; // 引入加入课程的服务层
import type { ClassInfo, UserJoinedClassesInfo } from "../../dto/response/class";
import { useNavigate } from "react-router-dom";
import {useUser} from "../../context/UserContext.tsx";

const AllClasses = () => {
    const [allClasses, setAllClasses] = useState<ClassInfo[]>([]);
    const [userClasses, setUserClasses] = useState<UserJoinedClassesInfo[]>([]);
    const [filteredClasses, setFilteredClasses] = useState<ClassInfo[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();


    const userRole = "student";
    const { username, userZcode } = useUser()
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const classes = await GetAllClasses();
                const userJoinedClasses = await getMyClasses();
                setAllClasses(classes);
                setUserClasses(userJoinedClasses || []);
                setFilteredClasses(classes);
                setLoading(false);
            } catch (err) {
                setError("Failed to load data.");
                setLoading(false);
            }
        };
        fetchData();
    }, []);


    const handleSearch = () => {
        if (searchQuery.trim()) {
            const filtered = allClasses.filter((cls) =>
                cls.class_code.includes(searchQuery.trim())
            );
            setFilteredClasses(filtered);
        } else {
            setFilteredClasses(allClasses);
        }
    };


    const isClassJoined = (courseCode: string) => {
        return userClasses.some((cls) => cls.class_code === courseCode);
    };

    const joinClass = async (classId: number, className: string) => {
        if (isClassJoined(className)) return;
        if (!username || !userZcode) {
            setError("You need to log in first.");
            return;
        }


        const zcode = userZcode;
        const classParti = {
            class_id: classId,
            class_name: className,
            user_zcode_id: zcode,
            username: username,
            user_role: userRole,
        };

        try {
            await JoinClass(classParti);
            const userJoinedClasses = await getMyClasses();
            setUserClasses(userJoinedClasses);
        } catch (err) {
            setError("Failed to join class.");
        }
    };

    if (loading) {
        return <div className="text-center">Loading courses...</div>;
    }

    if (error) {
        return <div className="text-center text-danger">{error}</div>;
    }

    return (
        <>
            <div className="d-flex flex-column align-items-center justify-content-center vh-50 bg-light text-center p-4">
                <h1 className="display-4 text-dark mb-4">Welcome to Zcode Platform</h1>
                <p className="lead text-muted">Your Collaborative Classroom Coding Solution</p>
            </div>

            <div className="container mt-4 text-center">
                <h2 className="mb-4">📚 All Classes</h2>
                <div className="d-flex justify-content-center mb-4">
                    <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Search by Class Code"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={handleSearch}>
                        Search
                    </button>
                </div>
            </div>

            <div className="container mt-4">
                <div className="row">
                    {filteredClasses.length === 0 ? (
                        <p className="text-center w-100">No classes found.</p>
                    ) : (
                        filteredClasses.map((cls) => (
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

                                        <button
                                            className={`btn mt-3 w-100 ${isClassJoined(cls.class_code) ? 'btn-secondary' : 'btn-primary'}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                joinClass(cls.class_id, cls.class_name);
                                            }}
                                            disabled={isClassJoined(cls.class_code)}
                                        >
                                            {isClassJoined(cls.class_code) ? "Already Joined" : "Join Class"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default AllClasses;
