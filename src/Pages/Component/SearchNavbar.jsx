import { useState } from "react";
import axios from "axios";
import { Input, Modal, Button, Spin } from 'antd';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


const { Search } = Input;

const SearchNavbar = () => {
    const [user, setUser] = useState(null);  // Menyimpan pengguna yang dicari
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async (value) => {
        if (!value.trim()) {
            toast.error("Please enter a user ID.");
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            toast.error("Token is missing. Please log in again.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.get(`https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/user/${value}`, {
                headers: {
                    apiKey: "c7b411cc-0e7c-4ad1-aa3f-822b00e7734b",
                    Authorization: `Bearer ${token}`,
                },
            });

            const foundUser = response.data.data;

            if (foundUser) {
                setUser(foundUser);  // Set pengguna yang ditemukan
                setIsModalOpen(true);
                toast.success("User found!");
            } else {
                toast.error("User not found.");
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            toast.error("Error fetching user.");
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setUser(null);
    };

    const navigateToProfile = () => {
        closeModal();
        navigate(`/profile/${user.id}`);
    };

    return (
        <div style={{ padding: '16px', backgroundColor: '#001529', display: 'flex', justifyContent: 'center' }}>
            <Toaster />
            <Search
                placeholder="Search by User ID"
                enterButton={isLoading ? <Spin /> : 'Search'}
                onSearch={handleSearch}
                style={{
                    width: 300,
                    height: '40px', // Set height to match the button
                    borderRadius: '8px', // Adjust border radius for consistency
                }}
                className="rounded-lg"
                size="large" // Use Ant Design's size prop for larger input
            />

            {/* Modal untuk menampilkan hasil pencarian */}
            <Modal
                title="User Found"
                visible={isModalOpen}
                onCancel={closeModal}
                footer={null} // Hapus footer bawaan untuk kontrol penuh pada layout
                bodyStyle={{ padding: '24px' }}
                centered
                style={{ borderRadius: '12px', overflow: 'hidden' }}
                width={400}
            >
                {user && (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <div
                            style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                margin: '0 auto 16px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <img
                                src={
                                    user.profilePictureUrl ||
                                    'https://i.pinimg.com/736x/4c/7e/a6/4c7ea6b3320713b22634c68b2ee89862.jpg'
                                }
                                alt={user.username}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>{user.username}</h3>
                        <p style={{ fontSize: '1rem', color: '#555' }}>{user.email}</p>

                        {/* Kontainer untuk tombol */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginTop: '16px'
                        }}>
                            <Button
                                key="view"
                                type="primary"
                                onClick={navigateToProfile}
                                style={{
                                    borderRadius: '8px', // Set border radius for button
                                    padding: '8px 24px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '40px', // Set height to match the search input
                                }}
                            >
                                View Profile
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default SearchNavbar;
