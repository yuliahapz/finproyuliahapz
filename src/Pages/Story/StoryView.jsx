import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';


const StoryView = ({ storyId }) => {
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStory = async () => {
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
                setStory(response.data.data.story); // Assuming `story` is in the response structure
                setLoading(false);
            } catch (error) {
                console.error("Error fetching story:", error);
                setError("Failed to fetch story.");
                setLoading(false);
            }
        };

        fetchStory();
    }, [storyId]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div>
            <h1>Story View</h1>
            {story ? (
                <div>
                    <h2>{story.title}</h2>
                    <p>{story.description}</p>
                    <img src={story.image} alt={story.title} />
                </div>
            ) : (
                <p>No story found.</p>
            )}
        </div>
    );
};

export default StoryView;

StoryView.propTypes = {
  storyId: PropTypes.string.isRequired,
};