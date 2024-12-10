import React, { useEffect, useState } from 'react';
import { getCooks, addCook } from '../service/cooksService'; // Импортируйте ваши функции
import { CookType } from '../types/cookType'; // Импортируйте CookType
import { ErrorType } from '../types/errorType'; // Импортируйте ErrorType
import { LinearProgress } from '@mui/material';
import '../assets/styles/Cooks.css'; // Импортируйте CSS-файл

const CooksPage = () => {
    const [cooks, setCooks] = useState<CookType[]>([]);
    const [loading, setLoading] = useState(true);
    const [showLoading, setShowLoading] = useState(true); // Новое состояние для управления видимостью полосы загрузки
    const [error, setError] = useState<ErrorType>({ isError: false });
    const [newCook, setNewCook] = useState<CookType>({ id: 0, name: '', post: '', salary: 0, rating: 0, status: '' });

    useEffect(() => {
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
            await fetchCooks(); // Ждем завершения загрузки данных
            // Установите таймер для скрытия полосы загрузки через 2-3 секунды
            const timer = setTimeout(() => {
                setShowLoading(false);
                setLoading(false); // Устанавливаем loading в false после таймера
            }, 1000); // 1 секунда

            // Очистите таймер при размонтировании компонента
            return () => clearTimeout(timer);
        };

        loadData();
    }, []);

    const handleAddCook = async () => {
        try {
            const response = await addCook(newCook);
            setCooks([...cooks, response.data]);
            setNewCook({ id: 0, name: '', post: '', salary: 0, rating: 0, status: '' });
        } catch (err) {
            setError({
                isError: true,
                message: "Something goes wrong",
            });
        }
    };

    return (
        <div className="container">
            {showLoading && <LinearProgress />} {/* Показываем полосу загрузки только если showLoading true */}
            {!showLoading && (
                <div>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Name"
                            value={newCook.name}
                            onChange={(e) => setNewCook({ ...newCook, name: e.target.value })}
                            required
                            className="input-field"
                        />
                        <input
                            type="text"
                            placeholder="Post"
                            value={newCook.post}
                            onChange={(e) => setNewCook({ ...newCook, post: e.target.value })}
                            required
                            className="input-field"
                        />
                        <input
                            type="number"
                            placeholder="Salary"
                            value={newCook.salary}
                            onChange={(e) => setNewCook({ ...newCook, salary: Number(e.target.value) })}
                            required
                            className="input-field"
                        />
                        <input
                            type="number"
                            placeholder="Rating"
                            value={newCook.rating}
                            onChange={(e) => setNewCook({ ...newCook, rating: Number(e.target.value) })}
                            required
                            className="input-field"
                        />
                        <input
                            type="text"
                            placeholder="Status"
                            value={newCook.status}
                            onChange={(e) => setNewCook({ ...newCook, status: e.target.value })}
                            required
                            className="input-field"
                        />
                        <button className="add-button" onClick={handleAddCook}>Добавить повара</button>
                    </div>
                    <h1 className="title">Список поваров</h1>
                    <ul className="cook-list">
                        {cooks.map(cook => (
                            <li key={cook.id} className="cook-item">
                                <strong>Name:</strong> {cook.name} <br />
                                <strong>Post:</strong> {cook.post}
                                <strong>Salary:</strong> {cook.salary} <br />
                                <strong>Rating:</strong> {cook.rating} <br />
                                <strong>Status:</strong> {cook.status}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CooksPage;