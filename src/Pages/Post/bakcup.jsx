// import { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import { toggleLike } from '../Like/LikePost';
// import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
// import { HeartIcon as HeartIconOutline, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
// import CreateComment from "../Comment/CreateComment";
// import { Link } from 'react-router-dom';
// import DeleteComment from "../Comment/DeleteComment";

// const MyFollowingPost = () => {
//     const [posts, setPosts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);
//     const [comments, setComments] = useState({}); // Store comments per post
//     const [visibleComments, setVisibleComments] = useState({}); // Track visibility per post
//     const userId = localStorage.getItem('userId');
//     console.log("Logged in user ID:", userId);

//     useEffect(() => {
//         const fetchPosts = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 const response = await axios.get(`https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/following-post?size=10&page=${currentPage}`, {
//                     headers: {
    
//                         'Content-Type': 'application/json',
//                         Authorization: `Bearer ${token}`,
//                         apiKey: 'c7b411cc-0e7c-4ad1-aa3f-822b00e7734b',
//                     },
//                 });
//                 let fetchedPosts = response.data.data.posts;
//                 if (Array.isArray(fetchedPosts)) {
//                     // Sorting posts by createdAt from newest to oldest
//                     fetchedPosts = fetchedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//                     setPosts(fetchedPosts);
//                     setTotalPages(response.data.data.totalPages);
//                 } else {
//                     throw new Error('No posts found or data is not an array');
//                 }
//             } catch (error) {
//                 setError(error.message);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchPosts();
//     }, [currentPage]);

//     const handlePreviousPage = () => {
//         if (currentPage > 1) {
//             setCurrentPage(currentPage - 1);
//         }
//     };

//     const handleNextPage = () => {
//         if (currentPage < totalPages) {
//             setCurrentPage(currentPage + 1);
//         }
//     };

//     const handleToggleComments = useCallback((postId) => {
//         setVisibleComments((prevVisible) => ({
//             ...prevVisible,
//             [postId]: !prevVisible[postId],
//         }));
//     }, []);
    
//     // In MyFollowingPost.js
// const handleCommentAdded = useCallback((postId, updatedComments) => {
//     setComments((prevComments) => ({
//         ...prevComments,
//         [postId]: updatedComments,
//     }));
// }, []);


// const handleDeleteComment = useCallback((postId, commentId) => {
//     setComments((prevComments) => ({
//         ...prevComments,
//         [postId]: prevComments[postId].filter(comment => comment.id !== commentId),
//     }));
// }, []);


