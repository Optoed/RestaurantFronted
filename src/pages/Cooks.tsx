import React, { useEffect, useState } from 'react';
import { getCooks, addCook } from '../service/cooksService'; // Импортируйте ваши функции
import { CookType } from '../types/cookType'; // Импортируйте CookType
import { ErrorType } from '../types/errorType'; // Импортируйте ErrorType
import { LinearProgress } from '@mui/material';
import '../assets/styles/Cooks.css'; // Импортируйте CSS-файл

const CooksPage = () => {
    const [cooks, setCooks] = useState<CookType[]>([]);
    const [showLoading, setShowLoading] = useState(true);
    const [error, setError] = useState<ErrorType>({ isError: false });
    const [newCook, setNewCook] = useState<CookType>({ id: 0, name: '', post: '', salary: 0, rating: 1, status: 'Free' });
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        const userRole = localStorage.getItem("userRole")
        setIsAdmin(userRole === "admin")

        const fetchCooks = async () => {
            try {
                const response = await getCooks();
                setCooks(response.data);
            } catch (err) {
                setError({
                    isError: true,
                    message: "Something goes wrong",
                });
            }
        };

        const loadData = async () => {
            await fetchCooks();
            const timer = setTimeout(() => {
                setShowLoading(false);
            }, 1000); // 1 секунда
            return () => clearTimeout(timer);
        };

        loadData();
    }, []);

    const handleAddCook = async () => {
        try {
            const response = await addCook(newCook);
            setCooks([...cooks, response.data]);
            setNewCook({ id: 0, name: '', post: '', salary: 0, rating: 1, status: 'Free' }); // Reset to default values
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
                            <h1 className="title">Добавить повара</h1>
                            <div className="input-group">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Введите имя"
                                        value={newCook.name}
                                        onChange={(e) => setNewCook({ ...newCook, name: e.target.value })}
                                        required
                                        className="input-field"
                                    />
                                    Имя
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Введите должность"
                                        value={newCook.post}
                                        onChange={(e) => setNewCook({ ...newCook, post: e.target.value })}
                                        required
                                        className="input-field"
                                    />
                                    Должность
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        placeholder="Введите зарплату"
                                        value={newCook.salary}
                                        onChange={(e) => setNewCook({ ...newCook, salary: Number(e.target.value) })}
                                        required
                                        className="input-field"
                                    />
                                    Зарплата
                                </div>
                                <div>
                                    <select
                                        value={newCook.rating}
                                        onChange={(e) => setNewCook({ ...newCook, rating: Number(e.target.value) })}
                                        className="input-field"
                                    >
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={4}>4</option>
                                        <option value={5}>5</option>
                                    </select>
                                    Рейтинг
                                </div>
                                <div>
                                    <select
                                        value={newCook.status}
                                        onChange={(e) => setNewCook({ ...newCook, status: e.target.value })}
                                        className="input-field"
                                    >
                                        <option value="Free">Free</option>
                                        <option value="Busy">Busy</option>
                                    </select>
                                    Статус
                                </div>
                                <button className="add-button" onClick={handleAddCook}>Добавить повара</button>
                            </div>
                        </div>
                    )}

                    <h1 className="title">Список поваров</h1>
                    <ul className="cook-list">
                        {cooks.map(cook => (
                            <li key={cook.id} className="cook-item">
                                <strong>Имя:</strong> {cook.name} <br />
                                <strong>Должность:</strong> {cook.post} <br />
                                <strong>Зарплата:</strong> {cook.salary} <br />
                                <strong>Рейтинг:</strong> {cook.rating} <br />
                                <strong>Статус:</strong> {cook.status}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {error.isError && <div className="error-message">{error.message}</div>}
        </div>
    );
};

export default CooksPage;