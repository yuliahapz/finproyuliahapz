import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const UpdateProfile = () => {
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState(null); // Ubah ke null awalnya
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [previewUrl, setPreviewUrl] = useState(""); // Untuk menampilkan preview gambar
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/user", {
        headers: {
          apiKey: "c7b411cc-0e7c-4ad1-aa3f-822b00e7734b",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const { name, username, email, profilePictureUrl, phoneNumber, bio, website } = response.data.data;
        setName(name);
        setUserName(username);
        setEmail(email);
        setPhoneNumber(phoneNumber);
        setBio(bio);
        setWebsite(website);
        setPreviewUrl(profilePictureUrl); // Set preview awal dari gambar profil
        localStorage.setItem("currentEmail", email); // Menyimpan email di localStorage
      })
      .catch((error) => {
        console.log(error);
      });
  }, [navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result); // Menampilkan preview dari gambar yang di-upload
      };
      reader.readAsDataURL(file);
      setProfilePictureUrl(file); // Menyimpan file untuk di-upload
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", userName);
    formData.append("email", email);
    if (profilePictureUrl) { // Pastikan file gambar dipilih
      formData.append("profilePicture", profilePictureUrl); // Mengirim file gambar yang di-upload
    }
    formData.append("phoneNumber", phoneNumber);
    formData.append("bio", bio);
    formData.append("website", website);

    axios
      .post(
        "https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/update-profile",
        formData,
        {
          headers: {
            apiKey: "c7b411cc-0e7c-4ad1-aa3f-822b00e7734b",
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Penting untuk mengirim file
          },
        }
      )
      .then((response) => {
        console.log(response.data.data);
        toast.success("Profile updated successfully!");
        localStorage.setItem("currentEmail", email); // Update email di localStorage jika diubah
        navigate("/profile");
      })
      .catch((error) => {
        toast.error("Failed to update profile.");
        console.log(error);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <button onClick={() => navigate(-1)} className="bg-white-500 text-xs rounded">Back</button>
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Edit Profile</h1>

        {/* Display the current profile picture */}
        {previewUrl && (
          <div className="mb-4 flex justify-center">
            <img
              src={previewUrl}
              alt="Profile Preview"
              className="w-32 h-32 rounded-full object-cover cursor-pointer"
              onClick={() => document.getElementById("profilePictureInput").click()} // Open file picker on click
            />
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* File Input for Profile Picture */}
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2">Profile Picture</label>
            <input
              type="file"
              id="profilePictureInput"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>

          {/* Input Name */}
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          {/* Input Username */}
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your username"
            />
          </div>

          {/* Input Email */}
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          {/* Input Phone Number */}
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2">Phone Number</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>

          {/* Input Bio */}
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2">Bio</label>
            <textarea
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Enter your bio"
              rows="3"
            />
          </div>

          {/* Input Website */}
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2">Website</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="Enter your website URL"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
