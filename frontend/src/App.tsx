import AppRouter from "./router";
import Navbar from "./components/Navbar";
import Sidebar from "./components/SIdeBar";
import {BrowserRouter, useLocation} from "react-router-dom";
import "./index.css";


function AppContent() {
    const location = useLocation();

    const isClassroomPage = location.pathname.startsWith('/classroom/');

    if (isClassroomPage) {
        return (
            <>
                {/* Fixed Navbar */}
                <div className="navbar-container">
                    <Navbar />
                </div>

                {/* Classroom content without sidebar */}
                <div className="classroom-content" style={{ paddingTop: '70px' }}>
                    <AppRouter />
                </div>
            </>
        );
    }

    return (
        <>
            {/* Fixed Navbar */}
            <div className="navbar-container">
                <Navbar />
            </div>

            <div className="main-container">
                {/* Fixed Sidebar */}
                <div className="sidebar-container">
                    <Sidebar />
                </div>

                {/* Main content area */}
                <div className="content-container">
                    <AppRouter />
                </div>
            </div>
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;