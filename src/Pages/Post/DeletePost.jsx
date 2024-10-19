import { Modal } from "antd";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const DeletePost = () => {
  const [isModalVisible, setIsModalVisible] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  const handleOk = async () => {
    try {
      const token = localStorage.getItem('token');
      // Send delete request to server
      await axios.delete(`https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/delete-post/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          apiKey: 'c7b411cc-0e7c-4ad1-aa3f-822b00e7734b',
        },
      });
      toast.success("Post deleted successfully!");
      setIsModalVisible(false);  // Close modal after success
      setTimeout(() => { navigate('/profile'); }, 200); // Navigate back to the main page
    } catch (error) {
      toast.error("Failed to delete post. Please try again.");
      console.error('Error deleting post:', error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);  // Close modal
    setTimeout(() => { navigate('/profile'); }, 200);  // Navigate back to the previous page
  };

  return (
    <Modal
      title="Delete Post"
      open={isModalVisible}  // Corrected prop name
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Yes, Delete"
      cancelText="No, Cancel"
    >
      <p>Are you sure you want to delete this post?</p>
    </Modal>
  );
};

export default DeletePost;
