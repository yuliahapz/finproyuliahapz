import axios from "axios";
import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
const StoryById = ({ storyId }) => {
    const [story, setStory] = useState(null);

    useEffect(() => {
        const fetchStory = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("No token found. Please log in again.");
                return;
            }
            try {
                const response = await axios.get(`https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/story/${storyId}`, {
                    headers: {
                        apiKey: "c7b411cc-0e7c-4ad1-aa3f-822b00e7734b",
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data.data);
                setStory(response.data.data); // Assuming the response structure
            } catch (error) {
                console.error("Error fetching story:", error);
            }
        };
        fetchStory();
    }, [storyId]);

    if (!story) return <div>Loading...</div>;

    StoryById.propTypes = {
        storyId: PropTypes.string.isRequired,
    };
    return (
        <div className="flex flex-col items-center">
            {/* Story image */}
            <img 
                src={story.imageUrl || "https://www.shutterstock.com/image-photo/osaka-japan-september-13-2024-260nw-2518457567.jpg" } 
                alt={story.name} 
                className="w-full h-150 rounded-lg object-cover" 
                onError={(e) => (e.target.src = "https://www.shutterstock.com/image-photo/osaka-japan-september-13-2024-260nw-2518457567.jpg")}
            />
            <p className="mt-2 text-center text-xl font-semibold">{story.username}</p>
            <p className="mt-2 text-gray-700">{story.caption}</p>
            <p className="mt-2 text-gray-700">{story.createdAt}</p>
        </div>
    );
};

export default StoryById;
