import { Navigate } from "react-router-dom";
import { useAuth } from "./auth-context";
import Loading from "../user/component/loading/Loading";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;

  if (!user) return <Navigate to="/login" />;

  if (adminOnly && !user.isAdmin) return <Navigate to="/" />;

  return children;
}
