import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../service/userService';
import { UserType } from '../types/userType';
import '../assets/styles/Dashboard.css'; // Импортируйте файл стилей

const Dashboard = () => {
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersResponse = await getAllUsers();
                setUsers(usersResponse.data);
            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
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
        </div>
    );
};

export default Dashboard;