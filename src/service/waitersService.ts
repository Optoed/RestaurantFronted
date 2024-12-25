import axios from 'axios';
import { WaiterType } from '../types/waiterType'; // Убедитесь, что этот тип определен
import api from '../api';

// Функция для получения всех официантов
export const getWaiters = async (): Promise<{ data: WaiterType[] }> => {
    try {
        const response = await api.get('/all_waiters');
        console.log(response.data);
        return { data: response.data }; // Возвращаем список официантов
    } catch (error) {
        console.error('Ошибка при получении официантов:', error);
        throw new Error('Ошибка при получении официантов');
    }
};

// Функция для добавления нового официанта
export const addWaiter = async (waiterData: WaiterType): Promise<{ data: WaiterType }> => {
    const userToken = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');

    if (!userToken || !userRole) {
        throw new Error('Нет токена аутентификации или информации о пользователе');
    }

    try {
        const response = await api.post('/waiter', waiterData, {
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        });
        return { data: response.data }; // Возвращаем данные созданного официанта
    } catch (error) {
        console.error('Ошибка при создании официанта:', error);
        throw new Error('Не удалось создать официанта');
    }
};