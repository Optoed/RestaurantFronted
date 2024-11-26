import React, { useState } from 'react';
import api from '../api'; // Import your axios instance

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        const payload = { name, email, password, role };
        console.log("Payload:", payload);

        try {
            const response = await api.post('/register', payload);
            setSuccess('Registration successful! Please log in.');
            console.log(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred during registration.');
            console.error(err);
        }
    };

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
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
                        onChange={(e) => { setRole(e.target.value); }}
                        required
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit">Register</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    );
};

export default Register;

export { };