//     return (
//         <div className="container mx-auto px-4 py-8">
//             <h1 className="text-2xl font-bold mb-4">My Following Posts</h1>
//             {error && <p className="text-red-500">{error}</p>}
//             {loading && <p>Loading...</p>}
//             {posts && (
//                 <div className="flex flex-col gap-4 overflow-y-auto h-[80vh]">
//                     {posts.map((post) => (
//                         <div key={post.id} className="bg-white rounded-lg shadow-md p-4">
//                             <div className="flex items-center mb-4">
//                                 <Link to={`/profile/${post.user?.id}`}>
//                                     <img
//                                         src={post.user?.profilePicture || 'https://akcdn.detik.net.id/community/media/visual/2024/09/27/jiraiya-dalam-naruto.webp?w=700&q=90'}
//                                         alt={post.user?.username || 'User'}
//                                         className="w-8 h-8 rounded-lg mr-2"
//                                         onError={(e) => {
//                                             e.target.onerror = null;
//                                             e.target.src = 'https://akcdn.detik.net.id/community/media/visual/2024/09/27/jiraiya-dalam-naruto.webp?w=700&q=90';
//                                         }}
//                                     />
//                                 </Link>
//                                 <Link to={`/profile/${post.user?.id}`}>
//                                     <h2 className="text-lg font-bold">{post.user?.username}</h2>
//                                 </Link>
//                             </div>
//                             <Link to={`/post/${post.id}`}>
//                                 <div>
//                                     <img
//                                         src={post.imageUrl || 'https://cdn1-production-images-kly.akamaized.net/J_qaSn7xpC5d-kbHx-wCsOiFsuY=/800x450/default-image.jpg'}
//                                         alt={post.caption || 'Post image'}
//                                         className="w-full h-96 object-cover mt-4"
//                                         onError={(e) => {
//                                             e.target.onerror = null;
//                                             e.target.src = 'https://cdn1-production-images-kly.akamaized.net/J_qaSn7xpC5d-kbHx-wCsOiFsuY=/800x450/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/4770934/original/018943800_1710311605-mountains-8451480_1280.jpg';
//                                         }}
//                                     />
//                                 </div>
//                             </Link>
//                             <div className="flex items-center ml-4 mt-4 mb-4">
//                                 <button onClick={() => toggleLike(post.id, post.isLike, setPosts)}>
//                                     {post.isLike ? (
//                                         <HeartIconSolid className="h-6 w-6 text-red-500" />
//                                     ) : (
//                                         <HeartIconOutline className="h-6 w-6 text-gray-400" />
//                                     )}
//                                 </button>
//                                 <button
//                                     className="ml-2"
//                                     onClick={() => handleToggleComments(post.id)}
//                                 >
//                                     <ChatBubbleLeftIcon className="h-6 w-6 text-gray-400" />
//                                 </button>
//                                 <span className="text-sm text-gray-600 ml-2">{post.totalLikes || 0} likes</span>
//                             </div>
//                             <p className="text-gray-600 mt-2">{post.caption}</p>
//                             {visibleComments[post.id] && (
//     <div className="mt-2">
//         <pre className="mb-2">comments:</pre>
//         {comments[post.id] && Array.isArray(comments[post.id]) ? (
//             comments[post.id].length > 0 ? (
//                 comments[post.id].map((comment) => (
//                     <div key={comment.id} className="mb-1 flex items-center">
//                         <span className="font-bold mr-2">{comment.user.username} :</span> {comment.comment}
//                         {comment.user.id === userId && (
//                             <div className='ml-auto'>
//                                 <DeleteComment 
//                                     postId={post.id} 
//                                     commentId={comment.id} 
//                                     onDeleteComment={handleDeleteComment}
//                                 />
//                             </div>
//                         )}
//                     </div>
//                 ))
//             ) : (
//                 <p>No comments yet</p> // Display this when there are no comments
//             )
//         ) : (
//             <p>No comments yet</p> // This line is mostly redundant since comments[post.id] should be an array
//         )}
//         {/* Comment Form */}
//         <CreateComment postId={post.id} onAddComment={(newComment) => handleCommentAdded(post.id, newComment)} />
//     </div>
// )}

//                         </div>
//                     ))}
//                 </div>
//             )}
//             <div className="flex justify-center mt-4">
//                 <button
//                     onClick={handlePreviousPage}
//                     disabled={currentPage === 1}
//                     className="bg-blue-500 text-white rounded px-4 py-2 mr-2"
//                 >
//                     Previous
//                 </button>
//                 <button
//                     onClick={handleNextPage}
//                     disabled={currentPage === totalPages}
//                     className="bg-blue-500 text-white rounded px-4 py-2"
//                 >
//                     Next
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default MyFollowingPost;

import { useState } from 'react';
import axios from 'axios';

const CreateComment = ({ postId, onAddComment }) => {
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

    return (
        <form onSubmit={handleCommentSubmit} className="mt-2 flex">
            <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="border rounded-l px-2 py-1 flex-grow"
                required
            />
            <button type="submit" className="bg-blue-500 text-white rounded-r px-4">
                Submit
            </button>
        </form>
    );
};

export default CreateComment;

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toggleLike } from '../Like/LikePost';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartIconOutline, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import CreateComment from "../Comment/CreateComment";
import { Link } from 'react-router-dom';
import DeleteComment from "../Comment/DeleteComment";

