import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Spinner from "../common/Spinner";

export default function PublicRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isInitializing } = useAuth();

  if (isInitializing) {
    return <Spinner />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}