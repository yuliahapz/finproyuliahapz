// import { useState } from "react";
// import axios from "axios";
// import { toast, Toaster } from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';

// const SearchUser = () => {
//     const [query, setQuery] = useState("");  // Query berupa username atau ID
//     const [user, setUser] = useState(null);  // Menyimpan pengguna yang dicari
//     const [isLoading, setIsLoading] = useState(false);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const navigate = useNavigate();

//     const handleSearch = async (e) => {
//         e.preventDefault();
//         if (!query.trim()) {
//             toast.error("Please enter a user ID.");
//             return;
//         }

//         const token = localStorage.getItem('token');
//         if (!token) {
//             toast.error("Token is missing. Please log in again.");
//             return;
//         }

//         setIsLoading(true);

//         try {
//             // Menggunakan endpoint untuk mendapatkan user berdasarkan ID
//             const response = await axios.get(`https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/user/${query}`, {
//                 headers: {
//                     apiKey: "c7b411cc-0e7c-4ad1-aa3f-822b00e7734b",
//                     Authorization: `Bearer ${token}`,
//                 },
//             });

//             const foundUser = response.data.data;

//             if (foundUser) {
//                 setUser(foundUser);  // Set pengguna yang ditemukan
//                 setIsModalOpen(true);
//                 toast.success("User found!");
//             } else {
//                 toast.error("User not found.");
//             }
//         } catch (error) {
//             console.error("Error fetching user:", error);
//             toast.error("Error fetching user.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleInputChange = (e) => {
//         setQuery(e.target.value);
//     };

//     const closeModal = () => {
//         setIsModalOpen(false);
//         setUser(null);
//     };

//     const navigateToProfile = () => {
//         closeModal();
//         navigate(`/profile/${user.id}`);
//     };

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//             <Toaster />
//             <form onSubmit={handleSearch} className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mb-6">
//                 <h2 className="text-2xl font-bold mb-4 text-center">Search User</h2>
//                 <input 
//                     type="text" 
//                     value={query} 
//                     onChange={handleInputChange} 
//                     placeholder="Search by User ID"
//                     className="border border-gray-300 p-3 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <button 
//                     type="submit" 
//                     className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg w-full transition-all duration-200 ease-in-out">
//                     {isLoading ? 'Searching...' : 'Search'}
//                 </button>
//             </form>

//             {isModalOpen && user && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//                     <div className="bg-white rounded-lg shadow-lg p-8 w-96 relative z-50">
//                         <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 text-2xl">
//                             &times;
//                         </button>
//                         <div className="flex flex-col items-center">
//                             <img 
//                                 src={user.profilePictureUrl || 'https://i.pinimg.com/736x/4c/7e/a6/4c7ea6b3320713b22634c68b2ee89862.jpg'} 
//                                 alt={user.username} 
//                                 className="w-24 h-24 rounded-full object-cover mb-4 shadow-md"
//                             />
//                             <h3 className="text-xl font-bold text-gray-800 mb-2">{user.username}</h3>
//                             <p className="text-gray-600 mb-4">{user.email}</p>
//                             <button 
//                                 onClick={navigateToProfile} 
//                                 className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-all duration-200">
//                                 View Profile
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default SearchUser;

import SearchNavbar from "../Component/SearchNavbar";
import Explore from "../Post/Explore";

const SearchUser = () => {
    return <div><SearchNavbar />
                <Explore /></div>;
};

export default SearchUser;
