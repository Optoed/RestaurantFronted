import axios from 'axios';
import api from '../api';

export const loginUser = async (credentials: { email: string; password: string }) => {
    console.log("Making POST request to login with", credentials);  // Логирование перед запросом

    try {
        const response = await api.post('/login', credentials);
        console.log("Response from login:", response);  // Логируем ответ от сервера
        return response.data; // Возвращаем данные из ответа сервера (например, токен)
    } catch (err: any) {
        console.error("Error during login request:", err);  // Логируем ошибку запроса
        throw err;  // Пробрасываем ошибку, чтобы она была поймана в компоненте
    }
};
