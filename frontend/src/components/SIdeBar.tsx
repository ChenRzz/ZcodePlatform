import { Link } from "react-router-dom";
import { Nav, NavItem, NavLink } from "react-bootstrap";
import { FaKey, FaBookOpen } from "react-icons/fa";
import { useState } from "react";
import { useUser } from "../context/UserContext";

const Sidebar = () => {
    const { roles } = useUser();
    const [classMenuOpen, setClassMenuOpen] = useState(false);
    const [authMenuOpen, setAuthMenuOpen] = useState(false);

    const isAdmin = roles.includes("Administrator");
    const isTeacher = roles.includes("Teacher");
    const showClassMenu = isAdmin || isTeacher || true;
    const showAuthMenu = isAdmin;

    return (
        <div className="sidebar">
            <h4 style={{ marginBottom: "30px" }}>🌏 Module</h4>

            <Nav className="flex-column">
                {/* Class Dropdown */}
                {showClassMenu && (
                    <NavItem>
                        <NavLink
                            className="sidebar-link"
                            onClick={() => setClassMenuOpen(!classMenuOpen)}
                            style={{ color: "#fff", cursor: "pointer", marginBottom: "20px" }}
                        >
                            <FaBookOpen style={{ marginRight: "10px" }} />
                            Class
                        </NavLink>
                        {classMenuOpen && (
                            <div style={{ paddingLeft: "20px" }}>
                                <NavLink as={Link} to="/class/all" className="sidebar-link" style={{ color: "#fff" }}>
                                    All Classes
                                </NavLink>
                                <NavLink as={Link} to="/myclasses" className="sidebar-link" style={{ color: "#fff" }}>
                                    My Joined Classes
                                </NavLink>
                                {/* 只有教师或管理员显示 Manage My Classes */}
                                {(isTeacher || isAdmin) && (
                                    <NavLink as={Link} to="/class/manage_my_classes" className="sidebar-link" style={{ color: "#fff" }}>
                                        Manage My Classes
                                    </NavLink>
                                )}
                            </div>
                        )}
                    </NavItem>
                )}

                {/* Auth Management Dropdown */}
                {showAuthMenu && (
                    <NavItem>
                        <NavLink
                            className="sidebar-link"
                            onClick={() => setAuthMenuOpen(!authMenuOpen)}
                            style={{ color: "#fff", cursor: "pointer", marginBottom: "15px" }}
                        >
                            <FaKey style={{ marginRight: "10px" }} />
                            Auth Management
                        </NavLink>
                        {authMenuOpen && (
                            <div style={{ paddingLeft: "20px" }}>
                                <NavLink as={Link} to="/auth/role" className="sidebar-link" style={{ color: "#fff" }}>
                                    Role Management
                                </NavLink>
                                <NavLink as={Link} to="/auth/authPoint" className="sidebar-link" style={{ color: "#fff" }}>
                                    AuthPoint Management
                                </NavLink>
                                <NavLink as={Link} to="/auth/role_auth_point" className="sidebar-link" style={{ color: "#fff" }}>
                                    Role's AuthPoint Management
                                </NavLink>
                                <NavLink as={Link} to="/auth/user_role" className="sidebar-link" style={{ color: "#fff" }}>
                                    User's Role Management
                                </NavLink>
                            </div>
                        )}
                    </NavItem>
                )}
            </Nav>
        </div>
    );
};

export default Sidebar;
