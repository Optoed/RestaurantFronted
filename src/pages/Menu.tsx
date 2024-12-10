import React, { useState, useEffect } from 'react';

import { getDishes } from '../service/menuService';
import { DishType } from '../types/dishType';

const Menu = () => {
    const [dishes, setDishes] = useState<DishType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dishesResponse = await getDishes();
                setDishes(dishesResponse.data);
            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Menu</h1>
            <p>Welcome to our menu</p>

            <ul>
                {dishes.map((dish) => (
                    <li key={dish.id}>
                        <h2>{dish.name}</h2>
                        <p>Cost: ${dish.cost}</p>
                        <p>Rating: {dish.rating}/5</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Menu;
