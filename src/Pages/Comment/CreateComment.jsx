import { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast'; 
const CreateComment = ({ postId, onAddComment }) => {
    const [comment, setComment] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        if (!comment.trim()) {
            return alert("Please write a comment before submitting.");
        }

        try {
            const token = localStorage.getItem("token");

            const response = await axios.post(
                'https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/create-comment',
                {
                    postId,
                    comment,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                        apiKey: "c7b411cc-0e7c-4ad1-aa3f-822b00e7734b",
                    },
                }
            );

            if (response.status === 200) {
                toast.success("Comment created successfully");

                // Pass the new comment to the parent component via onAddComment
                onAddComment(postId, [...(response.data.data.comments || [])]);

                // Clear the comment input
                setComment('');
            } else {
                console.error("Error creating comment:", response.data);
                toast.error("Failed to create comment.");
            }
        } catch (error) {
            console.error("Error creating comment:", error);
            toast.error("An error occurred while creating the comment.");
        }
    };

    return (
        <div className="create-comment mt-4">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full px-4 py-2 border rounded-md"
                />
                <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2">
                    Submit
                </button>
            </form>
        </div>
    );
};

CreateComment.propTypes = {
    postId: PropTypes.string.isRequired,
    onAddComment: PropTypes.func.isRequired,
};

export default CreateComment;
