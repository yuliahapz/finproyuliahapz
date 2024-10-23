import { useEffect, useState } from "react";
import axios from "axios";
import { TrashIcon } from "@heroicons/react/24/outline"; 
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Pagination from "../Component/Pagination";
import { toggleLike } from '../Like/LikePost';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';

const Explore = () => {
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState({});
    const [newComments, setNewComments] = useState({});
    const [commentsRequested, setCommentsRequested] = useState({}); // State for tracking requested comments
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const postsPerPage = 10;

     useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/explore-post?size=${postsPerPage}&page=${currentPage}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                            apiKey: "c7b411cc-0e7c-4ad1-aa3f-822b00e7734b",
                        },
                    }
                );

                if (Array.isArray(response.data.data.posts)) {
                    const sortedPosts = response.data.data.posts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                    setPosts(sortedPosts);
                    setTotalPages(response.data.data.totalPages);
                } else {
                    throw new Error("No posts found or data is not an array");
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchPosts();
    }, [currentPage]);

    
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
                [postId]: prevComments[postId].filter(
                    (comment) => comment.id !== commentId
                ),
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

    const toggleComments = (postId) => {
        setCommentsRequested(prev => ({ ...prev, [postId]: !prev[postId] }));
        if (!commentsRequested[postId]) {
            fetchComments(postId);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => (
                <div key={post.id} className="border p-4 rounded-lg shadow-lg flex flex-col">
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
                    <Link to={`/post/${post.id}`}>
                        <img
                            src={post.imageUrl || "https://cdn1-production-images-kly.akamaized.net/J_qaSn7xpC5d-kbHx-wCsOiFsuY=/800x450/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/4770934/original/018943800_1710311605-mountains-8451480_1280.jpg"}
                            alt={post.title}
                            className="w-full h-64 object-cover aspect-square rounded-md mb-4" // Set a fixed height for uniformity
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
                    
                    <div className="mt-4 space-y-2">
    {commentsRequested[post.id] ? (
        comments[post.id]?.length > 0 ? (
            comments[post.id].map((comment) => (
                <div key={comment.id} className="flex justify-between items-center mb-1 text-sm">
                    <div className="flex items-center space-x-2">
                        <span className="font-bold">{comment.user?.username || "Unknown User"}:</span>
                        <span>{comment.comment}</span>
                    </div>
                    {comment.user?.id === localStorage.getItem("userId") && (
                        <button
                            onClick={() => deleteComment(post.id, comment.id)}
                            className="text-red-500 hover:text-red-600"
                        >
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    )}
                </div>
            ))
        ) : (
            <p className="text-gray-500">No comments yet</p>
        )
    ) : (
        <p className="text-gray-500"></p>
    )}
</div>

                </div>
            ))}
            <div className="col-span-1 md:col-span-3 flex justify-center mt-4">
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

export default Explore;