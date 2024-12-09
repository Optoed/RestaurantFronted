import React, { useState } from 'react';
import { registerUser } from '../service/registerService';
import { ErrorType } from '../types/errorType';
import { SuccessType } from '../types/successType';
import { useNavigate } from 'react-router-dom'; // Импортируем useNavigate
import '../assets/styles/Register.css'

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState<ErrorType>({ isError: false });
    const [success, setSuccess] = useState<SuccessType>({ isSuccess: false });

    const navigate = useNavigate(); // Инициализируем navigate

    const handleRegister = async () => {
        setError({ isError: false });
        setSuccess({ isSuccess: false });

        const payload = { name, email, password, role };
        try {
            const response = await registerUser(payload);
            setSuccess({
                isSuccess: true,
                message: 'Registration successful! Please log in.',
            });

            // После успешной регистрации перенаправляем на страницу логина
            setTimeout(() => {
                navigate('/login'); // Перенаправление на страницу логина
            }, 2000); // Ждем 2 секунды перед редиректом (чтобы пользователь успел увидеть сообщение)

            console.log(response);
        } catch (err: any) {
            setError({
                isError: true,
                message: err.response?.data?.message || 'An error occurred during registration.',
                code: err.response?.status,
            });
            console.error(err);
        }
    };

    return (
        <div className='register-container'>
            <h1>Register</h1>
            <div>
                <div>
                    Name
                    <input
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    Role
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="button" onClick={handleRegister}>
                    Register
                </button>
            </div>
            {error.isError && <p style={{ color: 'red' }}>{error.message}</p>}
            {success.isSuccess && <p style={{ color: 'green' }}>{success.message}</p>}

            {/* Кнопка для перехода на страницу логина */}
            <div>
                <button onClick={() => navigate('/login')}>Already have an account? Login</button>
            </div>
        </div>
    );
};

export default Register;
