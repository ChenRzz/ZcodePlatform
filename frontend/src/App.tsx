import AppRouter from "./router"; // 你自己写的 router/index.tsx
import Navbar from "./components/Navbar";
import {BrowserRouter} from "react-router-dom";
import "./index.css";
function App() {
  return (
      <BrowserRouter>
        <Navbar />
        <AppRouter />
      </BrowserRouter>
  );
}

export default App;
