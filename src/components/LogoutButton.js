import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user authentication data (e.g., tokens) from storage
    localStorage.removeItem('authToken'); // Example, change based on your implementation

    // Optionally, clear any other user data
    localStorage.removeItem('userData');

    // Redirect to the sign-in page
    navigate('/signin');
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
