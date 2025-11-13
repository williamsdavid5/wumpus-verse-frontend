import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Mapa from "./pages/Mapa";
import Inicio from "./pages/Inicio";
import MundosSalvos from "./pages/MundosSalvos";

export default function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Inicio />} />
        <Route path="/mundos-salvos" element={<MundosSalvos />} />
        <Route path="/mapa" element={<Mapa />} />
      </Routes>
    </Router>

  )
}