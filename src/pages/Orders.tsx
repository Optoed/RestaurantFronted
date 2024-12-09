import React, { useState, useEffect } from 'react';
import { OrderType } from '../types/orderType';
import { getOrders, createOrder } from '../service/ordersService'; // Импортируйте createOrder
import { ErrorType } from '../types/errorType';
import '../assets/styles/Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<ErrorType>({ isError: false });

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
            const newOrder = {
                // Здесь вы можете указать необходимые поля для нового заказа
                id_waiter: 1, // Пример поля
                id_customer: 7, // Пример поля
                total_cost: 100, // Пример поля
                status: 'Pending', // Пример поля
            };

            const response = await createOrder(newOrder); // Предполагается, что createOrder возвращает созданный заказ
            setOrders((prevOrders) => [...prevOrders, response.data]); // Обновляем состояние с новым заказом
        } catch (err) {
            setError({
                isError: true,
                message: 'Failed to create order. Please try again later.',
                code: '500',
                isOpenModal: true,
            });
        }
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
            <button onClick={handleCreateOrder} className="create-order-button">
                Сделать заказ
            </button>
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
        </div>
    );
};

export default Orders;