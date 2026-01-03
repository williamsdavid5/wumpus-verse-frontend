import { Navigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext'

export default function ProtecaoDeRotas({ children }) {
    const { usuario, token, carregando, isTokenExpirado } = useAuth();

    if (carregando) {
        return null;
    }

    if (!usuario || !token || isTokenExpirado()) {
        return <Navigate to='/login' replace />
    }

    return children;
}