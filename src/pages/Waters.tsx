import React, { useEffect, useState } from 'react';
import { getWaiters, addWaiter } from '../service/waitersService'; // Импортируйте ваши функции
import { WaiterType } from '../types/waiterType'; // Импортируйте WaiterType
import { ErrorType } from '../types/errorType'; // Импортируйте ErrorType
import { LinearProgress } from '@mui/material';
// import '../assets/styles/Cooks.css'; // Импортируйте CSS-файл

const WaitersPage = () => {
    const [waiters, setWaiters] = useState<WaiterType[]>([]);
    const [showLoading, setShowLoading] = useState(true);
    const [error, setError] = useState<ErrorType>({ isError: false });
    const [newWaiter, setNewWaiter] = useState<WaiterType>({ id: 0, name: '', salary: 0, rating: 1, status: 'Free' });
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const userRole = localStorage.getItem("userRole");
        setIsAdmin(userRole === "admin");

        const fetchWaiters = async () => {
            try {
                const response = await getWaiters();
                setWaiters(response.data);
            } catch (err) {
                setError({
                    isError: true,
                    message: "Что-то пошло не так",
                });
            }
        };

        const loadData = async () => {
            await fetchWaiters();
            const timer = setTimeout(() => {
                setShowLoading(false);
            }, 1000); // 1 секунда
            return () => clearTimeout(timer);
        };

        loadData();
    }, []);

    const handleAddWaiter = async () => {
        try {
            const response = await addWaiter(newWaiter);
            setWaiters([...waiters, response.data]);
            setNewWaiter({ id: 0, name: '', salary: 0, rating: 1, status: 'Free' }); // Сбросить значения
        } catch (err) {
            setError({
                isError: true,
                message: "Что-то пошло не так",
            });
        }
    };

    return (
        <div className="container">
            {showLoading && <LinearProgress />}
            {!showLoading && (
                <div>
                    {isAdmin && (
                        <div>
                            <h1 className="title">Добавить официанта</h1>
                            <div className="input-group">
                                <div>
                                    Имя
                                    <input
                                        type="text"
                                        placeholder="Введите имя"
                                        value={newWaiter.name}
                                        onChange={(e) => setNewWaiter({ ...newWaiter, name: e.target.value })}
                                        required
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    Зарплата
                                    <input
                                        type="number"
                                        placeholder="Введите зарплату"
                                        value={newWaiter.salary}
                                        onChange={(e) => setNewWaiter({ ...newWaiter, salary: Number(e.target.value) })}
                                        required
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    Рейтинг
                                    <select
                                        value={newWaiter.rating}
                                        onChange={(e) => setNewWaiter({ ...newWaiter, rating: Number(e.target.value) })}
                                        className="input-field"
                                    >
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={4}>4</option>
                                        <option value={5}>5</option>
                                    </select>
                                </div>
                                <div>
                                    Статус
                                    <select
                                        value={newWaiter.status}
                                        onChange={(e) => setNewWaiter({ ...newWaiter, status: e.target.value })}
                                        className="input-field"
                                    >
                                        <option value="Free">Free</option>
                                        <option value="Busy">Busy</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <button onClick={handleAddWaiter}>Добавить официанта</button>
                                </div>
                            </div>
                        </div>
                    )}

                    <h1 className="title">Список официантов</h1>
                    <ul className="cook-list">
                        {waiters.map(waiter => (
                            <li key={waiter.id} className="cook-item">
                                <strong>Имя:</strong> {waiter.name} <br />
                                {isAdmin && (
                                    <>
                                        <strong>Зарплата:</strong> {waiter.salary} <br />
                                    </>
                                )}
                                <strong>Рейтинг:</strong> {waiter.rating} <br />
                                <strong>Статус:</strong> {waiter.status}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {error.isError && <div className="error-message">{error.message}</div>}
        </div>
    );
};

export default WaitersPage;