import React, { useState, useEffect } from 'react';
import { getDishes } from '../service/menuService';
import { DishType } from '../types/dishType';
import { LinearProgress } from '@mui/material'; // Импортируйте LinearProgress
import '../assets/styles/Menu.css';

const Menu = () => {
    const [dishes, setDishes] = useState<DishType[]>([]);
    const [loading, setLoading] = useState(true);
    const [showLoading, setShowLoading] = useState(true); // Новое состояние для управления видимостью полосы загрузки
    const [isAdmin, setIsAdmin] = useState(false); // Состояние для роли администратора
    const [message, setMessage] = useState(''); // Состояние для сообщения
    const [showMessage, setShowMessage] = useState(false); // Состояние для отображения сообщения

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dishesResponse = await getDishes();
                setDishes(dishesResponse.data);

                // Получаем информацию о текущем пользователе
                const role = localStorage.getItem('userRole');
                setIsAdmin(role === 'admin'); // Устанавливаем isAdmin в зависимости от роли
            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                // Установите таймер для скрытия полосы загрузки через 1 секунду
                const timer = setTimeout(() => {
                    setShowLoading(false);
                    setLoading(false);
                }, 1000); // 1 секунда

                // Очистите таймер при размонтировании компонента
                return () => clearTimeout(timer);
            }
        };

        fetchData();
    }, []);

    const handleAddToCart = (dish: DishType) => {
        // Логика добавления блюда в корзину
        console.log(`Added ${dish.name} to cart`);
        setMessage(`"${dish.name}" добавлено в корзину!`); // Устанавливаем сообщение
        setShowMessage(true); // Показываем сообщение

        // Скрываем сообщение через 3 секунды
        setTimeout(() => {
            setShowMessage(false);
            setMessage(''); // Очищаем сообщение
        }, 3000);
    };

    return (
        <div className="menu-container">
            {showLoading && <LinearProgress />} {/* Показываем полосу загрузки только если showLoading true */}

            {!showLoading && ( // Отображаем контент только если showLoading false
                <>
                    <h1 className="menu-title">Menu</h1>
                    <p>Welcome to our menu</p>

                    {isAdmin && (
                        <button className="add-dish-button">Добавить новое блюдо</button>
                    )}

                    {showMessage && <div className="cart-message">{message}</div>} {/* Отображаем сообщение */}

                    <ul>
                        {dishes.map((dish) => (
                            <li key={dish.id} className="menu-item">
                                <h2>{dish.name}</h2>
                                <p>Cost: ${dish.cost}</p>
                                <p>Rating: {dish.rating}/5</p>
                                <button onClick={() => handleAddToCart(dish)}>Добавить в корзину</button>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default Menu;