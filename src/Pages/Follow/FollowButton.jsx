import PropTypes from "prop-types";

const FollowButton = ({ loading, isFollowing, onClick }) => {
    return (
        <button 
    onClick={onClick} 
    disabled={loading} 
    className={`text-white py-1 px-4 rounded-md cursor-pointer ${isFollowing ? 'bg-red-500' : 'bg-blue-500'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
>
            {loading ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
        </button>
    );
};

FollowButton.propTypes = {
    loading: PropTypes.bool.isRequired,
    isFollowing: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default FollowButton;
