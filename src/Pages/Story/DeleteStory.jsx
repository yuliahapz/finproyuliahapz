import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Modal } from "antd";

const DeleteStory = ({ isModalOpen, setIsModalOpen, storyId }) => {
    const navigate = useNavigate();

    // Function to handle the delete action
    const handleOk = async () => {
        const token = localStorage.getItem('token');

        // Ensure the token exists before making the request
        if (!token) {
            toast.error("You need to log in to delete a story.");
            return;
        }

        try {
            // Send delete request to the server
            await axios.delete(`https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/delete-story/${storyId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    apiKey: 'c7b411cc-0e7c-4ad1-aa3f-822b00e7734b',
                },
            });

            // Show success message and navigate
            toast.success("Story deleted successfully!");
            setIsModalOpen(false); // Close modal after success

            // Redirect to the profile page after a brief pause
            setTimeout(() => {
                navigate('/profile');
            }, 200);
        } catch (error) {
            // Check for specific error responses and display appropriate messages
            if (error.response) {
                switch (error.response.status) {
                    case 404:
                        toast.error("You can only delete your own story.");
                        break;
                    case 403:
                        toast.error("You are not authorized to delete this story.");
                        break;
                    default:
                        toast.error("Failed to delete story. Please try again.");
                }
            } else {
                toast.error("Failed to delete story. Please try again.");
            }
            console.error('Error deleting story:', error);
        }
    };

    // Function to handle modal cancellation
    const handleCancel = () => {
        setIsModalOpen(false); // Close modal
    };

    return (
        <>
            {/* Modal for delete confirmation */}
            <Modal 
                title="Delete Story" 
                open={isModalOpen} 
                onOk={handleOk} 
                onCancel={handleCancel}
                okText="Yes, Delete"
                cancelText="No, Cancel"
            >
                <p>Are you sure you want to delete this story?</p>
            </Modal>
        </>
    );
};

export default DeleteStory;
