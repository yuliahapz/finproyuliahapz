import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import StoryById from "./StoryById"; // Component to display individual story details

const MyFollowingStories = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openStoryId, setOpenStory] = useState(null); // Start with null, so no modal is opened by default
    const [viewedStories, setViewedStories] = useState([]);

    // Load viewedStories from localStorage when the component mounts
    useEffect(() => {
        const storedViewedStories = JSON.parse(localStorage.getItem('viewedStories')) || [];
        setViewedStories(storedViewedStories);
    }, []);

    useEffect(() => {
        const fetchStories = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error("Token is missing. Please log in again.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    `https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/following-story?size=10&page=1`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                            apiKey: "c7b411cc-0e7c-4ad1-aa3f-822b00e7734b",
                        },
                    }
                );

                const fetchedStories = response.data.data.stories;
                if (Array.isArray(fetchedStories)) {
                    setStories(fetchedStories);
                } else {
                    throw new Error("No stories found or data is not an array");
                }
            } catch (error) {
                handleError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchStories();
    }, []);

    const handleError = (error) => {
        if (error.response) {
            setError(`Error: ${error.response.data.message}`);
            toast.error(`Error: ${error.response.data.message}`);
        } else if (error.request) {
            setError("Network error: Please check your connection.");
            toast.error("Network error: Please check your connection.");
        } else {
            setError(`Error: ${error.message}`);
            toast.error(`Error: ${error.message}`);
        }
    };

    const handleOpenStory = (storyId) => {
        setOpenStory(storyId); // Open modal for selected story

        // Add storyId to viewedStories and save it to localStorage
        setViewedStories((prev) => {
            const updatedViewedStories = [...new Set([...prev, storyId])];
            localStorage.setItem('viewedStories', JSON.stringify(updatedViewedStories));
            return updatedViewedStories;
        });

        // Set a timer to close the story modal after 5 seconds
        setTimeout(() => {
            handleCloseModal();
        }, 10000); // 5 seconds
    };

    const handleCloseModal = () => {
        setOpenStory(null); // Close modal
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="p-3">
            {stories.length === 0 ? (
                <p>No stories found.</p>
            ) : (
                <div className="flex overflow-x-auto whitespace-nowrap">
                    {stories.map((story) => (
                        <div key={story.id} className="flex-shrink-0 text-center mr-4">
                            <img
                                src={story.user?.profilePictureUrl || "https://images.unsplash.com/photo-1678286742832-26543bb49959?w=1400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"}
                                alt={story.user?.username || "Jordi"}
                                className={`w-20 h-20 rounded-full border-4 ${
                                    viewedStories.includes(story.id) ? 'border-gray-400' : 'border-pink-500'
                                } p-1`}
                                onClick={() => handleOpenStory(story.id)}
                                style={{ cursor: 'pointer' }}
                            />
                            <p className="mt-2 text-sm">{story.user?.username || "Erika"}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Tailwind Modal */}
            {openStoryId && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-4 rounded-lg relative w-11/12 md:w-1/2 max-h-screen overflow-y-auto">
                        {/* Close button */}
                        <button
                            className="absolute top-2 right-2 text-2xl font-bold text-gray-600 hover:text-gray-900"
                            onClick={handleCloseModal}
                        >
                            &times; {/* Close button symbol */}
                        </button>
                        
                        {/* Story content */}
                        <StoryById storyId={openStoryId} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyFollowingStories;
