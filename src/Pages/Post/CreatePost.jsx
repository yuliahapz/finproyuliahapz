import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const CreatePost = () => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    // Simulate upload process and navigate back after submission
    setTimeout(() => {
      toast.success('Post submitted successfully!');
      setLoading(false);
      navigate(-1);  // Navigate back after submission
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Back button */}
      <div className="top-4 left-4 mt-6 ml-6">
        <span
          onClick={() => navigate(-1)}
          className="text-sm text-gray-600 cursor-pointer hover:text-gray-800"
        >
          ← Back
        </span>
      </div>

      {/* Centered Card */}
      <div className="flex flex-grow items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Create Post</h1>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Image Upload */}
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
              className={`w-full py-2 px-4 font-semibold rounded-lg shadow-md text-white ${
                loading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>

          {/* Toast Notifications */}
          <Toaster position="top-center" reverseOrder={false} />
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
