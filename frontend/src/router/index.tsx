import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/user/Login";
import Register from "../pages/user/Register";
import MyClasses from "../pages/class/MyClasses.tsx";
import '../index.css';
import UserInfo from "../pages/user/UserInfo.tsx";

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/userinfo" element={<UserInfo />} />
            <Route path="/myclasses" element={<MyClasses />} />
        </Routes>
    );
};

export default AppRouter;
