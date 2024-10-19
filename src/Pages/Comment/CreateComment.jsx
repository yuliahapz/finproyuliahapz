import { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const CreateComment = ({ postId, onAddComment, existingComments }) => {
    const [comment, setComment] = useState('');

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Session expired. Please log in again.');
                return;
            }

            // Send the comment to the API
            const response = await axios.post(
                `https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/create-comment`,
                { comment, postId },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                        apiKey: 'c7b411cc-0e7c-4ad1-aa3f-822b00e7734b',
                    },
                }
            ); 

            if (response.status === 200) {
                console.log('Comment created successfully');
                // Fetch the updated comments after creating a new comment
                const commentsResponse = await axios.get(
                    `https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/post/${postId}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                            apiKey: 'c7b411cc-0e7c-4ad1-aa3f-822b00e7734b',
                        },
                    }
                );

                // Assume the comments are in commentsResponse.data.comments
                const comments = commentsResponse.data.data.comments;
                if (Array.isArray(comments)) {
                    // Send the fetched comments back to the parent component
                    onAddComment(comments);
                }
            } else {
                console.error('Failed to create comment');
            }
        } catch (error) {
            console.error('Error creating comment:', error);
        }

        // Clear the input field after submitting
        setComment('');
    };
    
    CreateComment.propTypes = {
        postId: PropTypes.string.isRequired,
        onAddComment: PropTypes.func.isRequired,
        existingComments: PropTypes.array,
    };

    return (
        <div>
            {existingComments && existingComments.length > 0 && (
                <div className="mb-2">
                    <pre>Comments:</pre>
                    {existingComments.map((comment) => (
                        <div key={comment.id} className="mb-1 flex items-center">
                            <span className="font-bold mr-2">{comment.user.username}:</span> {comment.comment}
                        </div>
                    ))}
                </div>
            )}
            <form onSubmit={handleCommentSubmit} className="mt-2 flex flex-col sm:flex-row">
    <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
        className="border rounded-md px-2 py-1 flex-grow mb-2 sm:mb-0 sm:mr-1"
        required
    />
    <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-1">
        Submit
    </button>
</form>

        </div>
    );
};

export default CreateComment;
