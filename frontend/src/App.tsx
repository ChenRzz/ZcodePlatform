import AppRouter from "./router";
import Navbar from "./components/Navbar";
import Sidebar from "./components/SIdeBar";
import {BrowserRouter} from "react-router-dom";
import "./index.css";
function App() {
    return (
        <BrowserRouter>
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
        </BrowserRouter>
    );
}

export default App;
