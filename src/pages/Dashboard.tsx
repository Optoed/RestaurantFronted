import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../service/userService';
import { UserType } from '../types/userType';
import { LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'; // Импортируйте необходимые компоненты
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
                // таймер для скрытия полосы загрузки через 1 секунду
                const timer = setTimeout(() => {
                    setShowLoading(false);
                    setLoading(false);
                }, 1000); // 1 секунда

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
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>ID</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Name</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Email</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Role</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map(user => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.id}</TableCell>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.role}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;