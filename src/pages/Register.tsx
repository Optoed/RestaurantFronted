import React from 'react';

const Register = () => {
    return (
        <div>
            <h1>Register</h1>
            <form>
                <label>Email</label>
                <input type="email" />
                <label>Password</label>
                <input type="password" />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;

export { }