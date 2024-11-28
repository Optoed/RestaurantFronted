import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
    return (
        <div>
            <h1>Welcome to the App!</h1>
            <p>Start by logging in or registering to use all features of the app.</p>
            <div>
                <button>
                    <Link to="/login">Login</Link>
                </button>
                <button>
                    <Link to="/register">Register</Link>
                </button>
            </div>
        </div>
    );
};

export default Welcome;
