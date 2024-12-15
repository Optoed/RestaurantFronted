import React, { useState, useEffect } from 'react';
import { OrderType } from '../types/orderType';
import { getDetailedOrders } from '../service/ordersService';
import { LinearProgress, Snackbar, Card, CardContent, Typography, List, ListItem, ListItemText } from '@mui/material';
import '../assets/styles/Orders.css';

interface GroupedOrder {
    id_order: number;
    status: string;
    total_cost: number;
    order_date: string;
    id_customer: number;
    customer_name: string;
    dishes: {
        dish_name: string;
        dish_cost: number;
        cook_name: string;
    }[];
}

const Orders = () => {
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [showLoading, setShowLoading] = useState<boolean>(true);
    const [error, setError] = useState<{ isError: boolean; message?: string }>({ isError: false });

    const userToken = localStorage.getItem('authToken') || '';
    const userRole = localStorage.getItem('userRole') || '';
    const customerId = Number(localStorage.getItem('customerId')) || 1;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getDetailedOrders(userToken, userRole, customerId);
                setOrders(response.data);
            } catch (err) {
                setError({
                    isError: true,
                    message: 'Не удалось получить заказы. Пожалуйста, попробуйте позже.',
                });
            } finally {
                setShowLoading(false);
                setLoading(false);
            }
        };

        fetchOrders();

        return () => {
            setOrders([]); // Опционально очищаем заказы при размонтировании
        };
    }, [userToken, userRole, customerId]);

    const handleCloseSnackbar = () => {
        setError({ ...error, isError: false });
    };

    // Группировка заказов по id_order
    const groupedOrders = orders.reduce<Record<number, GroupedOrder>>((acc, order) => {
        const { id_order } = order;
        if (!acc[id_order]) {
            acc[id_order] = {
                id_order,
                status: order.status,
                total_cost: order.total_cost,
                order_date: order.order_date,
                id_customer: order.id_customer,
                customer_name: order.customer_name,
                dishes: [],
            };
        }
        acc[id_order].dishes.push({
            dish_name: order.dish_name,
            dish_cost: order.dish_cost,
            cook_name: order.cook_name,
        });
        return acc;
    }, {});

    const orderList = Object.values(groupedOrders);

    return (
        <div className="orders-container">
            {showLoading && <LinearProgress />}
            {!showLoading && (
                <>
                    <Typography variant="h4" className="orders-title" gutterBottom>
                        Ваши заказы
                    </Typography>
                    {orderList.length === 0 ? (
                        <Typography variant="h6">Заказы не найдены.</Typography>
                    ) : (
                        <List>
                            {orderList.map((order) => (
                                <Card key={order.id_order} variant="outlined" className="order-card">
                                    <CardContent>
                                        <Typography variant="h5">
                                            Заказ #{order.id_order} - Клиент: {order.customer_name} (ID: {order.id_customer})
                                        </Typography>
                                        <Typography color="textSecondary">
                                            Статус: {order.status} - Общая стоимость: {order.total_cost} - Дата заказа: {new Date(order.order_date).toLocaleString()}
                                        </Typography>
                                        <List>
                                            {order.dishes.map((dish, index) => (
                                                <ListItem key={index}>
                                                    <ListItemText
                                                        primary={dish.dish_name}
                                                        secondary={`Стоимость: ${dish.dish_cost} - Повар: ${dish.cook_name}`}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </CardContent>
                                </Card>
                            ))}
                        </List>
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