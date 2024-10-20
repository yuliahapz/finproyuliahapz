import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toggleLike } from '../Like/LikePost';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartIconOutline, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import CreateComment from "../Comment/CreateComment";
import { Link } from 'react-router-dom';
import DeleteComment from "../Comment/DeleteComment";
import Pagination from '../Component/Pagination';

const MyFollowingPost = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [comments, setComments] = useState({});
    const [visibleComments, setVisibleComments] = useState({});
    const userId = localStorage.getItem('userId');

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

                const fetchedPosts = response.data.data.posts;

                if (Array.isArray(fetchedPosts)) {
                    // Sort posts by updatedAt in descending order
                    const sortedPosts = fetchedPosts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                    setPosts(sortedPosts);
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
            {error && <p className="text-red-500">{error}</p>}
            {loading && <p>Loading...</p>}
            {posts.length > 0 && (
                <div className="flex flex-col gap-4 overflow-y-auto h-[80vh]">
                    {posts.map((post) => (
                        <div key={post.id} className="bg-white rounded-lg shadow-md p-4 max-w-md mx-auto">
                            <div className="flex items-center mb-4">
                                <Link to={`/profile/${post.user?.id}`}>
                                    <img
                                        src={post.user?.profilePicture || 'https://akcdn.detik.net.id/community/media/visual/2024/09/27/jiraiya-dalam-naruto.webp?w=700&q=90'}
                                        alt={post.user?.username || 'User'}
                                        className="w-8 h-8 rounded-full mr-2"
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
                                        className="w-full h-72 object-cover mt-4 rounded-lg"
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
                            <p className="text-gray-900 text-gray-900 mt-2">{post.caption}</p>
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
                                    <CreateComment postId={post.id} onAddComment={(newComment) => handleCommentAdded(post.id, newComment)} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
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

export default MyFollowingPost;
