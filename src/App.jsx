import { useLocation, useRoutes } from 'react-router-dom';
import { routeList } from './Routes/RouteList'; // Import routeList
import Sidebar from './Pages/Component/Sidebar';
import "./index.css";
import { toast } from 'react-hot-toast';

const App = () => { 
  const element = useRoutes(routeList); 
  const location = useLocation();

  const isProtectedRoute = !["/login", "/register"].includes(location.pathname); 

  const isAuthenticated = localStorage.getItem('token');

  if (!isAuthenticated && isProtectedRoute) {
    toast.error("You must be logged in!");
    return null; 
  } 
  const renderLayout = () => {
    if (isProtectedRoute && isAuthenticated) {
      return (
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <div style={{ marginLeft: 200, flex: 1 }}> {/* Adjust content margin for protected routes */}
            {element} {/* Render routed components */}
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex justify-center items-center h-screen">
          {element} {/* Center login/register forms */}
        </div>
      );
    }
  };

  return renderLayout();
};

export default App;
