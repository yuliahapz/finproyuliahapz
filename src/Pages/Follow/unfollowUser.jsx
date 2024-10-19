import axios from "axios";
import { toast } from "react-hot-toast";

// Fungsi untuk unfollow user
const unfollowUser = async (userId) => {
    try {
        const response = await axios.delete(
            `https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/unfollow/${userId}`, // Ganti {id} dengan userId
            {
                headers: {
                    apiKey: "c7b411cc-0e7c-4ad1-aa3f-822b00e7734b",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        toast.success("User unfollowed!");
        console.log(response.data.data);
    } catch (error) {
        console.error("Error unfollowing user:", error.response ? error.response.data : error);
        const errorMessage = error.response?.data?.message || "Failed to unfollow user.";
        toast.error(errorMessage);
    }
};

export default unfollowUser;
