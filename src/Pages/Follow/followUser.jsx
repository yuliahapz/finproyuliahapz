import { useState } from "react";
import PropTypes from "prop-types"; 
import axios from "axios";
import { toast } from 'react-hot-toast';
import FollowButton from "./FollowButton";
import unfollowUser from "./unfollowUser";

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
            onFollowChange(true, 1); // Update status follow
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
                await unfollowUser(userId); // Panggil fungsi unfollow di sini
                onFollowChange(false, -1); // Update state jika berhasil
            } else {
                await followUser(); // Panggil fungsi follow di sini
            }
        } catch (error) {
            console.error("Error toggling follow state:", error);
            toast.error("Something went wrong while updating follow status.");
        } finally {
            setLoading(false); // Pastikan loading selalu dihentikan
        }
    };

    return (
        <FollowButton
            loading={loading}
            isFollowing={isFollowing}
            onClick={handleFollowToggle}
        />
    );
};

FollowUser.propTypes = {
    userId: PropTypes.string.isRequired,
    isFollowing: PropTypes.bool.isRequired,
    onFollowChange: PropTypes.func.isRequired,
};

export default FollowUser;
