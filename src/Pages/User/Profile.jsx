import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Image } from "antd";
import MyFollowing from './MyFollowing';
import MyFollowers from './MyFollowers';
import MyPost from "../Post/MyPost";
import Logout from "../Auth/Logout";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [totalFollowing, setTotalFollowing] = useState(0);
  const [totalFollowers, setTotalFollowers] = useState(0);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [id, setId] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfileData = async () => {
      try {
        const response = await axios.get("https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/user", {
          headers: {
            apiKey: "c7b411cc-0e7c-4ad1-aa3f-822b00e7734b",
            Authorization: `Bearer ${token}`,
          },
        });

        const {
          id, 
          username,
          name,
          email,
          profilePictureUrl,
          phoneNumber,
          bio,
          website,
          totalFollowing,
          totalFollowers,
        } = response.data.data;

        setId(id); 
        console.log("user id:", id);
        setUsername(username);
        setName(name);
        setEmail(email);
        setProfilePictureUrl(profilePictureUrl);
        setPhoneNumber(phoneNumber);
        setBio(bio);
        setWebsite(website);
        setTotalFollowing(totalFollowing);
        setTotalFollowers(totalFollowers);
      } catch (error) {
        toast.error("Failed to fetch profile data");
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleCancel = () => {
    setIsLogoutModalVisible(false);
  };
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    setIsLogoutModalVisible(false);
  };

  return (
    <div className="container mx-auto px-4">
      {/* Action Buttons */}
      <div className="flex justify-between p-4 mb-6">
        <button onClick={() => navigate(-1)} className="bg-white text-xs py-2 px-4 rounded shadow">Back</button>
        <button onClick={() => setIsLogoutModalVisible(true)} className="bg-white text-xs py-2 px-4 rounded shadow">Logout</button>
      </div>
      <Logout
        isModalVisible={isLogoutModalVisible}
        handleCancel={handleCancel}
        handleLogout={handleLogout}
      />
      
      {/* Main Profile Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-b gap-8 mb-8 pb-4">
        {/* Profile Image and Edit Button */}
        <div className="flex flex-col justify-center items-center mb-4 relative">
          {/* Story ring */}
          <div className="relative w-52 h-52 rounded-full border-4 border-white flex items-center justify-center">
          <Image
  src={
    profilePictureUrl
      ? `${profilePictureUrl}?timestamp=${new Date().getTime()}`
      : "https://i.pinimg.com/736x/4c/7e/a6/4c7ea6b3320713b22634c68b2ee89862.jpg"
      }
      alt={username}
      className="rounded-full object-cover"
      width={200}
      height={200}
      onError={(e) => {
          e.target.onerror = null;
          e.target.src =
          "https://i.pinimg.com/736x/4c/7e/a6/4c7ea6b3320713b22634c68b2ee89862.jpg";
          }}
          />

          </div>
          {/* Edit Profile Button */}
          <button
            className="mt-2 bg-blue-500 text-white text-xs py-1 px-2 rounded transform hover:bg-blue-600 transition duration-200 w-24"
            onClick={() => navigate("/updateprofile")}
          >
            Edit Profile
          </button>
        </div>

        {/* User Details Section */}
        <div className="flex flex-col items-center justify-center p-4 sm:p-8">
          <h1 className="text-2xl sm:text-4xl font-semibold text-gray-800 text-center mb-2">
            {name}
          </h1>
          <div className="flex justify-center md:justify-start space-x-6 mt-4">
            <button
              onClick={() => setShowFollowersModal(true)}
              className="text-blue-500"
            >
              <span className="font-bold text-center">{totalFollowers}</span> Followers
            </button>
            <button
              onClick={() => setShowFollowingModal(true)}
              className="text-blue-500"
            >
              <span className="font-bold text-center">{totalFollowing}</span> Following
            </button>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm">{id}</p>
            <p className="text-sm">{username}</p>
            <p className="text-sm">{email}</p>
            <p className="text-sm">{bio || 'No bio available'}</p>
            <p className="text-sm">
              {phoneNumber || 'No phone number available'}
            </p>
            <a
              href={website}
              className="text-sm text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {website || 'No website available'}
            </a>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div 
        className="grid grid-cols-1 w-full max-w-6xl border-gray-300 mx-auto"
        style={{ maxHeight: "calc(100vh - 80px)", overflowY: "auto", padding: '20px' }}
      >
        {id && <MyPost id={id} userId={id} />}
      </div>
  
      {/* Modal for Followers */}
      {showFollowersModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-4 w-11/12 max-w-md">
            <button
              className="text-right text-gray-600 mb-4"
              onClick={() => setShowFollowersModal(false)}
            >
              X
            </button>
            <MyFollowers />
          </div>
        </div>
      )}
      
      {/* Modal for Following */}
      {showFollowingModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-4 w-11/12 max-w-md">
            <button
              className="text-right text-gray-600 mb-4"
              onClick={() => setShowFollowingModal(false)}
            >
              X
            </button>
            <MyFollowing />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
