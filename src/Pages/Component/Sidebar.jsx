import { Layout, Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UploadOutlined, UserOutlined, SearchOutlined, CompassOutlined, HomeOutlined, LogoutOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';
import { useState } from 'react';
import Logout from "../Auth/Logout"; // Import the Logout modal component

const siderStyle = {
  overflow: 'auto',
  height: '100vh',
  position: 'fixed',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarColor: 'unset',
  width: 120,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

const centerStyle = {
  flexGrow: 1, // Allow this div to grow and take up available space
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center', // Center items horizontally
};

const items = [
  { key: '1', icon: <HomeOutlined />, label: <Link to="/home">Home</Link> },
  { key: '2', icon: <SearchOutlined />, label: <Link to="/search">Search</Link> },
  { key: '3', icon: <UploadOutlined />, label: <Link to="/createpost">Post</Link> },
  { key: '4', icon: <CompassOutlined />, label: <Link to="/explore">Explore</Link> },
  { key: '5', icon: <UserOutlined />, label: <Link to="/profile">Profile</Link> },
];

const Sidebar = () => {
  const [isModalVisible, setIsModalVisible] = useState(false); // Manage modal state
  const navigate = useNavigate();

  const showModal = () => setIsModalVisible(true); // Open the modal
  const handleCancel = () => setIsModalVisible(false); // Close the modal

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from local storage
    toast.success('Logout successful!');
    setTimeout(() => { navigate('/login'); }, 10); // Redirect to login page after 2 seconds
    setIsModalVisible(false); // Close the modal after logout
  };

  return (
    <Layout.Sider style={siderStyle}>
      <div style={centerStyle}>
        <div className="flex justify-center items-center">
        <Link to="/home">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="size-20 mt-10 mb-10">
            <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" />
            <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 0 0 1.11-.71l.822-1.315a2.942 2.942 0 0 1 2.332-1.39ZM6.75 12.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Zm12-1.5a.75.75 0 1 0 0- 1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
          </svg>
          </Link >
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']} items={items} />
      </div>

      <div className="p-4 flex justify-center items-center">
        <LogoutOutlined className='text-white' />
        <button type="button" onClick={showModal} className="text-white px-2 rounded">
          Logout
        </button>

        {/* Add the Logout modal component */}
        <Logout
          isModalVisible={isModalVisible}
          handleCancel={handleCancel}
          handleLogout={handleLogout}
        />
      </div>
    </Layout.Sider>
  );
};

export default Sidebar;
