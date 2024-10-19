import { Modal } from 'antd';

const Logout = ({ isModalVisible, handleCancel, handleLogout }) => {
  return (
    <Modal
      title="Confirm Logout"
      visible={isModalVisible}
      onOk={handleLogout} // Handle logout action when the "Ok" button is clicked
      onCancel={handleCancel} // Handle cancel action when the "Cancel" button is clicked
      okText="Yes, Logout"
      cancelText="Cancel"
    >
      <p>Are you sure you want to log out?</p>
    </Modal>
  );
};

export default Logout;
