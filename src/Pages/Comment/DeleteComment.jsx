import axios from 'axios';
import { toast } from 'react-hot-toast';
import { TrashIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';

const DeleteComment = ({ postId, commentId, onDeleteComment }) => {
    const handleDelete = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await axios.delete(
                `https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/delete-comment/${commentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        apiKey: 'c7b411cc-0e7c-4ad1-aa3f-822b00e7734b',
                    },
                }
            );

            if (response.status === 200) {
                toast.success("Comment deleted successfully!");
                onDeleteComment(postId, commentId); // Memanggil fungsi untuk memperbarui state
            } else {
                toast.error("Failed to delete comment.");
            }
        } catch (error) {
            toast.error("Error: " + (error.response?.data?.message || error.message));
        }
    };

DeleteComment.propTypes = {
  postId: PropTypes.string.isRequired,
  commentId: PropTypes.string.isRequired,
  onDeleteComment: PropTypes.func.isRequired,
};

    return (
        <button onClick={handleDelete} aria-label="Delete comment">
            <TrashIcon className="h-4 w-4 text-right text-red-500 hover:text-red-700 transition-colors" />
        </button>
    );
};

export default DeleteComment;
