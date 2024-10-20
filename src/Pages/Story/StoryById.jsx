import axios from "axios";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal } from "antd"; // Import Modal and Button from Ant Design
import { TrashIcon, EyeIcon, EllipsisHorizontalCircleIcon } from "@heroicons/react/24/outline"; 
import StoryView from "./StoryView"; // Assuming you want to use this for modal or detailed views
import DeleteStory from "./DeleteStory"; // Import DeleteStory component

const StoryById = ({ storyId }) => {
    const [story, setStory] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for story view modal visibility
    const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete modal visibility
   
    // Fetch story based on storyId
    useEffect(() => {
        const fetchStory = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found. Please log in again.");
                return;
            }
            try {
                const response = await axios.get(
                    `https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/story/${storyId}`, {
                        headers: {
                            apiKey: "c7b411cc-0e7c-4ad1-aa3f-822b00e7734b",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log(response.data.data);
                setStory(response.data.data);
            } catch (error) {
                console.error("Error fetching story:", error);
            }
        };
        fetchStory();
    }, [storyId]);

    // Display loading message if story data is not yet fetched
    if (!story) return <div>Loading...</div>;

    // Function to format the createdAt date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const toggleDropdown = () => {
        setDropdownOpen(prev => !prev);
    };

    return (
        <div className="relative flex flex-col items-center">
            {/* Dropdown for options inside the modal */}
            <div className="relative mt-4">
                <button onClick={toggleDropdown} aria-label="More options" className="flex items-left">
                    <EllipsisHorizontalCircleIcon className="h-6 w-6 text-gray-900 " />
                </button>
                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
                        <button
                            onClick={() => {
                                setIsModalOpen(true); // Open modal to view story
                                setDropdownOpen(false); // Close dropdown after action
                            }}
                            className="flex items-center p-2 hover:bg-gray-100 w-full text-left"
                            aria-label="View Story"
                        >
                            <EyeIcon className="h-5 w-5 mr-2 text-gray-700" />
                            View Story
                        </button>
                        <button
                            onClick={() => {
                                setIsDeleteModalOpen(true); // Open delete confirmation modal
                                setDropdownOpen(false); // Close dropdown after action
                            }}
                            className="flex items-center p-2 hover:bg-gray-100 w-full text-left"
                            aria-label="Delete Story"
                        >
                            <TrashIcon className="h-5 w-5 mr-2 text-red-600" />
                            Delete Story
                        </button>
                        
                    </div>
                )}
            </div>
            {/* Story Image */}
            <img
                src={story.imageUrl || "https://www.shutterstock.com/image-photo/osaka-japan-september-13-2024-260nw-2518457567.jpg"}
                alt={story.name}
                className="w-full h-150 rounded-lg object-cover"
                onError={(e) => (e.target.src = "https://www.shutterstock.com/image-photo/osaka-japan-september-13-2024-260nw-2518457567.jpg")}
            />
            {/* Story Username */}
            <p className="mt-2 text-center text-xl font-semibold">{story.username}</p>
            {/* Story Caption */}
            <p className="mt-2 text-gray-700">{story.caption}</p>
            {/* Story Created Date */}
            <p className="mt-2 text-gray-700">Posted on: {formatDate(story.createdAt)}</p>

            {/* Modal for Viewing Story */}
            <Modal
                title="Story View"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)} // Close modal
                footer={null} // No footer buttons
            >
                <StoryView storyId={storyId} /> {/* Pass storyId to StoryView */}
            </Modal>

            {/* Delete Story Modal */}
            <DeleteStory 
                isModalOpen={isDeleteModalOpen} 
                setIsModalOpen={setIsDeleteModalOpen} 
                storyId={storyId} 
            />
        </div>
    );
};

// Define PropTypes
StoryById.propTypes = {
    storyId: PropTypes.string.isRequired,
};

export default StoryById;
