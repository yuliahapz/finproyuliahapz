import { useLocation, useRoutes, Navigate } from 'react-router-dom';
import { routeList } from './Routes/RouteList';
import Sidebar from './Pages/Component/Sidebar';
import './index.css';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

const App = () => {
  const element = useRoutes(routeList);
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isProtectedRoute = !['/login', '/register'].includes(location.pathname);
  const isAuthenticated = localStorage.getItem('token');

  if (!isAuthenticated && isProtectedRoute) {
    toast.error('You must be logged in!');
    return <Navigate to="/login" replace />;
  }

  const renderLayout = () => {
    if (isProtectedRoute && isAuthenticated) {
      return (
        <div style={{ display: 'flex' }}>
          <Sidebar onCollapse={setSidebarCollapsed} /> {/* Pass onCollapse callback */}
          <div
            style={{
              marginLeft: sidebarCollapsed ? 80 : 200,
              transition: 'margin-left 0.3s',
              flex: 1,
            }}
          >
            {element}
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex justify-center items-center h-screen">
          {element}
        </div>
      );
    }
  };

  return renderLayout();
};

export default App;
