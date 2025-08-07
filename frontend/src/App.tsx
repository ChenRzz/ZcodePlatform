import AppRouter from "./router";
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
