import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'; // Импортируйте useSelector
import { ProductType } from '../types/productType'; // Импортируйте тип продукта
import { ErrorType } from '../types/errorType'; // Импортируйте тип ошибки
import { getProducts, addProduct } from '../service/productsService'; // Импортируйте функции для работы с продуктами
import { LinearProgress, Button, Snackbar } from '@mui/material'; // Импортируйте необходимые компоненты
import { selectAuthToken } from '../features/auth/authSlice'; // Импортируйте селектор для получения токена
import '../assets/styles/Product.css'; // Импортируйте CSS файл для стилей
import '../assets/styles/Button.css';

const ProductsPage = () => {
    const [products, setProducts] = useState<ProductType[]>([]); // Состояние для хранения списка продуктов
    const [loading, setLoading] = useState(true); // Состояние для загрузки
    const [error, setError] = useState<ErrorType>({ isError: false }); // Состояние для ошибок
    const [isAdmin, setIsAdmin] = useState(false);
    const [newProduct, setNewProduct] = useState<ProductType>({ id: 1, name: '', cost: 0 }); // Состояние для нового продукта
    const [searchTerm, setSearchTerm] = useState(''); // Состояние для поиска
    const [snackbarOpen, setSnackbarOpen] = useState(false); // Состояние для управления оповещением
    const [snackbarMessage, setSnackbarMessage] = useState(''); // Состояние для сообщения Snackbar

    const userToken = useSelector(selectAuthToken); // Получите токен из Redux

    useEffect(() => {

        const userRole = localStorage.getItem("userRole");
        setIsAdmin(userRole === "admin");

        const fetchProducts = async () => {
            try {
                const response = await getProducts(userToken); // Передайте токен
                console.log("products = ", response.data);
                setProducts(response.data);
            } catch (err) {
                setError({ isError: true, message: "Ошибка при загрузке продуктов" });
            } finally {
                setLoading(false); // Установите состояние загрузки в false
            }
        };

        fetchProducts();
    }, [userToken]); // Добавьте userToken в зависимости

    const handleAddProduct = async () => {
        // Проверка на пустое название и цену
        if (newProduct.name.trim() === '' || newProduct.cost <= 0) {
            setError({ isError: true, message: "Название не может быть пустым и цена должна быть больше 0" });
            return;
        }

        try {
            const response = await addProduct(newProduct, userToken); // Передайте токен
            setProducts([...products, response.data]);
            setNewProduct({ id: 1, name: '', cost: 0 }); // Сбросить форму
            setSnackbarMessage("Продукт успешно добавлен"); // Установите сообщение
            setSnackbarOpen(true); // Открыть оповещение
        } catch (err) {
            setError({ isError: true, message: "Ошибка при добавлении продукта" });
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <LinearProgress />; // Показать индикатор загрузки
    }

    if (!isAdmin) {
        return <div>У вас нет доступа к этой странице.</div>; // Если не администратор
    }

    return (
        <div className="products-page-container">
            <h1 className="products-page-title">Список продуктов</h1>
            <div className="input-container">
                <p>Введите название нового продукта:</p>
                <input
                    type="text"
                    placeholder="Название продукта"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="input-field"
                />
                <p>Введите цену нового продукта:</p>
                <input
                    type="number"
                    placeholder="Цена продукта"
                    value={newProduct.cost}
                    onChange={(e) => setNewProduct({ ...newProduct, cost: Number(e.target.value) })}
                    className="input-field"
                />
                <button onClick={handleAddProduct}>
                    Добавить продукт
                </button>
            </div>
            {error.isError && <div className="products-error-message">{error.message}</div>} {/* Отображение сообщения об ошибке */}
            <input
                type="text"
                placeholder="Поиск по названию"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="products-search-input"
            />
            <div>
                <table className="products-table">
                    <thead>
                        <tr>
                            <th className="products-table-header">Название</th>
                            <th className="products-table-header">Цена</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => (
                            <tr key={product.name} className="products-table-row">
                                <td className="products-table-cell">{product.name}</td>
                                <td className="products-table-cell">{product.cost}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                message={snackbarMessage} // Используем сообщение из состояния
            />
        </div>
    );
};

export default ProductsPage;