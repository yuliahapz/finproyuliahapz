import { useState, useEffect } from 'react';
import axios from 'axios';
import { toggleLike } from '../Like/LikePost';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import CreateComment from '../Comment/CreateComment';
import { Link } from 'react-router-dom';
import Pagination from '../Component/Pagination';
import { TrashIcon } from '@heroicons/react/24/outline';
const ExplorePost = () => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [comments, setComments] = useState({});
    const [commentFormVisible, setCommentFormVisible] = useState({});

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(
                    `https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/explore-post?size=10&page=${currentPage}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                            apiKey: 'c7b411cc-0e7c-4ad1-aa3f-822b00e7734b',
                        },
                    }
                );

                if (Array.isArray(response.data.data.posts)) {
                    const sortedPosts = response.data.data.posts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                    setPosts(sortedPosts);
                    setTotalPages(response.data.data.totalPages);
                } else {
                    throw new Error('No posts found or data is not an array');
                }
            } catch (error) {
                setError(`Error: ${error.response ? error.response.data.message : error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [currentPage]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const commentPromises = posts.map(post =>
                    axios.get(`https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/post/${post.id}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                            apiKey: 'c7b411cc-0e7c-4ad1-aa3f-822b00e7734b',
                        },
                    })
                );

                const commentsResponses = await Promise.all(commentPromises);
                const fetchedComments = commentsResponses.reduce((acc, response) => {
                    const postId = response.data.data.id;
                    acc[postId] = response.data.data.comments || [];
                    return acc;
                }, {});

                setComments(fetchedComments);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        if (posts.length) {
            fetchComments();
        }
    }, [posts]);

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

    const handleCommentAdded = (postId, newComment) => {
        setComments(prevComments => ({
            ...prevComments,
            [postId]: [...(prevComments[postId] || []), newComment],
        }));
    };

    const toggleCommentForm = (postId) => {
        setCommentFormVisible(prev => ({
            ...prev,
            [postId]: !prev[postId],
        }));
    };

    const deleteComment = async (postId, commentId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/delete-comment/${commentId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    apiKey: 'c7b411cc-0e7c-4ad1-aa3f-822b00e7734b',
                },
            });

            // Update comments state after deletion
            setComments(prevComments => ({
                ...prevComments,
                [postId]: prevComments[postId].filter(comment => comment.id !== commentId),
            }));
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map(post => (
                post.id && (
                    <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <Link to={`/post/${post.id}`}>
                            <img
                                src={post.imageUrl || "https://cdn1-production-images-kly.akamaized.net/J_qaSn7xpC5d-kbHx-wCsOiFsuY=/800x450/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/4770934/original/018943800_1710311605-mountains-8451480_1280.jpg"}
                                alt={post.caption}
                                className="w-full h-64 object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://cdn1-production-images-kly.akamaized.net/J_qaSn7xpC5d-kbHx-wCsOiFsuY=/800x450/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/4770934/original/018943800_1710311605-mountains-8451480_1280.jpg';
                                }}
                            />
                        </Link>
                        <div className="p-4">
                            <div className="flex items-center mb-4">
                                <Link to={`/profile/${post.user?.id}`}>
                                    <img
                                        src={post.user?.profilePictureUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcX9fmFcz6aeB7fkS13C5Rb4C8Yca7x0HNx9lc_8DsHsJp8BM3iWNnEhU70b3BHe4_OCM&usqp=CAU"} 
                                        alt={post.user?.username}
                                        className="w-8 h-8 mr-4 rounded-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcX9fmFcz6aeB7fkS13C5Rb4C8Yca7x0HNx9lc_8DsHsJp8BM3iWNnEhU70b3BHe4_OCM&usqp=CAU";
                                        }}
                                    />
                                </Link>
                                <Link to={`/profile/${post.user?.id}`}>
                                    <h2 className="text-lg font-bold">{post.user?.username || 'Sheila'}</h2>
                                </Link>
                            </div>
                            <p className="text-gray-900 mb-2">{post.caption}</p>
                            <div className="flex items-center mb-4">
                                <button onClick={() => toggleLike(post.id, post.isLike, setPosts)}>
                                    {post.isLike ? (
                                        <HeartIconSolid className="h-6 w-6 text-red-500 hover:text-red-600" />
                                    ) : (
                                        <HeartIconOutline className="h-6 w-6 text-gray-400 hover:text-gray-500" />
                                    )}
                                </button>
                                <span className="text-sm text-gray-600 ml-2">{post.totalLikes || 0} likes</span>
                                
                                <button onClick={() => toggleCommentForm(post.id)} className="ml-4">
                                    <ChatBubbleLeftIcon className="h-6 w-6 text-gray-400 hover:text-gray-500" />
                                </button>
                                <span className="text-sm text-gray-600 ml-2">{comments[post.id]?.length || 0} comments</span>
                            </div>
                            {/* Display Comments */}
                            <div className="mb-4">
    {comments[post.id] && comments[post.id].length > 0 ? (
        comments[post.id].map(comment => (
            <div key={comment.id} className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                    <span className="font-bold">{comment.user.username}:</span>
                    <span className="ml-2">{comment.comment}</span>
                </div>
                {/* Conditional rendering for delete button */}
                {comment.user.id === localStorage.getItem('userId') && (
                    <button
                        onClick={() => deleteComment(post.id, comment.id)}
                        className="text-red-500 hover:text-red-600 ml-2"
                    >
                        <TrashIcon className="h-4 w-4" />
                    </button>
                )}
            </div>
        ))
    ) : (
        <p>No comments yet</p>
    )}
</div>

                            {/* Display CreateComment component */}
                            {commentFormVisible[post.id] && (
                                <CreateComment postId={post.id} onAddComment={handleCommentAdded} />
                            )}
                        </div>
                    </div>
                )
            ))}
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-center mt-4">
                <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPrevious={handlePreviousPage} 
                    onNext={handleNextPage} 
                />
            </div>
        </div>
    );
};

export default ExplorePost;
