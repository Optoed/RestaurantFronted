import React, { useState, useEffect } from 'react';
import { OrderType } from '../types/orderType';
import { getOrders, makeNewOrder } from '../service/ordersService';
import { LinearProgress, Button, Snackbar } from '@mui/material'; // Import Snackbar for error messages
import '../assets/styles/Orders.css';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { ErrorType } from '../types/errorType';

const Orders = () => {
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [showLoading, setShowLoading] = useState<boolean>(true);
    const [error, setError] = useState<ErrorType>({ isError: false });
    const [newOrder, setNewOrder] = useState({
        id: 1,
        id_waiter: 1,
        id_customer: 1,
        total_cost: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
        status: 'Pending',
    });

    // Получаем данные из Redux
    const userToken = useSelector((state: RootState) => state.auth.userToken);
    const userRole = useSelector((state: RootState) => state.profile.role); // Предполагается, что вы сохраняете роль в профиле
    const customerId = useSelector((state: RootState) => state.profile.id_customer); // Предполагается, что вы сохраняете id_customer в профиле

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getOrders(userToken, userRole, customerId);
                setOrders(response.data);
            } catch (err) {
                setError({
                    isError: true,
                    message: 'Failed to fetch orders. Please try again later.',
                    code: '500',
                    isOpenModal: true,
                });
            } finally {
                const timer = setTimeout(() => {
                    setShowLoading(false);
                    setLoading(false);
                }, 1000);
                return () => clearTimeout(timer);
            }
        };

        fetchOrders();
    }, [userToken, userRole, customerId]); // Добавьте зависимости

    const handleCreateOrder = async () => {
        try {
            const response = await makeNewOrder(newOrder, userToken, customerId);
            setOrders((prevOrders) => [...prevOrders, response.data]);
            setNewOrder({
                id: 1,
                id_waiter: 1,
                id_customer: 1,
                total_cost: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                status: 'Pending',
            });
        } catch (err) {
            setError({
                isError: true,
                message: 'Failed to create order. Please try again later.',
                code: '500',
                isOpenModal: true,
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewOrder((prevOrder) => ({
            ...prevOrder,
            [name]: value,
        }));
    };

    const handleCloseSnackbar = () => {
        setError({ ...error, isError: false });
    };

    return (
        <div className="orders-container">
            {showLoading && <LinearProgress />}
            {!showLoading && (
                <>
                    <h1 className="orders-title">Your Orders</h1>
                    <p className="orders-message">Here you can view your orders.</p>
                    <div className="new-order-form">
                        <h2>Create New Order</h2>
                        <Button variant="contained" onClick={handleCreateOrder} className='create-order-button'>
                            Make new order
                        </Button>
                    </div>
                    {orders.length === 0 ? (
                        <p>No orders found.</p>
                    ) : (
                        <ul className="orders-list">
                            {orders.map((order) => (
                                <li key={order.id} className="orders-list-item">
                                    Order #{order.id}: Total Cost: ${order.total_cost} - Status: {order.status}
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
            <Snackbar
                open={error.isError}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={error.message}
            />
        </div>
    );
};

export default Orders;