import axios from "axios";
import { useState, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Modal, Button } from "antd";

const UpdatePost = () => {
  const { id } = useParams(); // Get the postId from the route parameters
  const [, setImageUrl] = useState(''); // URL for the image after upload
  const [previewUrl, setPreviewUrl] = useState(''); // Preview URL for the selected image
  const [caption, setCaption] = useState('');   // Caption for the post
  const [file, setFile] = useState(null);       // Selected file
  const [loading, setLoading] = useState(false); // Loading state for the submit button
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
  console.log('Post ID to update:', id);
  const fileInputRef = useRef(null);
  const navigate = useNavigate(); // useNavigate hook for navigation

  const token = localStorage.getItem('token'); 

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    setFile(selectedFile);

    const filePreviewUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(filePreviewUrl);
  };

  if (!token) {
    toast.error("Your session has expired. Please log in again.");
    setTimeout(() => { navigate('/login'); }, 200);
    return null; 
  }

  const handleUpload = async () => {
    if (!file) return null;

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
      toast.success('Image uploaded successfully!');
      return response.data.url; // Return the uploaded image URL
    } catch (error) {
      console.error("Upload failed:", error.response?.data || error.message);
      toast.error('Failed to upload image');
      return null;
    }
  };

  const handleFormSubmit = async () => {
    setIsModalVisible(false); // Close the modal before processing

    if (!caption) {
      toast.error('Please enter a caption');
      return;
    }

    setLoading(true);

    let uploadedImageUrl = previewUrl; // Keep the current image URL if no new image is uploaded

    // If a new file is selected, upload the new image
    if (file) {
      uploadedImageUrl = await handleUpload();
      if (!uploadedImageUrl) {
        setLoading(false);
        return; // Stop if image upload fails
      }
    }

    const postData = { imageUrl: uploadedImageUrl, caption };

    try {
      const config = {
        headers: {
          "Content-Type": 'application/json',
          apiKey: 'c7b411cc-0e7c-4ad1-aa3f-822b00e7734b',
          Authorization: `Bearer ${token}`,
        },
      };

      // Ensure the postId is correctly passed to the endpoint
      const response = await axios.post(
        `https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/update-post/${id}`,  // postId is used here
        postData,
        config
      );
      console.log(response);
      toast.success('Post updated successfully!');

      // Reset form after successful update
      setCaption('');
      setImageUrl('');
      setPreviewUrl('');
      setFile(null);
      fileInputRef.current.value = null;

      // Redirect after successful update
      navigate("/profile");
    } catch (error) {
      console.error("Failed to update post :", error.response?.data || error.message);
 toast.error('Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Update Post</h1>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image:
            </label>
            <input 
              type="file"
              ref={fileInputRef} 
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              accept="image/*"
            />
          </div>

          {previewUrl && (
            <div className="image-preview mt-4">
              <img src={previewUrl} alt="Preview" className="rounded-lg w-full h-48 object-cover" />
            </div>
          )}

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
          <Button 
            type="primary" 
            onClick={showModal} 
            disabled={loading} 
            className={`w-full py-2 px-4 font-semibold rounded-lg shadow-md text-white ${loading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}>
            {loading ? 'Submitting...' : 'Update Post'}
          </Button>
        </form>
      </div>

      <Modal 
        title="Confirm Update" 
        visible={isModalVisible} 
        onOk={handleFormSubmit} 
        onCancel={handleCancel}
        okText="Yes, Update" 
        cancelText="No, Cancel"
      >
        <p>Are you sure you want to update this post?</p>
      </Modal>
    </div>
  );
};

export default UpdatePost;