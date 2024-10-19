import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Assuming you are using react-toastify for notifications

const GetFollowers = () => {
  const [followers, setFollowers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found. Please log in again.");
      toast.error("No token found. Please log in again.");
      return;
    }

    axios
      .get('https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/followers?size=10&page=1', {
        headers: {
          apiKey: "c7b411cc-0e7c-4ad1-aa3f-822b00e7734b",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setFollowers(response.data.data.users);
      })
      .catch((error) => {
        console.error("Error fetching followers data:", error);
        toast.error("Failed to fetch followers data.");
      });
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <div className="mt-4 px-4">
      {/* Back Button */}
      <button onClick={handleBack} className="absolute top-4 left-4 text-gray-600">
        X
      </button>

      {/* Heading */}
      <h2 className="text-lg font-semibold text-center">Followers</h2>

      {/* Search Form */}
      <div className="mt-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search following..."
          className="border rounded-lg p-2 w-full"
        />
      </div>

      {/* Following List */}
      <ul className="max-h-64 overflow-y-auto mt-4">
        {followers.length > 0 ? (
          followers
            .filter((user) =>
              user.username.toLowerCase().includes(searchTerm.toLowerCase())
            ) // Filter based on search term
            .map((user) => (
              <li key={user.id} className="flex items-center space-x-4 mt-4 justify-center">
                <img
                  src={user.profilePictureUrl || "https://i.pinimg.com/736x/4c/7e/a6/4c7ea6b3320713b22634c68b2ee89862.jpg"}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://i.pinimg.com/736x/4c/7e/a6/4c7ea6b3320713b22634c68b2ee89862.jpg";
                  }}
                />
                <span className="text-gray-600">{user.username}</span>
              </li>
            ))
        ) : (
          <p className="text-gray-600 mt-4 text-center">No followers found</p>
        )}
      </ul>
    </div>
  );
};

export default GetFollowers;
