import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../service/userService';
import { UserType } from '../types/userType';
import { LinearProgress } from '@mui/material'; // Импортируйте LinearProgress
import '../assets/styles/Dashboard.css'; // Импортируйте файл стилей

const Dashboard = () => {
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);
    const [showLoading, setShowLoading] = useState(true); // Новое состояние для управления видимостью полосы загрузки

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersResponse = await getAllUsers();
                setUsers(usersResponse.data);
            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                // Установите таймер для скрытия полосы загрузки через 1 секунду
                const timer = setTimeout(() => {
                    setShowLoading(false);
                    setLoading(false);
                }, 1000); // 1 секунда

                // Очистите таймер при размонтировании компонента
                return () => clearTimeout(timer);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="container">
            {showLoading && <LinearProgress />} {/* Показываем полосу загрузки только если showLoading true */}

            {!showLoading && ( // Отображаем контент только если showLoading false
                <>
                    <h1>Dashboard</h1>
                    <p>Welcome to your admin dashboard!</p>

                    <div>
                        <h3>All Users:</h3>
                        <p>Total Users: {users.length}</p>
                        <ul>
                            {users.map(user => (
                                <li key={user.id}>
                                    {user.name} - {user.email}
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;