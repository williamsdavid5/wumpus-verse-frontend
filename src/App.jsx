import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Mapa from "./pages/Mapa";
import Inicio from "./pages/Inicio";

export default function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Inicio />} />
        <Route path="/mapa" element={<Mapa />} />
      </Routes>
    </Router>

  )
}