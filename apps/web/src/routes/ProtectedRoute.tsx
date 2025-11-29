import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
// import { isLoggedIn } from "../utils/auth";

interface ProtectedRouteProps {
  children: ReactNode;
}   

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    let isLogin = false
  if (isLogin) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>; // ReactNode ko render karne ke liye fragment
};

export default ProtectedRoute;
