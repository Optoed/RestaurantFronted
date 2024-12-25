import React, { useEffect, useState } from 'react';
import { UserType } from '../types/userType'; // Импортируйте тип пользователя
import { ErrorType } from '../types/errorType'; // Импортируйте тип ошибки
import '../assets/styles/Profile.css'; // Импортируйте CSS файл для стилей
import { registerUser } from '../service/registerService';
import { RegisterPayload } from '../types/registerType';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthToken, selectIsAuthenticated } from '../features/auth/authSlice';
import { clearProfile, selectUserRole } from '../features/profile/profileSlice';
import { useNavigate } from 'react-router-dom';


const Profile = () => {
    const [user, setUser] = useState<UserType>(); // Состояние для хранения данных пользователя
    const [loading, setLoading] = useState(true); // Состояние для загрузки
    const [error, setError] = useState<ErrorType>({ isError: false }); // Состояние для ошибок
    const [newUser, setNewUser] = useState<RegisterPayload>({ name: '', email: '', password: '', role: 'user' });
    const [successMessage, setSuccessMessage] = useState<string>(''); // Состояние для сообщения об успешной регистрации

    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const navigate = useNavigate();

    const role = useSelector(selectUserRole);
    console.log(role);
    const isAdmin = role === 'admin'

    useEffect(() => {


        const fetchUser = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const userName = localStorage.getItem('userName');
                const userEmail = localStorage.getItem('userEmail');
                const userRole = localStorage.getItem('userRole');

                if (!userId || !userName) {
                    throw new Error("Данные пользователя не найдены в localStorage");
                }

                const userData: UserType = {
                    id: Number(userId),
                    name: String(userName),
                    email: userEmail ? String(userEmail) : '',
                    role: userRole ? String(userRole) : '',
                };

                setUser(userData);
            } catch (err) {
                setError({ isError: true, message: "Что-то пошло не так" }); // Установите сообщение об ошибке
            } finally {
                setLoading(false); // Установите состояние загрузки в false
            }
        };

        fetchUser();
    }, []);

    const handleRegister = async () => {
        try {
            const response = await registerUser(newUser);
            console.log('Регистрация нового пользователя:', newUser);
            setSuccessMessage('Пользователь успешно зарегистрирован!'); // Установите сообщение об успешной регистрации
            setNewUser({ name: '', email: '', password: '', role: 'user' }); // Сбросьте форму
            setError({ isError: false }); // Сбросьте сообщение об ошибке

            // Установите таймер для сброса сообщения через 2 секунды
            setTimeout(() => {
                setSuccessMessage('');
            }, 2000);
        } catch (err) {
            setError({ isError: true, message: "Ошибка при регистрации" });
            setSuccessMessage(''); // Сбросьте сообщение об успешной регистрации
        }
    };

    if (loading) {
        return <div>Загрузка...</div>; // Показать индикатор загрузки
    }

    if (!user) {
        return <div>Нет доступных данных о пользователе</div>; // Если данных о пользователе нет
    }

    const handleLogout = () => {
        dispatch(clearAuthToken());
        dispatch(clearProfile());
        localStorage.clear();
        navigate('/login'); // Перенаправляем на страницу входа
    };

    return (
        <div className="profile-container">
            <h1>Ваш профиль</h1>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <p>Здесь вы можете просмотреть свой профиль.</p>
            </div>
            <div className="user-info">
                <h3>Информация о пользователе:</h3>
                <p><strong>Имя:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Роль:</strong> {user.role}</p>
                {/* Добавьте другие поля, если необходимо */}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', margin: '5px' }}>
                <button onClick={handleLogout}>Выйти из аккаунта</button>
            </div>

            {isAdmin && (
                <div>
                    <h3>Регистрация нового пользователя</h3>
                    {successMessage && <div className="success-message">{successMessage}</div>} {/* Отображение сообщения об успешной регистрации */}
                    {error.isError && <div className="error-message">{error.message}</div>} {/* Отображение сообщения об ошибке */}
                    <div>
                        <input
                            type="text"
                            placeholder="Введите имя"
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            placeholder="Введите email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Введите пароль"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        />
                    </div>
                    <div>
                        <label>Роль:</label>
                        <select
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        >
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button onClick={handleRegister}>Зарегистрировать пользователя</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;