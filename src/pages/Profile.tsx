import React, { useEffect, useState } from 'react';
import { UserType } from '../types/userType'; // Импортируйте тип пользователя
import { ErrorType } from '../types/errorType'; // Импортируйте тип ошибки
import '../assets/styles/Profile.css'; // Импортируйте CSS файл для стилей

const Profile = () => {
    const [user, setUser] = useState<UserType>(); // Состояние для хранения данных пользователя
    const [loading, setLoading] = useState(true); // Состояние для загрузки
    const [error, setError] = useState<ErrorType>({ isError: false }); // Состояние для ошибок

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

    if (loading) {
        return <div>Загрузка...</div>; // Показать индикатор загрузки
    }

    if (!user) {
        return <div>Нет доступных данных о пользователе</div>; // Если данных о пользователе нет
    }

    return (
        <div className="profile-container">
            <h1>Ваш профиль</h1>
            <p>Здесь вы можете просмотреть свой профиль.</p>
            <div className="user-info">
                <h3>Информация о пользователе:</h3>
                <p><strong>Имя:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Роль:</strong> {user.role}</p>
                {/* Добавьте другие поля, если необходимо */}
            </div>
        </div>
    );
};

export default Profile;