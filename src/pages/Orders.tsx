import React, { useState, useEffect } from 'react';
import { OrderType } from '../types/orderType';
import { getOrders, makeNewOrder } from '../service/ordersService'; // Импортируйте makeNewOrder
import { ErrorType } from '../types/errorType';
import '../assets/styles/Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<ErrorType>({ isError: false });

    // Состояние для формы нового заказа
    const [newOrder, setNewOrder] = useState({
        id: 1,
        id_waiter: 1,
        id_customer: 1,
        total_cost: 1500,
        status: 'Pending', // Значение по умолчанию
    });

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getOrders();
                setOrders(response.data);
            } catch (err) {
                setError({
                    isError: true,
                    message: 'Failed to fetch orders. Please try again later.',
                    code: '500',
                    isOpenModal: true,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleCreateOrder = async () => {
        try {
            const response = await makeNewOrder(newOrder); // Передаем данные нового заказа
            setOrders((prevOrders) => [...prevOrders, response.data]); // Обновляем список заказов
            // Сбросить форму после успешного создания заказа
            setNewOrder({
                id: 1,
                id_waiter: 1,
                id_customer: 1,
                total_cost: 1500,
                status: 'Pending', // Значение по умолчанию
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

    if (loading) {
        return <div className="loading-message">Loading...</div>;
    }

    if (error.isError) {
        return (
            <div className="error-message">
                <p>{error.message}</p>
                {error.code && <p>Error Code: {error.code}</p>}
            </div>
        );
    }

    return (
        <div className="orders-container">
            <h1 className="orders-title">Your Orders</h1>
            <p className="orders-message">Here you can view your orders.</p>

            {/* Форма для создания нового заказа */}
            <div className="new-order-form">
                <h2>Create New Order</h2>
                <button onClick={handleCreateOrder} className='create-order-button'>
                    Make new order
                </button>
            </div>

            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <ul className="orders-list">
                    {orders.map((order) => (
                        <li key={order.id} className="orders-list-item">
                            Order #{order.id}: Total Cost: ${order.total_cost} - Status: {order.status}
                        </li>))}
                </ul>
            )}
        </div>
    );
};

export default Orders;