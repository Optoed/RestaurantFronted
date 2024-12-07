import React, { useState, useEffect } from 'react';

// Example API service that fetches users and admins
import { getAllUsers } from '../service/userService';
import { UserType } from '../types/userType';

const Dashboard = () => {
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch users and admins
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
        <div>
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
