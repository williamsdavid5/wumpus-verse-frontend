import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Mapa from "./pages/Mapa";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Mapa />} />
      </Routes>
    </Router>

  )
}