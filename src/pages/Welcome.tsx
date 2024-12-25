import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/Welcome.css'; // Import the CSS file

const Welcome = () => {
    return (
        <div className="welcome-container">
            <h1>Добро пожаловать в ресторан "Become Overman"!</h1>
            <p>Откройте для себя полезные и вкусные блюда, приготовленные из свежих и натуральных ингредиентов.</p>
            <p>Мы стремимся сделать здоровое питание доступным и приятным для каждого!</p>
            <div>
                <button>
                    <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Войти в аккаунт</Link>
                </button>
                <button>
                    <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Регистрация</Link>
                </button>
            </div>
        </div>
    );
};

export default Welcome;