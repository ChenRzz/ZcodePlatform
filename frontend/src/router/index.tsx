import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/user/Login";
import Register from "../pages/user/Register";
import MyClasses from "../pages/class/MyClasses.tsx";
import '../index.css';
import UserInfo from "../pages/user/UserInfo.tsx";
import RoleManagement from "../pages/auth/RoleManagement.tsx";
import AllClasses from "../pages/class/AllClasses.tsx";
import ManageMyClasses from "../pages/class/ManageMyClasses.tsx";
import AuthPointManagementPage from "../pages/auth/AuthPointManagement.tsx";
import RoleAuthManagement from "../pages/auth/RoleAuthManagement.tsx";
import RoleAuthDetails from "../pages/auth/RoleAuthDetails.tsx";
import UserRoleManagement from "../pages/auth/UserRoleManagement.tsx";
import UserRoleDetails from "../pages/auth/UserRoleDetails.tsx";
import ClassDetails from "../pages/class/ClassDetails.tsx";
import ClassDetailsManagement from "../pages/class/ClassDetailsManagement.tsx";
import {ClassroomEntry} from "../pages/classroom/ClassroomEntry.tsx";

const AppRouter = () => {
    return (
        <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/userinfo" element={<UserInfo />} />
                <Route path="/myclasses" element={<MyClasses />} />
                <Route path="/auth/role" element={<RoleManagement />}/>
                <Route path="/class/all" element={<AllClasses />}/>
                <Route path="class/:classId" element={<ClassDetails />}/>
                <Route path="/class/manage_my_classes" element={<ManageMyClasses/>}/>
            <Route path="/class/class_management/:classId" element={<ClassDetailsManagement/>}/>
                <Route path="/auth/authPoint" element={<AuthPointManagementPage />}/>
                <Route path="/auth/role_auth_point" element={<RoleAuthManagement />}/>
                <Route path="/role/:roleId/authpoints" element={<RoleAuthDetails />}/>
                <Route path="/auth/user_role" element={<UserRoleManagement/>}/>
                <Route path="/manage-roles/:userId" element={<UserRoleDetails />} />
            <Route path="/classroom/:lectureId/:lecturerZcode/:lectureName" element={<ClassroomEntry />} />
        </Routes>
    );
};

export default AppRouter;
