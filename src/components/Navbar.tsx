import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthToken, selectIsAuthenticated } from '../features/auth/authSlice'; // Импортируйте селектор
import '../assets/styles/Navbar.css';
import { clearProfile, selectUserRole } from '../features/profile/profileSlice';

const Navbar: React.FC = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const navigate = useNavigate();

    const role = useSelector(selectUserRole);
    console.log(role);
    const isAdmin = role === 'admin'

    const handleLogout = () => {
        dispatch(clearAuthToken());
        dispatch(clearProfile());
        localStorage.clear();
        navigate('/login'); // Перенаправляем на страницу входа
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">Ресторан "Become Overman"</div>
            <ul className="navbar-links">
                <li><Link to="/">Главная страница</Link></li>
                {!isAuthenticated && (
                    <>
                        <li><Link to="/login">Авторизация</Link></li>
                        <li><Link to="/register">Регистрация</Link></li>
                    </>
                )}
                {isAuthenticated && (
                    <>
                        {isAdmin && (
                            <>
                                <li><Link to="/dashboard">Пользователи</Link></li>
                                <li><Link to="/products">Ингредиенты</Link></li>
                            </>
                        )}
                        <li><Link to="/orders">Заказы</Link></li>
                        <li><Link to="/menu">Меню</Link></li>
                        <li><Link to="/cooks">Повара</Link></li>
                        <li><Link to="/waiters">Официанты</Link></li>
                        <li><Link to="/profile">Профиль</Link></li>
                        {/* <li><button className='logout-button' onClick={handleLogout}>Выйти из аккаунта</button></li> */}
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;