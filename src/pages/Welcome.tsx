import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/Welcome.css'; // Import the CSS file

const Welcome = () => {
    return (
        <div className="welcome-container">
            <h1>Welcome to the App!</h1>
            <p>Start by logging in or registering to use all features of the app.</p>
            <div>
                <button>
                    <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
                </button>
                <button>
                    <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Register</Link>
                </button>
            </div>
        </div>
    );
};

export default Welcome;