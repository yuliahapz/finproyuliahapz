import axios from "axios";
import { useEffect, useState } from "react";
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import Pagination from '../Component/Pagination';
import PropTypes from 'prop-types';
import { Image } from "antd";
import { toggleLike } from '../Like/LikePost';
import { TrashIcon, PencilSquareIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline"; 
import { useNavigate } from "react-router-dom";

const MyPost = ({ id }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState({});
  const [commentsRequested, setCommentsRequested] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const postsPerPage = 10;
  
  useEffect(() => {
    if (!id) {
      setError("No user ID provided.");
      setLoading(false);
      return;
    }

    const fetchAllPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        let allFetchedPosts = [];
        let page = 1;
        let totalFetchedPages = 1;

        while (page <= totalFetchedPages) {
          const response = await axios.get(`https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/users-post/${id}?size=10&page=${page}`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
              apiKey: 'c7b411cc-0e7c-4ad1-aa3f-822b00e7734b',
            },
          });

          const fetchedPosts = response.data.data.posts || [];
          totalFetchedPages = response.data.data.totalPages;
          allFetchedPosts = [...allFetchedPosts, ...fetchedPosts];
          page += 1;
        }
        const sortedPosts = allFetchedPosts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setTotalPages(Math.ceil(sortedPosts.length / postsPerPage));
        setPosts(sortedPosts);

      } catch (error) {
        console.error('Error fetching posts:', error.response ? error.response.data : error.message);
        setError('Failed to fetch posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllPosts();
  }, [id]);

  const toggleDropdown = (postId) => {
    setDropdownOpen(dropdownOpen === postId ? null : postId);
  };

  const toggleComments = (postId) => {
    setCommentsRequested((prev) => ({
      ...prev,
      [postId]: !prev[postId]
    }));
    if (!commentsRequested[postId]) {
      fetchComments(postId); // Fetch comments only when they are first requested
    }
  };

  const fetchComments = async (postId) => {
    try {
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

  // const deleteComment = async (postId, commentId) => {
  //   const token = localStorage.getItem('token');
  //   try {
  //     await axios.delete(`https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/post-comment/${commentId}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         apiKey: 'c7b411cc-0e7c-4ad1-aa3f-822b00e7734b',
  //       },
  //     });
  //     // Refresh comments after deletion
  //     fetchComments(postId);
  //   } catch (error) {
  //     console.error('Failed to delete comment', error);
  //   }
  // };

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

  const paginatedPosts = posts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">My Posts</h1>
      
      {paginatedPosts.length === 0 ? (
        <p className="text-center text-gray-500">No posts found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedPosts.map((post) => (
            <div key={post.id} className="bg-white shadow-lg rounded-lg overflow-hidden relative">
              {/* Image Section */}
              <Image
                src={post.imageUrl || "https://cdn1-production-images-kly.akamaized.net/J_qaSn7xpC5d-kbHx-wCsOiFsuY=/800x450/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/4770934/original/018943800_1710311605-mountains-8451480_1280.jpg" }
                alt="Post Image"
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://cdn1-production-images-kly.akamaized.net/J_qaSn7xpC5d-kbHx-wCsOiFsuY=/800x450/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/4770934/original/018943800_1710311605-mountains-8451480_1280.jpg"
                }}
              />
              
              {/* Post Actions (Edit/Delete) */}
              <div className="absolute top-2 right-2">
                <button onClick={() => toggleDropdown(post.id)} aria-label="More options">
                  <EllipsisVerticalIcon className="h-6 w-6 mt-2 text-lg text-bold text-gray-500" />
                </button>
                {dropdownOpen === post.id && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
                    <button
                      onClick={() => navigate(`/UpdatePost/${post.id}`)}
                      className="flex items-center p-2 hover:bg-gray-100 w-full text-left"
                      aria-label="Edit Post"
                    >
                      <PencilSquareIcon className="h-5 w-5 mr-2 text-gray-700" />
                      Edit
                    </button>
                    <button
                      onClick={() => navigate(`/DeletePost/${post.id}`)}
                      className="flex items-center p-2 hover:bg-gray-100 w-full text-left"
                      aria-label="Delete Post"
                    >
                      <TrashIcon className="h-5 w-5 mr-2 text-red-600" />
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {/* Post Content */}
              <div className="p-4">
                {/* Like Button & Count */}
                <div className="flex items-center">
                  <button
                    onClick={() => toggleLike(post.id, post.isLike, setPosts)}
                    aria-label={post.isLike ? "Unlike" : "Like"}
                  >
                    {post.isLike ? (
                      <HeartIconSolid className="h-6 w-6 mb-2 text-red-500" />
                    ) : (
                      <HeartIconOutline className="h-6 w-6 mb-2 text-gray-400" />
                    )}
                  </button>
                  <button onClick={() => toggleComments(post.id)}>
                    <ChatBubbleLeftIcon className="h-6 w-6 ml-2 mb-2 text-gray-400 hover:text-gray-600" />
                  </button>
                  <span className="ml-2 text-gray-600 mb-2 text-sm">{post.totalLikes || 0} likes</span>
                  <h2 className="ml-auto font-semibold mb-4 mr-2">{post.caption}</h2>
                  </div>

                {/* Timestamp */}
                <p className="text-gray-500 text-xs mt-2">Created At: {new Date(post.createdAt).toLocaleString()}</p>
                <p className="text-gray-500 text-xs mb-2">Updated At: {new Date(post.updatedAt).toLocaleString()}</p>
                </div>

              {/* Comment Section */}
              {commentsRequested[post.id] && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-700 mb-2">comments:</h3>
                  
                  {/* Tampilkan komentar yang sudah ada */}
                  {comments[post.id] && comments[post.id].map((comment) => (
                    <div key={comment.id} className="flex justify-between items-center mb-2">
                      <div className="flex items-center space-x-2">
                      <p className="text-sm text-gray-600">{comment.user?.username || "Unknown User"} :</p>
                      <p className="text-sm text-gray-600">{comment.comment}</p>
                    </div>
                    </div>
                  ))}

                  {/* Jika tidak ada komentar */}
                  {(!comments[post.id] || comments[post.id].length === 0) && (
                    <p className="text-gray-500">No comments yet.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onNext={handleNextPage} 
        onPrevious={handlePreviousPage} 
      />
    </div>
  );
};

MyPost.propTypes = {
  id: PropTypes.string.isRequired,
};

export default MyPost;
