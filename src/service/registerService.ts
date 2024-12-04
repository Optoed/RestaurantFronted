import api from '../api'; // Подключаем вашу axios настройку

interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    role: string;
}

export const registerUser = async (payload: RegisterPayload) => {
    try {
        const response = await api.post('/register', payload); // Запрос на /register будет отправлен на http://localhost:8020/api/register
        return response.data;  // Возвращаем данные ответа от сервера
    } catch (error) {
        console.error('Registration error:', error);
        throw error;  // Обработка ошибки
    }
};
