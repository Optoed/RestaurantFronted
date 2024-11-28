
import axios from 'axios';

export const loginUser = async (credentials: { email: string; password: string }) => {
    const response = await axios.post('/login', credentials);
    return response.data; // Возвращаем данные из ответа сервера (например, токен)
};
