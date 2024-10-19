/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // Import useNavigate untuk navigasi

const MyFollowers = () => {
  const [followers, setFollowers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // Inisialisasi navigate

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You are not authenticated.");
      return;
    }

    axios
      .get("https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/my-followers?size=10&page=1", {
        headers: {
          apiKey: "c7b411cc-0e7c-4ad1-aa3f-822b00e7734b",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const followersData = response.data.data.users;
        setFollowers(followersData);
      })
      .catch((error) => {
        toast.error("Failed to fetch followers data.", error);
      });
  }, []);

  // Fungsi untuk menangani pencarian
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Fungsi untuk kembali ke halaman sebelumnya
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="mt-4 px-4">
      {/* Tombol Kembali */}
      <button onClick={handleBack} className="absolute top-4 left-4 text-gray-600">
        X
      </button>
      <h2 className="text-lg font-semibold text-center">Followers</h2>
      {/* Form Pencarian */}
      <div className="mt-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search followers..."
          className="border rounded-lg p-2 w-full"
        />
      </div>
      <ul className="max-h-64 overflow-y-auto mt-4">
        {followers.length > 0 ? (
          followers
            .filter((user) =>
              user.username.toLowerCase().includes(searchTerm.toLowerCase())
            ) // Filter berdasarkan pencarian
            .map((user) => (
              <li key={user.id} className="flex items-center space-x-4 mt-4 justify-center">
                <img
                  src={user.profilePictureUrl || "default-profile.png"}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-gray-600">{user.username}</span>
              </li>
            ))
        ) : (
          <p className="text-gray-600 mt-4 text-center">You don't have any followers yet.</p>
        )}
      </ul>
    </div>
  );
};

export default MyFollowers;
