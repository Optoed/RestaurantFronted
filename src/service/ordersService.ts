// src/service/userService.ts

import axios from 'axios';
import { OrderType } from '../types/orderType';
import api from '../api';

export const getOrders = async (): Promise<{ data: OrderType[] }> => {
    const userToken = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');
    const customerId = localStorage.getItem('customerId');

    if (!userToken || !userRole || !userId || !customerId) {
        throw new Error('No authToken or user information');
    }

    try {
        if (userRole === "user") {
            const response = await api.get('/orders_by_customer_id/' + customerId, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });
            return { data: response.data };
        } else if (userRole === "admin") {
            const response = await api.get('/all_orders', {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });
            return { data: response.data };
        } else {
            throw new Error('Unexpected role');
        }
    } catch (error) {
        throw new Error('Error fetching users');
    }
};

export const makeNewOrder = async (orderData: OrderType): Promise<{ data: OrderType }> => {
    const userToken = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');
    const customerId = localStorage.getItem('customerId');

    if (!userToken || !userRole || !userId || !customerId) {
        throw new Error('No authToken or user information');
    }

    orderData.id_customer = Number(customerId);

    try {
        const response = await api.post('/order', orderData, {
            headers: {
                Authorization: `Bearer ${userToken}`, // Добавьте токен авторизации
            },
        });

        return { data: response.data }; // Верните данные ответа
    } catch (error) {
        console.error('Error creating order:', error);
        throw new Error('Failed to create order');
    }
};