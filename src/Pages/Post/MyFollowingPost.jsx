import { useState, useEffect } from 'react';
import axios from 'axios';
import { toggleLike } from '../Like/LikePost';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartIconOutline, TrashIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import Pagination from '../Component/Pagination';
import toast from "react-hot-toast";

const MyFollowingPost = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [comments, setComments] = useState({});
    const [newComments, setNewComments] = useState({});
    const [commentsRequested, setCommentsRequested] = useState({});
    const userId = localStorage.getItem('userId');
    const postsPerPage = 10;

    // Fetch posts from API
    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/following-post?size=${postsPerPage}&page=${currentPage}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                        apiKey: 'c7b411cc-0e7c-4ad1-aa3f-822b00e7734b',
                    },
                });

                const fetchedPosts = response.data.data.posts;
                if (Array.isArray(fetchedPosts)) {
                    const sortedPosts = fetchedPosts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                    setPosts((prevPosts) => [...prevPosts, ...sortedPosts]);
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

    // Handle scrolling to load more posts
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop
                !== document.documentElement.offsetHeight
                || loading
            ) return;
            if (currentPage < totalPages) {
                setCurrentPage((prevPage) => prevPage + 1);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [currentPage, totalPages, loading]);

    const fetchComments = async (postId) => {
        try {
            if (commentsRequested[postId]) {
                // If comments were already requested, just toggle the display
                setCommentsRequested((prevRequested) => ({
                    ...prevRequested,
                    [postId]: !prevRequested[postId], // Toggle requested state
                }));
                return; // Exit early to prevent fetching comments again
            }
            const response = await axios.get(
                `https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/post/${postId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        apiKey: "c7b411cc-0e7c-4ad1-aa3f-822b00e7734b",
                    },
                }
            );
            const commentsData = response.data.data.comments || [];
            setComments((prevComments) => ({
                ...prevComments,
                [postId]: commentsData,
            }));
            setCommentsRequested((prevRequested) => ({
                ...prevRequested,
                [postId]: true, // Mark comments as requested for this post
            }));
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    // Create a new comment
    const createComment = async (postId) => {
        try {
            const token = localStorage.getItem("token");
            const newComment = newComments[postId] || "";
            if (!newComment) {
                return alert("Please write a comment before submitting.");
            }

            const response = await axios.post(
                `https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/create-comment`,
                {
                    postId,
                    comment: newComment,
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
            } else {
                console.error("Error creating comment:", response.data);
            }
            fetchComments(postId);
            setNewComments((prevNewComments) => ({
                ...prevNewComments,
                [postId]: "",
            }));
        } catch (error) {
            console.error("Error creating comment:", error);
        }
    };

    // Delete a comment
    const deleteComment = async (postId, commentId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(
                `https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/delete-comment/${commentId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                        apiKey: "c7b411cc-0e7c-4ad1-aa3f-822b00e7734b",
                    },
                }
            );
            setComments((prevComments) => ({
                ...prevComments,
                [postId]: prevComments[postId].filter((comment) => comment.id !== commentId),
            }));
            toast.success("Comment deleted successfully");
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    const handleCommentChange = (postId, comment) => {
        setNewComments((prevNewComments) => ({
            ...prevNewComments,
            [postId]: comment,
        }));
    };

    const toggleComments = (postId) => {
        setCommentsRequested(prev => ({ ...prev, [postId]: !prev[postId] }));
        if (!commentsRequested[postId]) {
            fetchComments(postId);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {error && <p className="text-red-500">{error}</p>}
            {loading && <p>Loading...</p>}
            {posts.length > 0 && (
                <div className="flex flex-col gap-4 overflow-y-auto h-[80vh]">
                    {posts.map((post) => (
                        <div key={post.id} className="bg-white rounded-lg shadow-md p-4 max-w-md mx-auto">
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
                                    <h2 className="text-lg font-bold">{post.user?.username}</h2>
                                </Link>
                            </div>
    
                            <Link to={`/post/${post.id}`}>
                                <img
                                    src={post.imageUrl || "https://cdn1-production-images-kly.akamaized.net/J_qaSn7xpC5d-kbHx-wCsOiFsuY=/800x450/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/4770934/original/018943800_1710311605-mountains-8451480_1280.jpg"}
                                    alt={post.title}
                                    className="w-full h-64 object-cover rounded-md mb-4"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://cdn1-production-images-kly.akamaized.net/J_qaSn7xpC5d-kbHx-wCsOiFsuY=/800x450/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/4770934/original/018943800_1710311605-mountains-8451480_1280.jpg";
                                    }}
                                />
                            </Link>
    
                            <div className="flex items-center mb-4">
                                <button onClick={() => toggleLike(post.id, post.isLike, setPosts)}>
                                    {post.isLike ? (
                                        <HeartIconSolid className="h-6 w-6 text-red-500 hover:text-red-600" />
                                    ) : (
                                        <HeartIconOutline className="h-6 w-6 text-gray-600 hover:text-gray-500" />
                                    )}
                                </button>
                                <span className="text-sm text-gray-900 ml-2">{post.totalLikes || 0} likes</span>
                                <h2 className="ml-auto mr-2">{post.caption}</h2>
                            </div>
    
                            <input
                                type="text"
                                value={newComments[post.id] || ""}
                                onChange={(e) => handleCommentChange(post.id, e.target.value)}
                                placeholder="Write a comment..."
                                className="w-full p-2 border rounded-md mb-2"
                            />
                            <div className="flex justify-between">
                                <button
                                    onClick={() => createComment(post.id)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 text-sm"
                                >
                                    Comment
                                </button>
                                <button
                                    onClick={() => toggleComments(post.id)}
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    {commentsRequested[post.id] ? "Hide Comments" : "Show Comments"}
                                </button>
                            </div>
    
                            {commentsRequested[post.id] && (
                                <div className="mt-2">
                                    {comments[post.id]?.map((comment) => (
                                        <div key={comment.id} className="flex justify-between items-center mb-1 text-sm">
                                            <div className="flex items-center space-x-2">
                                                <span className="font-bold">{comment.user?.username || "Unknown User"}:</span>
                                                <span>{comment.comment}</span>
                                            </div>
                                            {userId === comment.userId && (
                                                <TrashIcon
                                                    className="h-4 w-4 text-red-500 cursor-pointer"
                                                    onClick={() => deleteComment(post.id, comment.id)}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {/* Pagination Component */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );    
};    

export default MyFollowingPost;
