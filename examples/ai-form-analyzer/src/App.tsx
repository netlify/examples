import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Submissions from "./pages/Submissions";
import SubmissionDetail from "./pages/SubmissionDetail";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/submissions" element={<Submissions />} />
        <Route path="/submissions/:key" element={<SubmissionDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
