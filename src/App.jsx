import { useLocation, useRoutes, Navigate } from 'react-router-dom';
import { routeList } from './Routes/RouteList'; // Import routeList
import Sidebar from './Pages/Component/Sidebar';
import './index.css';
import { toast } from 'react-hot-toast';

const App = () => {
  const element = useRoutes(routeList); 
  const location = useLocation();

  // Check if the route is protected (any route except login/register)
  const isProtectedRoute = !['/login', '/register'].includes(location.pathname);

  // Check if the user is authenticated by looking for a token in localStorage
  const isAuthenticated = localStorage.getItem('token');

  // If not authenticated and on a protected route, redirect to login
  if (!isAuthenticated && isProtectedRoute) {
    toast.error('You must be logged in!');
    return <Navigate to="/login" replace />;
  }

  // Function to render the layout based on authentication and route protection
  const renderLayout = () => {
    if (isProtectedRoute && isAuthenticated) {
      return (
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <div style={{ marginLeft: 200, flex: 1 }}>
            {element} {/* Render the component for the current route */}
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex justify-center items-center h-screen">
          {element} {/* Render login/register forms centered on screen */}
        </div>
      );
    }
  };

  return renderLayout();
};

export default App;
