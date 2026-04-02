import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Mapa from "./pages/Mapa";
import Inicio from "./pages/Inicio";
import MundosSalvos from "./pages/MundosSalvos";
import SaibaMais from "./pages/SaibaMais";
import Login from "./pages/Login";
import Registrar from "./pages/Registrar";
import { AvisoLayout } from "./pages/AvisoLayout";
import ProtecaoDeRotas from "./pages/ProtecaoDeRotas";
import NovaPartida from "./pages/NovaPartida";
import Execucao from "./pages/Execucao";
import Agentes from "./pages/Agentes";
import Historico from "./pages/Historico";
import Ranking from "./pages/Ranking";

export default function App() {
  return (
    <>
      {/* <AvisoLayout /> */}
      <Router>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/mundos-salvos"
            element={
              <ProtecaoDeRotas>
                <MundosSalvos />
              </ProtecaoDeRotas>
            }
          />
          <Route path="/mapa"
            element={
              <ProtecaoDeRotas>
                <Mapa />
              </ProtecaoDeRotas>
            }
          />
          <Route path="/saibamais" element={<SaibaMais />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registrar" element={<Registrar />} />
          <Route path="/nova-partida"
            element={
              <ProtecaoDeRotas>
                <NovaPartida />
              </ProtecaoDeRotas>
            }
          />
          <Route path="/execucao"
            element={
              <ProtecaoDeRotas>
                <Execucao />
              </ProtecaoDeRotas>
            }
          />
          <Route path="/agentes"
            element={
              <ProtecaoDeRotas>
                <Agentes />
              </ProtecaoDeRotas>
            }
          />
          <Route path="/historico"
            element={
              <ProtecaoDeRotas>
                <Historico></Historico>
              </ProtecaoDeRotas>
            }
          />
          <Route path="/ranking"
            element={
              <ProtecaoDeRotas>
                <Ranking />
              </ProtecaoDeRotas>
            }
          />
        </Routes>
      </Router>
    </>
  )
}