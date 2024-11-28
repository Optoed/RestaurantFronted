import React, { useState } from 'react';
import { loginUser } from '../service/loginService'; // Функция для отправки данных на сервер
import { ErrorType } from '../types/errorType';
import { SuccessType } from '../types/successType';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<ErrorType>({ isError: false });
    const [success, setSuccess] = useState<SuccessType>({ isSuccess: false }); // Инициализируем с флагом isSuccess: false

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Предотвращаем перезагрузку страницы
        setError({ isError: false }); // Сброс ошибок перед отправкой
        setSuccess({ isSuccess: false }); // Сбрасываем состояние успеха

        // Простая валидация
        if (!email || !password) {
            setError({
                isError: true,
                message: 'Please fill in all fields.',
            });
            return;
        }

        try {
            // Отправка данных на сервер для логина
            const response = await loginUser({ email, password });

            // Если сервер вернул токен, сохраняем его в localStorage
            if (response.token) {
                localStorage.setItem('authToken', response.token);
                setSuccess({
                    isSuccess: true,
                    message: 'Login successful!',
                });
            }
        } catch (err: any) {
            // Если ошибка, показываем сообщение
            setError({
                isError: true,
                message: err.response?.data?.message || 'Login failed. Please try again.',
                code: err.response?.status,
            });
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error.isError && <p style={{ color: 'red' }}>{error.message}</p>}
                {success.isSuccess && <p style={{ color: 'green' }}>{success.message}</p>}
                <button onClick={handleSubmit}>Login</button>
            </div>
        </div>
    );
};

export default Login;
