import { Navigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext'

export default function ProtecaoDeRotas({ children }) {
    const { usuario, token, carregando } = useAuth();

    if (carregando) {
        return null;
    }

    if (!usuario || !token) {
        return <Navigate to='/login' replace />
    }

    return children;
}