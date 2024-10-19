import axios from "axios";
import { useState, useRef } from "react";
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { toast, Toaster } from 'react-hot-toast';

const CreateStory = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [caption, setCaption] = useState('');
    const [imageUrl, setImageUrl] = useState('');  // Add imageUrl state
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setFile(null);
        setCaption('');
        setPreviewUrl('');
        setImageUrl(''); // Reset imageUrl when modal is closed
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        const filePreviewUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(filePreviewUrl);
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error('No file selected');
            return null;
        }
    
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error("Token is missing. Please log in again.");
            return null;
        }
    
        const formData = new FormData();
        formData.append('image', file);
    
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    apiKey: 'c7b411cc-0e7c-4ad1-aa3f-822b00e7734b',
                    'Content-Type': 'multipart/form-data', // Corrected content type
                },
            };
    
            // Upload the image and get the URL
            const response = await axios.post(
                'https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/upload-image',
                formData,
                config
            );

    
            const uploadedImageUrl = response.data.imageUrl; // Get the uploaded image URL
            setImageUrl(uploadedImageUrl); // Set the imageUrl state with the uploaded image URL
    
            // Create the story and send the imageUrl
            const storyData = new FormData();
            storyData.append('imageUrl', uploadedImageUrl); // Include imageUrl
            storyData.append('caption', caption); // Add caption if required
    
            const storyResponse = await axios.post(
                'https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/create-story',
                storyData,
                config
            );
            const STORY_ID = storyResponse.data.STORY_ID;
            console.log(response.data.data)
            toast.success('Story uploaded successfully');
            closeModal();
            return uploadedImageUrl; // Return the uploaded image URL

    
        } catch (error) {
            toast.error('Error uploading story: ' + (error.response?.data?.message || error.message));
            return null;
        }
    };
    

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

        const uploadedImageUrl = await handleUpload();

        if (!uploadedImageUrl) {
            setLoading(false);
            return; // Stop if image upload fails
        }

        // Ensure modal closes after the upload is complete
        setTimeout(() => {
            closeModal();  // Close the modal
        }, 100); // Small timeout to ensure state updates correctly
    
        setLoading(false); // Stop loading spinner after success
    };

    return (
        <div>
            <Toaster />
            <button
                className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
                onClick={openModal}
            >
                <PlusIcon className="h-6 w-6" />
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                    <div 
                        className="bg-white rounded-lg p-6 w-96 relative z-50" 
                        onClick={(e) => e.stopPropagation()} // Prevent modal from closing on click inside
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">Create Story</h2>
                            <button onClick={closeModal}>
                                <XMarkIcon className="h-6 w-6 text-gray-400" />
                            </button>
                        </div>
                        <h2 className="text-lg font-bold mb-2">Upload Image</h2>
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleFileChange} 
                            className="block mb-2 w-full border p-2 rounded"
                        />
                        {previewUrl && <img src={previewUrl} alt="Preview" className="mb-4" />}
                        <input 
                            type="text" 
                            value={caption} 
                            onChange={(e) => setCaption(e.target.value)} 
                            placeholder="Caption" 
                            className="block mb-4 w-full border p-2 rounded"
                        />
                        <button 
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 w-full" 
                            onClick={handleFormSubmit}
                            disabled={loading}
                        >
                            {loading ? 'Uploading...' : 'Upload'}
                        </button>
                        {imageUrl && (
                            <div className="mt-4">
                                <h3 className="text-sm font-bold">Uploaded Image URL:</h3>
                                <img src={imageUrl} alt="Uploaded" className="w-full h-auto mt-2" />
                                <p className="text-sm mt-2">Image URL: {imageUrl}</p>
                            </div>
                        )}
                    </div>
                    <div className="fixed inset-0" onClick={closeModal}></div>
                </div>
            )}
        </div>
    );
};

export default CreateStory;
