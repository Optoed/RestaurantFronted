import api from '../api'; // Подключаем вашу axios настройку

interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    role: string;
}

export const registerUser = async (payload: RegisterPayload) => {
    const response = await api.post('/register', payload);
    return response.data; // Возвращаем данные
};
