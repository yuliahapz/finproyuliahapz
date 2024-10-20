import { useState } from "react";
import PropTypes from "prop-types"; 
import axios from "axios";
import { toast } from 'react-hot-toast';
import unfollowUser from "./unfollowUser"; // Ensure unfollowUser function is in the same folder

export const FollowUser = ({ userId, isFollowing, onFollowChange }) => {
    const [loading, setLoading] = useState(false);

    if (!userId) {
        return null;
    }

    // Fungsi untuk follow user
    const followUser = async () => {
        try {
            await axios.post(
                `https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/follow`,
                { userIdFollow: userId },
                {
                    headers: {
                        apiKey: "c7b411cc-0e7c-4ad1-aa3f-822b00e7734b",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            toast.success("User followed!");
            onFollowChange(true, 1); 
        } catch (error) {
            console.error("Error following user:", error.response ? error.response.data : error);
            const errorMessage = error.response?.data?.message || "Failed to follow user.";
            toast.error(errorMessage);
        }
    };  

    // Handler untuk toggle follow/unfollow
    const handleFollowToggle = async () => {
        setLoading(true);
        try {
            if (isFollowing) {
                await unfollowUser(userId); 
                onFollowChange(false, -1); 
            } else {
                await followUser(); 
            }
        } catch (error) {
            console.error("Error toggling follow state:", error);
            toast.error("Something went wrong while updating follow status.");
        } finally {
            setLoading(false); 
        }
    };

    return (
        <button
            className={`py-1 px-4 rounded-lg ${isFollowing ? "bg-red-500 text-white" : "bg-blue-500 text-white"} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={handleFollowToggle}
            disabled={loading}
        >
            {loading ? "Processing..." : isFollowing ? "Unfollow" : "Follow"}
        </button>
    );
};

FollowUser.propTypes = {
    userId: PropTypes.string.isRequired,
    isFollowing: PropTypes.bool.isRequired,
    onFollowChange: PropTypes.func.isRequired,
};

export default FollowUser;
