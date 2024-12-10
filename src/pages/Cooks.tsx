import React, { useEffect, useState } from 'react';
import { getCooks, addCook } from '../service/cooksService'; // Импортируйте ваши функции
import { CookType } from '../types/cookType'; // Импортируйте CookType
import { ErrorType } from '../types/errorType'; // Импортируйте ErrorType
import '../assets/styles/Cooks.css';

const CooksPage = () => {
    const [cooks, setCooks] = useState<CookType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<ErrorType>({ isError: false }); // Изменено на ErrorType
    const [newCook, setNewCook] = useState<CookType>({ id: 0, name: '', post: '', salary: 0, rating: 0, status: '' });

    useEffect(() => {
        const fetchCooks = async () => {
            try {
                const response = await getCooks();
                console.log(response);
                setCooks(response.data);
            } catch (err) {
                setError({
                    isError: true,
                    message: "Something goes wrong",
                });
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCooks();
    }, []);

    const handleAddCook = async () => {
        try {
            const response = await addCook(newCook);
            setCooks([...cooks, response.data]);
            setNewCook({ id: 0, name: '', post: '', salary: 0, rating: 0, status: '' }); // Сбросить поля
        } catch (err) {
            setError({
                isError: true,
                message: "Something goes wrong",
            });
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container">
            <h1 className="title">Список поваров</h1>
            <ul className="list">
                {cooks.map(cook => (
                    <li className="list-item" key={cook.id}>
                        <strong>Name:</strong> {cook.name} <br />
                        <strong>Post:</strong> {cook.post} <br />
                        <strong>Salary:</strong> {cook.salary} <br />
                        <strong>Rating:</strong> {cook.rating} <br />
                        <strong>Status:</strong> {cook.status}
                    </li>
                ))}
            </ul>
            <div className="form">
                <input
                    className="input"
                    type="text"
                    placeholder="Name"
                    value={newCook.name}
                    onChange={(e) => setNewCook({ ...newCook, name: e.target.value })}
                    required
                />
                <input
                    className="input"
                    type="text"
                    placeholder="Post"
                    value={newCook.post}
                    onChange={(e) => setNewCook({ ...newCook, post: e.target.value })}
                    required
                />
                <input
                    className="input"
                    type="number"
                    placeholder="Salary"
                    value={newCook.salary}
                    onChange={(e) => setNewCook({ ...newCook, salary: Number(e.target.value) })}
                    required
                />
                <input
                    className="input"
                    type="number"
                    placeholder="Rating"
                    value={newCook.rating}
                    onChange={(e) => setNewCook({ ...newCook, rating: Number(e.target.value) })}
                    required
                />
                <input
                    className="input"
                    type="text"
                    placeholder="Status"
                    value={newCook.status}
                    onChange={(e) => setNewCook({ ...newCook, status: e.target.value })}
                    required
                />
                <button className="button" onClick={handleAddCook}>Добавить повара</button>
            </div>
        </div>
    );
};

export default CooksPage;