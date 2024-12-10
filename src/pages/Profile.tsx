import React, { useEffect, useState } from 'react';
import { UserType } from '../types/userType'; // Импортируйте тип пользователя
import { ErrorType } from '../types/errorType'; // Импортируйте тип ошибки

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
                    throw new Error("User  data not found in localStorage");
                }

                const userData: UserType = {
                    id: Number(userId),
                    name: String(userName),
                    email: userEmail ? String(userEmail) : '',
                    role: userRole ? String(userRole) : '',
                };

                setUser(userData);
            } catch (err) {
                setError({ isError: true, message: "Something goes wrong" }); // Установите сообщение об ошибке
            } finally {
                setLoading(false); // Установите состояние загрузки в false
            }
        };

        fetchUser();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Показать индикатор загрузки
    }


    if (!user) {
        return <div>No user data available</div>; // Если данных о пользователе нет
    }

    return (
        <div>
            <h1>Your Profile</h1>
            <p>Here you can view and edit your profile.</p>
            <div>
                <h3>User Information:</h3>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                {/* Добавьте другие поля, если необходимо */}
            </div>
            <button onClick={() => alert('Edit functionality not implemented yet.')}>
                Edit Profile
            </button>
        </div>
    );
};

export default Profile;