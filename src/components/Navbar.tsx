import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthToken } from '../features/auth/authSlice'; // Adjust the import based on your file structure
import '../assets/styles/Navbar.css';

const Navbar: React.FC = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated); // Adjust the type based on your RootState

    const handleLogout = () => {
        dispatch(clearAuthToken());
        localStorage.removeItem('userToken'); // Clear the token from localStorage
        // Optionally, redirect to home or login page after logout
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">Restaurant "Become Overman"</div>
            <ul className="navbar-links">
                <li><Link to="/">Home</Link></li>
                {!isAuthenticated && (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                )}
                {isAuthenticated && (
                    <>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                        <li><Link to="/profile">Profile</Link></li>
                        <li><Link to="/orders">Orders</Link></li>
                        <li><Link to="/menu">Menu</Link></li>
                        <li><Link to="/cooks">Cooks</Link></li>
                        <li><button onClick={handleLogout}>Logout</button></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;