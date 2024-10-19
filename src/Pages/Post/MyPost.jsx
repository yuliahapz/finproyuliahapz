import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { TrashIcon, PencilSquareIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline"; 
import { Image } from "antd";
import { toggleLike } from '../Like/LikePost';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import Pagination from '../Component/Pagination';
import PropTypes from 'prop-types';


const MyPost = ({ id }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  // Get posts for the current page
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
                src={post.imageUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcX9fmFcz6aeB7fkS13C5Rb4C8Yca7x0HNx9lc_8DsHsJp8BM3iWNnEhU70b3BHe4_OCM&usqp=CAU'}
                alt="Post Image"
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcX9fmFcz6aeB7fkS13C5Rb4C8Yca7x0HNx9lc_8DsHsJp8BM3iWNnEhU70b3BHe4_OCM&usqp=CAU';
              }}
              />
              
              {/* Post Content */}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 truncate">{post.caption}</h2>
                <p className="text-sm text-gray-600 my-2">{post.body}</p>
                
                {/* Like Button & Count */}
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => toggleLike(post.id, post.isLike, setPosts)}
                    aria-label={post.isLike ? "Unlike" : "Like"}
                  >
                    {post.isLike ? (
                      <HeartIconSolid className="h-6 w-6 text-red-500" />
                    ) : (
                      <HeartIconOutline className="h-6 w-6 text-gray-400" />
                    )}
                  </button>
                  <span className="ml-2 text-gray-600 text-sm">{post.totalLikes || 0} likes</span>
                </div>
              </div>
    
              {/* Post Actions (Edit/Delete) */}
              <div className="absolute top-2 right-2">
                <button onClick={() => toggleDropdown(post.id)} aria-label="More options">
                  <EllipsisVerticalIcon className="h-6 w-6 text-gray-500" />
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
    
              {/* Post Date Info */}
              <div className="px-4 pb-4">
                <p className="text-xs text-gray-400">Created: {new Date(post.createdAt).toLocaleDateString('en-US')}</p>
                <p className="text-xs text-gray-400">Updated: {new Date(post.updatedAt).toLocaleDateString('en-US')}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Pagination */}
      <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPrevious={handlePreviousPage} 
                onNext={handleNextPage} 
            />
</div>
    
  );
};

MyPost.propTypes = {
  id: PropTypes.string.isRequired,
};

export default MyPost;
