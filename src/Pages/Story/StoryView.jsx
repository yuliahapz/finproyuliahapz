import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const StoryView = ({ storyId }) => {
    const [stories, setStories] = useState([]); // Update to handle array of stories
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStories = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("No token found. Please log in again.");
                setError("No token found. Please log in again.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/story-views/${storyId}`, {
                    headers: {
                        apiKey: "c7b411cc-0e7c-4ad1-aa3f-822b00e7734b",
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data); // Log to inspect the structure
                setStories(response.data.data); // Set stories array
                setLoading(false);
            } catch (error) {
                console.error("Error fetching stories:", error);
                setError("Failed to fetch stories.");
                setLoading(false);
            }
        };

        fetchStories();
    }, [storyId]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="p-4">
            {stories.length > 0 ? (
                <div className="max-h-96 overflow-y-auto rounded-lg p-2 bg-white">
                    {stories.map((story) => (
                        <div key={story.id} className="flex items-center p-2">
                            <img 
                                src={story.user?.profilePictureUrl || 'https://via.placeholder.com/400'} 
                                alt={story.user?.username} 
                                className="w-12 h-12 rounded-full mr-3"
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/400'; }} // Fallback image
                            />
                            <p className="text-lg font-semibold text-gray-800">{story.user?.username}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600">No stories found.</p>
            )}
        </div>
    );
};

StoryView.propTypes = {
  storyId: PropTypes.string.isRequired,
};

export default StoryView;
