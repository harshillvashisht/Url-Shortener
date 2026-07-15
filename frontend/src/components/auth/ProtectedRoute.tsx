import useAuth from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";
import Spinner from "../common/Spinner";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, isInitializing } = useAuth();

    if (isInitializing) {
        return <Spinner />;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }
    
    return <>{children}</>;
    
}