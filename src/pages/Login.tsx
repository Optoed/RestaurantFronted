import React, { useState } from 'react';
import { loginUser } from '../service/loginService';
import { ErrorType } from '../types/errorType';
import { SuccessType } from '../types/successType';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthToken, clearAuthToken } from '../features/auth/authSlice';
import { setProfile } from '../features/profile/profileSlice';
import '../assets/styles/Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<ErrorType>({ isError: false });
    const [success, setSuccess] = useState<SuccessType>({ isSuccess: false });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError({ isError: false });
        setSuccess({ isSuccess: false });

        // Простая валидация
        if (!email || !password) {
            setError({
                isError: true,
                message: 'Please fill in all fields.',
            });
            return;
        }

        console.log("Sending login request...", { email, password });

        try {
            // Отправка данных на сервер для логина
            const response = await loginUser({ email, password });

            console.log("Login response:", response);

            console.log(response.customerId)

            const access_token: string = response.access_token;
            console.log("Login token = ", access_token);

            if (access_token) {
                localStorage.setItem('authToken', access_token);
                dispatch(setAuthToken(access_token));

                localStorage.setItem('userId', response.user.id)
                localStorage.setItem('customerId', response.customerId)
                localStorage.setItem('userName', response.user.name)
                localStorage.setItem('userEmail', response.user.email)
                localStorage.setItem('userRole', response.user.role)

                dispatch(setProfile({
                    id: response.user.id,
                    id_customer: response.customerId,
                    name: response.user.name,
                    email: response.user.email,
                    role: response.user.role,
                }));

                setSuccess({
                    isSuccess: true,
                    message: 'Успешная авторизация, добро пожаловать!',
                });


                setTimeout(() => {
                    navigate('/menu');
                }, 2000);
            } else {
                setSuccess({
                    isSuccess: false,
                    message: 'Проблемы с токеном авторизации',
                });
            }

        } catch (err: any) {
            console.error("Login error:", err);

            setError({
                isError: true,
                message: err.response?.data?.message || 'Ошибка при авторизации',
                code: err.response?.status,
            });
        }
    };

    return (
        <div className='login-container'>
            <h1>Авторизация</h1>
            <div>
                <div>
                    <label>Почта</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Пароль</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error.isError && <p style={{ color: 'red' }}>{error.message}</p>}
                {success.isSuccess && <p style={{ color: 'green' }}>{success.message}</p>}
                <button onClick={handleSubmit}>Войти</button>
            </div>

            {/* Кнопка для перехода на страницу регистрации */}
            <div>
                <button onClick={() => navigate('/register')}>Нет аккаунта? Зарегистрируйся!</button>
            </div>
        </div>
    );
};

export default Login;