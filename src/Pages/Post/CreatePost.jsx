import axios from "axios";
import { useState, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [, setImageUrl] = useState(''); // URL for the image after upload
  const [previewUrl, setPreviewUrl] = useState(''); // Preview URL for the selected image
  const [caption, setCaption] = useState('');   // Caption for the post
  const [file, setFile] = useState(null);       // Selected file
  const [loading, setLoading] = useState(false); // Loading state for the submit button
  const fileInputRef = useRef(null);
  const navigate = useNavigate(); // useNavigate hook for navigation

  const token = localStorage.getItem('token'); 

  // Handle image file change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    const filePreviewUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(filePreviewUrl);
  };

  // Handle missing token
  if (!token) {
    toast.error("Token is missing. Please log in again.");
    return null; 
  }

  // Upload image to server
  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const config = {
        headers: {
          apiKey: 'c7b411cc-0e7c-4ad1-aa3f-822b00e7734b',
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        'https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/upload-image',
        formData,
        config
      );

      setImageUrl(response.data.url);
      return response.data.url; // Returning the uploaded image URL
    } catch (error) {
      console.error("Upload failed:", error.response?.data || error.message);
      toast.error('Failed to upload image');
      return null;
    }
  };

  // Handle form submission for creating post
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please select an image to upload');
      return;
    }

    if (!caption) {
      toast.error('Please enter a caption');
      return;
    }

    setLoading(true);

    // First upload the image
    const uploadedImageUrl = await handleUpload();

    if (!uploadedImageUrl) {
      setLoading(false);
      return; // Stop if image upload fails
    }

    setImageUrl(uploadedImageUrl); // Optionally set imageUrl to state

    const postData = { imageUrl: uploadedImageUrl, caption };

    try {
      const config = {
        headers: {
          "Content-Type": 'application/json',
          apiKey: 'c7b411cc-0e7c-4ad1-aa3f-822b00e7734b',
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        'https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/create-post',
        postData,
        config
      );
      toast.success('Post created successfully!', { duration: 6000 });
      console.log("Post created:", response.data);

      // Clear form after successful submission
      setCaption('');
      setImageUrl('');
      setPreviewUrl('');
      setFile(null);
      fileInputRef.current.value = null;

      // Redirect user to the explore page
      navigate('/explore');
    } catch (error) {
      console.error("Failed to create post:", error.response?.data || error.message);
      toast.error('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* Back button */}
      <div className="absolute top-4 left-60 mt-2">
        <span
          onClick={() => navigate(-1)}
          className="text-sm text-gray-600 cursor-pointer hover:text-gray-900"
        >
          ← Back
        </span>
      </div>
      
      {/* Main Form */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Post</h1>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image:
            </label>
            <input 
              type="file"
              ref={fileInputRef} 
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              accept="image/*"
            />
          </div>

          {/* Image Preview */}
          {previewUrl && (
            <div className="image-preview mt-4">
              <img src={previewUrl} alt="Preview" className="rounded-lg w-full h-48 object-cover" />
            </div>
          )}

          {/* Caption Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Caption:
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)} 
              required
              className="block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your caption here"
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading} 
            className={`w-full py-2 px-4 font-semibold rounded-lg shadow-md text-white ${loading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
