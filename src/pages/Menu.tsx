import React, { useState, useEffect } from 'react';
import { getDishes } from '../service/menuService';
import { DishType } from '../types/dishType';
import { LinearProgress } from '@mui/material';
import '../assets/styles/Menu.css';
import '../assets/styles/Button.css';

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

    const handleCheckout = () => {
        console.log('Оформление заказа:', Object.values(cart).map(item => ({ ...item.dish, quantity: item.quantity })));
        alert('Ваш заказ оформлен!');
        setCart({});
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