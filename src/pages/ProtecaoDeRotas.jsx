import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtecaoDeRotas({ children }) {
    const { usuario, token } = useAuth();

    if (!usuario || !token) {
        return <Navigate to='/login' replace />
    }

    return children;
}