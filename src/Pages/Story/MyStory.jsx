import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
   

const MyStory = ({ storyId }) => {
    const [stories, setStories] = useState([]);
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
                // If storyId is provided, fetch a single story; otherwise, fetch all stories
                const response = await axios.get(
                    storyId 
                        ? `https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/story-views/${storyId}` // Fetch specific story
                        : `https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/following-story?size=10&page=1`, // Fetch all stories
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                            apiKey: "c7b411cc-0e7c-4ad1-aa3f-822b00e7734b",
                        },
                    }
                );

                const fetchedStories = storyId ? [response.data.data] : response.data.data.stories;

                if (Array.isArray(fetchedStories)) {
                    setStories(fetchedStories);
                } else {
                    throw new Error("Invalid data format. Stories should be an array.");
                }

            } catch (error) {
                console.error('Error fetching stories:', error);
                setError(error.message || "An error occurred while fetching stories.");
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, [storyId]); // Dependency on storyId to refetch if it changes

    if (loading) {
        return <div>Loading stories...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }
 
    MyStory.propTypes = {
      storyId: PropTypes.string.isRequired,
    };

    return (
        <div>
            <h2>My Stories</h2>
            <div className="story-grid">
                {stories.map(story => (
                    <div key={story.id} className="story-card">
                        <img src={story.imageUrl} alt={story.caption} className="story-image" />
                        <p>{story.caption}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyStory;
