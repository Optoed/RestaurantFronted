import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthToken, selectIsAuthenticated } from '../features/auth/authSlice'; // Импортируйте селектор
import '../assets/styles/Navbar.css';
import { selectUserRole } from '../features/profile/profileSlice';

const Navbar: React.FC = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const navigate = useNavigate();

    const role = useSelector(selectUserRole);
    console.log(role);
    const isAdmin = role === 'admin'

    const handleLogout = () => {
        dispatch(clearAuthToken());
        navigate('/login'); // Перенаправляем на страницу входа
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
                        {isAdmin && (<li><Link to="/dashboard">Dashboard</Link></li>)}
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