import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams} from 'react-router-dom';
import { HeartIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
const PostById = () => {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const { id } = useParams();
  const navigate = useNavigate(); 
  

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/post/${id}`, {  // Using backticks for string interpolation
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            apiKey: 'c7b411cc-0e7c-4ad1-aa3f-822b00e7734b',
          },
        });
        console.log(response.data.data)
        setPost(response.data.data); // Assuming API returns `post`, not `posts`
      } catch (error) {
        console.error("Error fetching post:", error);
        setError(error.response ? error.response.data.message : error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen); // Toggle modal visibility
  };

  const handleBack = ()=> {
    navigate(-1); // Navigate back
  }

  if (isLoading) return <div className="spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="flexjustify-left min-h-screen bg-gray-100 p-4">
      <button
        className="mb-4 bg-blue-500 hover:bg-blue-700 text-white  px-4 rounded"
        onClick={handleBack}
      >
        Back
      </button>
      {post ? (
        <div className="flex items-center justify-center min-h-screen bg-gray-100"> {/* Menambahkan latar belakang dan pemusatan */}
        <div className="max-w-md overflow-hidden shadow-lg rounded-lg bg-white"> {/* Kartu */}
          <div className="cursor-pointer" 
          onClick={toggleModal}>
            <img
              className="w-full h-64 object-cover" // Mengatur tinggi gambar
              src={post.imageUrl || "https://carapandang.com/uploads/news/DsqaUeQGqut5MUneFABnolWx6FUpK58kqHPscu2w.jpg"}
              alt={post.caption || 'Post image'}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://cdn1-production-images-kly.akamaized.net/J_qaSn7xpC5d-kbHx-wCsOiFsuY=/800x450/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/4770934/original/018943800_1710311605-mountains-8451480_1280.jpg';
              }}
            />
          </div>
          <div className="px-6 py-4 mb-2">
            <h5 className="font-bold text-gray-800">Uploaded by: {post.user ? post.user.username : 'Rafael'}</h5>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{post.caption }</h2>
            <p className="text-gray-600 mb-2"><HeartIcon className="h-5 w-5 mb-1 inline-block mr-1" />  {post.totalLikes || 0 }</p>
            <p className="text-gray-600">Comments: {post.totalComments || 0}</p>
            <p className="text-gray-500 text-sm">Created At: {new Date(post.createdAt).toLocaleString()}</p>
            <p className="text-gray-500 text-sm">Updated At: {new Date(post.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
      
      
      ) : (
        <p>Post not found.</p>
      )}

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full">
            <div className="flex justify-end p-2">
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={toggleModal}
              >
                x
              </button>
            </div>
            <div className="p-4 mb-6">
              <img
                src={post.imageUrl || "https://carapandang.com/uploads/news/DsqaUeQGqut5MUneFABnolWx6FUpK58kqHPscu2w.jpg"}
                alt={post.caption || 'Post image'}
                className="w-full h-auto rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://cdn1-production-images-kly.akamaized.net/J_qaSn7xpC5d-kbHx-wCsOiFsuY=/800x450/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/4770934/original/018943800_1710311605-mountains-8451480_1280.jpg';
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostById;
