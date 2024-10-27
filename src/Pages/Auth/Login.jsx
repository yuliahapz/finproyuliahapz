import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import "../../index.css";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleTogglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
  
    try {
      const response = await axios.post(
        'https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/login', 
        { email, password },
        { headers: { 'apiKey': 'c7b411cc-0e7c-4ad1-aa3f-822b00e7734b' } }
      );
  
      const token = response.data.token;
      localStorage.setItem('token', token);
  
      // Dekode token untuk mendapatkan userId
      const decodedToken = parseJwt(token);
      const userId = decodedToken?.userId; // Sesuaikan dengan struktur payload token API
  
      if (userId) {
        localStorage.setItem('userId', userId); // Simpan userId ke localStorage
      } else {
        console.error("User ID not found in token");
      }
  
      toast.success('Login successful');
      setTimeout(() => { navigate('/explore') }, 200);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('Invalid Email or Password');
      } else if (error.response && error.response.status === 500) {
        toast.error('Internal server error');
      } else {
        toast.error('Login failed');
      }
    }
  };

  // Helper function to decode JWT token for user ID 
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Invalid token format', error);
    return null;
  }
};

  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Login Card */}
      <div className="bg-white p-8 shadow-lg w-[400px] h-[600px] rounded-3xl border-2 border-black hover:border-white transition duration-300 ease-in-out">
        <div className="flex justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="gray-800"
            className="size-20"
          >
            <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" />
            <path
              fillRule="evenodd"
              d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 0 0 1.11-.71l.822-1.315a2.942 2.942 0 0 1 2.332-1.39ZM6.75 12.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Zm12-1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Sign In and Sign Up links side by side */}
        <div className="flex justify-between">
          <Link to="/login" className="text-gray-900 text-lg ml-16 mb-3 font-semibold">
            Sign In
          </Link>
          <Link to="/register" className="text-gray-900 text-lg mr-16 mb-3 font-semibold">
            Sign Up
          </Link>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="w-full px-4 space-y-4 mt-4">
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="relative">
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={handleTogglePasswordVisibility}
            >
              {passwordVisible ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height ="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.486 0-8.844-1.977-11.995-5.74-3.15-3.763-4.527-8.236-4.527-13.318C3.905 3.683 7.358 2.855 11 2.855c3.642 0 7.095 1.828 9.995 5.74 3.15 3.763 4.527 8.236 4.527 13.318 0 4.082-1.377 8.555-4.527 12.318" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </span>
          </div>
          <button
            type="submit"
            className="w-full p-2 text-white bg-gray-800 rounded-md hover:bg-blue-500 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-600"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Forgot your password{' '}
          <Link to="/register" className="text-gray-800 underline">
            Reset Password
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
