import React, { useState } from 'react';
import { loginUser } from '../service/loginService'; // Функция для отправки данных на сервер
import { ErrorType } from '../types/errorType';
import { SuccessType } from '../types/successType';
import { useNavigate } from 'react-router-dom'; // Импортируем useNavigate
import '../assets/styles/Login.css'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<ErrorType>({ isError: false });
    const [success, setSuccess] = useState<SuccessType>({ isSuccess: false }); // Инициализируем с флагом isSuccess: false

    const navigate = useNavigate(); // Инициализируем navigate

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

        console.log("Sending login request...", { email, password });  // Добавим логирование

        try {
            // Отправка данных на сервер для логина
            const response = await loginUser({ email, password });

            console.log("Login response:", response); // Логируем ответ от сервера

            const access_token: string = response.access_token;
            console.log("Login token = ", access_token);

            // Если сервер вернул токен, сохраняем его в localStorage
            if (access_token) {
                localStorage.setItem('authToken', access_token);
                setSuccess({
                    isSuccess: true,
                    message: 'Login successful!',
                });

                // Перенаправляем на страницу dashboard после успешного логина
                setTimeout(() => {
                    navigate('/dashboard'); // Перенаправляем на dashboard
                }, 2000); // Ждем 2 секунды перед редиректом
            } else {
                setSuccess({
                    isSuccess: false,
                    message: 'Troubles with login because of token..',
                });
            }

            console.log(response)

            localStorage.setItem('userId', response.user.id)
            localStorage.setItem('userRole', response.user.role)
            localStorage.setItem('customerId', response.customerId)

        } catch (err: any) {
            // Логирование ошибки
            console.error("Login error:", err);  // Логируем ошибку

            // Если ошибка, показываем сообщение
            setError({
                isError: true,
                message: err.response?.data?.message || 'Login failed. Please try again.',
                code: err.response?.status,
            });
        }
    };


    return (
        <div className='login-container'>
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

            {/* Кнопка для перехода на страницу регистрации */}
            <div>
                <button onClick={() => navigate('/register')}>Don't have an account? Register</button>
            </div>
        </div>
    );
};

export default Login;
