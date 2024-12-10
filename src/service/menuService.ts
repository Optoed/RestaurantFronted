// src/service/userService.ts

import axios from 'axios';
import { DishType } from '../types/dishType';
import api from '../api';

export const getDishes = async (): Promise<{ data: DishType[] }> => {
    try {
        const response = await api.get('/all_dishes');
        return { data: response.data };
    } catch (error) {
        throw new Error('Error fetching users');
    }
};

export const makeNewDish = async (dishData: DishType): Promise<{ data: DishType }> => {
    const userToken = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');

    if (!userToken || !userRole || !userId) {
        throw new Error('No authToken or user information');
    }

    try {
        const response = await api.post('/dish', dishData, {
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