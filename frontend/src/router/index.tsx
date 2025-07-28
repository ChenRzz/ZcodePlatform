import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/user/Login";
import Register from "../pages/user/Register";

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* 后续页面在这里添加 */}
        </Routes>
    );
};

export default AppRouter;
