import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); 
  
  if (!token) {
    return <Navigate to="/login" replace />; 
  }

  // Render `children` jika kalo ada kalo ga ada pake `Outlet`
  return children ? children : <Outlet />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node,
};

export default ProtectedRoute;
