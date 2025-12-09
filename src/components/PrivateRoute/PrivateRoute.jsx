import { useAuth } from "../../hooks/useAuth.jsx";
import { Navigate } from "react-router-dom";
export const PrivateRoute = ({ children }) => {
  const loggedIn = useAuth();
  return loggedIn ? children : <Navigate to="/" replace />;
};
