import React, { useState, useEffect } from 'react';
import { getDishes } from '../service/menuService';
import { DishType } from '../types/dishType';
import { LinearProgress } from '@mui/material';
import '../assets/styles/Menu.css';
import '../assets/styles/Button.css';
import { error } from 'console';
import { newOrder } from '../service/ordersService';

const Menu = () => {
    const [dishes, setDishes] = useState<DishType[]>([]);
    const [loading, setLoading] = useState(true);
    const [showLoading, setShowLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [cart, setCart] = useState<{ [key: number]: { dish: DishType; quantity: number } }>({});
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dishesResponse = await getDishes();
                setDishes(dishesResponse.data);
                const role = localStorage.getItem('userRole');
                setIsAdmin(role === 'admin');

                console.log("menu data user: ", localStorage.getItem('customerId'), localStorage.getItem('userId'))

            } catch (error) {
                console.error("Ошибка при получении данных", error);
            } finally {
                const timer = setTimeout(() => {
                    setShowLoading(false);
                    setLoading(false);
                }, 1000);
                return () => clearTimeout(timer);
            }
        };

        fetchData();
    }, []);

    const handleAddToCart = (dish: DishType) => {
        setCart((prevCart) => {
            const currentDish = prevCart[dish.id];
            if (currentDish) {
                return {
                    ...prevCart,
                    [dish.id]: { dish, quantity: currentDish.quantity + 1 },
                };
            } else {
                return {
                    ...prevCart,
                    [dish.id]: { dish, quantity: 1 },
                };
            }
        });
        setShowMessage(true);
        setTimeout(() => {
            setShowMessage(false);
            setMessage('');
        }, 3000);
    };

    const handleRemoveFromCart = (dish: DishType) => {
        setCart((prevCart) => {
            const currentDish = prevCart[dish.id];
            if (currentDish) {
                if (currentDish.quantity > 1) {
                    return {
                        ...prevCart,
                        [dish.id]: { dish, quantity: currentDish.quantity - 1 },
                    };
                } else {
                    const { [dish.id]: removed, ...newCart } = prevCart;
                    setMessage(`"${dish.name}" удалено из корзины!`);
                    setShowMessage(true);
                    setTimeout(() => {
                        setShowMessage(false);
                        setMessage('');
                    }, 3000);
                    return newCart;
                }
            }
            return prevCart;
        });
    };

    const handleCheckout = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const customerId = Number(localStorage.getItem('customerId'));
            const userId = Number(localStorage.getItem('userId'));
            const userRole = localStorage.getItem('userRole') || '';

            console.log(authToken, customerId, userId, userRole);

            if (!authToken || !customerId || !userId) {
                setMessage('Ошибка авторизации. Пожалуйста, авторизуйтесь заново.');
                setShowMessage(true);
                setTimeout(() => {
                    setShowMessage(false);
                    setMessage('');
                }, 3000);
                return; // Если нет авторизационных данных, выходим из функции
            }

            const response = await newOrder(authToken, customerId, userId, userRole, totalCost, cart);
            if (!response.ok) {
                throw new Error('Ошибка при оформлении заказа');
            }

            console.log('Оформление заказа:', Object.values(cart).map(item => ({ ...item.dish, quantity: item.quantity })));
            alert('Ваш заказ оформлен!');
            setCart({});
        } catch (error) {
            console.error('Ошибка:', error);
            setMessage('Произошла ошибка при оформлении заказа. Попробуйте еще раз.');
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false);
                setMessage('');
            }, 3000);
        }
    };

    const totalCost = Object.values(cart).reduce((total, item) => total + item.dish.cost * item.quantity, 0);

    return (
        <div className="menu-container">
            {showLoading && <LinearProgress />}

            {!showLoading && (
                <>
                    <div className="cart-container">
                        <h2>Корзина</h2>
                        {Object.keys(cart).length === 0 ? (
                            <p>Корзина пуста.</p>
                        ) : (
                            <ul>
                                {Object.values(cart).map(({ dish, quantity }) => (
                                    <li key={dish.id} className="cart-item">
                                        <h3>{dish.name}</h3>
                                        <p>Стоимость: {dish.cost} руб. (Количество: {quantity})</p>
                                        <button className='remove-button' onClick={() => handleRemoveFromCart(dish)}>Убрать одну</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <p className="total-cost">Суммарная стоимость: {totalCost} руб.</p>
                        <button onClick={handleCheckout} disabled={Object.keys(cart).length === 0}>Оформить заказ</button>
                    </div>

                    <h1 className="menu-title">Меню</h1>

                    {isAdmin && (
                        <button className="add-dish-button">Добавить новое блюдо</button>
                    )}

                    {showMessage && <div className="cart-message">{message}</div>}

                    <ul>
                        {dishes.map((dish) => (
                            <li key={dish.id} className="menu-item">
                                <h2>{dish.name}</h2>
                                <p>Стоимость: {dish.cost} руб.</p>
                                <p>Рейтинг: {dish.rating}/10</p>
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