const MyFollowingPost = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [comments, setComments] = useState({}); // Store comments per post
    const [visibleComments, setVisibleComments] = useState({}); // Track visibility per post
    const userId = localStorage.getItem('userId');
    console.log("Logged in user ID:", userId);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/following-post?size=10&page=${currentPage}`, {
                    headers: {
    
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                        apiKey: 'c7b411cc-0e7c-4ad1-aa3f-822b00e7734b',
                    },
                });
                let fetchedPosts = response.data.data.posts;
                if (Array.isArray(fetchedPosts)) {
                    // Sorting posts by createdAt from newest to oldest
                    fetchedPosts = fetchedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setPosts(fetchedPosts);
                    setTotalPages(response.data.data.totalPages);
                } else {
                    throw new Error('No posts found or data is not an array');
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [currentPage]);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleToggleComments = useCallback((postId) => {
        setVisibleComments((prevVisible) => ({
            ...prevVisible,
            [postId]: !prevVisible[postId],
        }));
    }, []);
    
    // In MyFollowingPost.js
const handleCommentAdded = useCallback((postId, updatedComments) => {
    setComments((prevComments) => ({
        ...prevComments,
        [postId]: updatedComments,
    }));
}, []);


const handleDeleteComment = useCallback((postId, commentId) => {
    setComments((prevComments) => ({
        ...prevComments,
        [postId]: prevComments[postId].filter(comment => comment.id !== commentId),
    }));
}, []);


    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">My Following Posts</h1>
            {error && <p className="text-red-500">{error}</p>}
            {loading && <p>Loading...</p>}
            {posts && (
                <div className="flex flex-col gap-4 overflow-y-auto h-[80vh]">
                    {posts.map((post) => (
                        <div key={post.id} className="bg-white rounded-lg shadow-md p-4">
                            <div className="flex items-center mb-4">
                                <Link to={`/profile/${post.user?.id}`}>
                                    <img
                                        src={post.user?.profilePicture || 'https://akcdn.detik.net.id/community/media/visual/2024/09/27/jiraiya-dalam-naruto.webp?w=700&q=90'}
                                        alt={post.user?.username || 'User'}
                                        className="w-8 h-8 rounded-lg mr-2"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://akcdn.detik.net.id/community/media/visual/2024/09/27/jiraiya-dalam-naruto.webp?w=700&q=90';
                                        }}
                                    />
                                </Link>
                                <Link to={`/profile/${post.user?.id}`}>
                                    <h2 className="text-lg font-bold">{post.user?.username}</h2>
                                </Link>
                            </div>
                            <Link to={`/post/${post.id}`}>
                                <div>
                                    <img
                                        src={post.imageUrl || 'https://cdn1-production-images-kly.akamaized.net/J_qaSn7xpC5d-kbHx-wCsOiFsuY=/800x450/default-image.jpg'}
                                        alt={post.caption || 'Post image'}
                                        className="w-full h-96 object-cover mt-4"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://cdn1-production-images-kly.akamaized.net/J_qaSn7xpC5d-kbHx-wCsOiFsuY=/800x450/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/4770934/original/018943800_1710311605-mountains-8451480_1280.jpg';
                                        }}
                                    />
                                </div>
                            </Link>
                            <div className="flex items-center ml-4 mt-4 mb-4">
                                <button onClick={() => toggleLike(post.id, post.isLike, setPosts)}>
                                    {post.isLike ? (
                                        <HeartIconSolid className="h-6 w-6 text-red-500" />
                                    ) : (
                                        <HeartIconOutline className="h-6 w-6 text-gray-400" />
                                    )}
                                </button>
                                <button
                                    className="ml-2"
                                    onClick={() => handleToggleComments(post.id)}
                                >
                                    <ChatBubbleLeftIcon className="h-6 w-6 text-gray-400" />
                                </button>
                                <span className="text-sm text-gray-600 ml-2">{post.totalLikes || 0} likes</span>
                            </div>
                            <p className="text-gray-600 mt-2">{post.caption}</p>
                            {visibleComments[post.id] && (
                                <div className="mt-2">
                                    <pre className="mb-2">comments:</pre>
                                    {comments[post.id] && Array.isArray(comments[post.id]) && comments[post.id].length > 0 ? (
    comments[post.id].map((comment) => (
        <div key={comment.id} className="mb-1 flex items-center">
            <span className="font-bold mr-2">{comment.user.username} :</span> {comment.comment}
            {comment.user.id === userId && (
                <div className='ml-auto'>
                <DeleteComment 
                postId={post.id} 
                commentId={comment.id} 
                onDeleteComment={handleDeleteComment}
            />
            </div>
            )}
        </div>
    ))
) : (
    <p>No comments yet</p>
)}
                                    {/* Comment Form */}
                                    <CreateComment postId={post.id} onAddComment={(newComment) => handleCommentAdded(post.id, newComment)} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            <div className="flex justify-center mt-4">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="bg-blue-500 text-white rounded px-4 py-2 mr-2"
                >
                    Previous
                </button>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="bg-blue-500 text-white rounded px-4 py-2"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default MyFollowingPost;


import { useState } from 'react';
import axios from 'axios';

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
            <form onSubmit={handleCommentSubmit} className="mt-2 flex">
                <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="border rounded-l px-2 py-1 flex-grow"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white rounded-r px-4">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default CreateComment;
