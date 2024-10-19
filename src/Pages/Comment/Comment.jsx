// import { useEffect } from 'react';
// import axios from 'axios';

// const FComments = ({ postId, onAddComment }) => {
//     useEffect(() => {
//         const fetchComments = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 const response = await axios.get(`https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/post/${postId}`, {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         Authorization: `Bearer ${token}`,
//                         apiKey: 'c7b411cc-0e7c-4ad1-aa3f-822b00e7734b',
//                     },
//                 });

//                 const fetchedComments = response.data.data.comments;
//                 // Ensure the fetched comments are passed as an array
//                 if (Array.isArray(fetchedComments)) {
//                     onAddComment(postId, fetchedComments);
//                 } else {
//                     console.error('Fetched comments are not in the expected format.');
//                 }
//             } catch (error) {
//                 console.error('Error fetching comments:', error);
//             }
//         };

//         fetchComments();
//     }, [postId, onAddComment]);

//     return null; // No UI elements to render
// };

// export default Comments;
