import React, { useState } from 'react';
import { registerUser } from '../service/registerService';
import { ErrorType } from '../types/errorType';
import { SuccessType } from '../types/successType';



const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState<ErrorType>({ isError: false });
    const [success, setSuccess] = useState<SuccessType>({ isSuccess: false });

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
        <div>
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
        </div>
    );
};

export default Register;
