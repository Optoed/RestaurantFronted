import React, { useState, useEffect } from 'react';
import { OrderType } from '../types/orderType';
import { getDetailedOrders, getOrdersByDateRange } from '../service/ordersService';
import { LinearProgress, Snackbar, Card, CardContent, Typography, List, ListItem, ListItemText, TextField, Button } from '@mui/material';
import '../assets/styles/Orders.css';
import { start } from 'repl';

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
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const [successMessage, setSuccessMessage] = useState<{ isSuccess: boolean; message?: string }>({ isSuccess: false });

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

    const convertToCSV = (data: OrderType[]) => {
        const header = Object.keys(data[0]).join(','); // Получаем заголовки из первого объекта
        const rows = data.map(item => {
            return Object.values(item).join(','); // Преобразуем каждый объект в строку
        });
        return [header, ...rows].join('\n'); // Объединяем заголовки и строки
    };

    const handleDownloadOrders = async () => {
        if (!startDate || !endDate) {
            setError({ isError: true, message: 'Пожалуйста, укажите начальную и конечную дату.' });
            return;
        }

        try {
            // Преобразуем даты в формат ISO
            const startDateISO = new Date(startDate).toISOString();
            const endDateISO = new Date(endDate).toISOString();

            const customerId = String(localStorage.getItem('customerId'))

            console.log(startDate, startDateISO)

            const response = await getOrdersByDateRange(userToken, startDateISO, endDateISO, customerId)

            // Преобразуем данные в CSV
            const csvData = convertToCSV(response.data);

            // Добавляем BOM для UTF-8
            const bom = '\uFEFF';
            const blob = new Blob([bom + csvData], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'orders.csv'; // Имя файла для скачивания
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);


            // Успешное сообщение
            setSuccessMessage({ isSuccess: true, message: 'Заказы успешно скачаны!' });
        } catch (error) {
            setError({ isError: true, message: 'Ошибка при скачивании заказов.' });
        }
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

    // Фильтрация заказов по названию блюда
    const filteredOrders = orderList.filter(order =>
        order.dishes.some(dish =>
            dish.dish_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="orders-container">
            {showLoading && <LinearProgress />}
            {!showLoading && (
                <>
                    <Typography variant="h4" className="orders-title" gutterBottom>
                        Ваши заказы
                    </Typography>

                    <div style={{ marginBottom: '16px' }}>
                        <div>
                            <p>начальная дата</p>
                            <TextField
                                type="datetime-local"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                style={{ marginRight: '8px' }}
                            />
                        </div>
                        <div>
                            <p>конечная дата</p>
                            <TextField
                                type="datetime-local"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                        <button onClick={handleDownloadOrders}>
                            Получить все заказы за данный интервал времени
                        </button>
                    </div>
                    <input
                        type="text"
                        placeholder="Поиск по названию блюда"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '8px', marginBottom: '16px' }}
                    />
                    {filteredOrders.length === 0 ? (
                        <Typography variant="h6">Заказы не найдены.</Typography>
                    ) : (
                        <List>
                            {filteredOrders.map((order) => (
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
            )
            }
            <Snackbar
                open={error.isError}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={error.message}
            />

            <Snackbar
                open={successMessage.isSuccess}
                autoHideDuration={6000}
                onClose={() => setSuccessMessage({ ...successMessage, isSuccess: false })}
                message={successMessage.message}
            />
        </div >
    );
};

export default Orders;