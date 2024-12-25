// src/service/productsService.js

import api from '../api';
import { ProductType } from '../types/productType';

export const getProducts = async (userToken: string): Promise<{ data: ProductType[] }> => {
    try {
        const response = await api.get('/all_products', {
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        });
        return { data: response.data };
    } catch (error) {
        throw new Error('Error fetching products');
    }
};

export const addProduct = async (productData: ProductType, userToken: string): Promise<{ data: ProductType }> => {
    try {
        const response = await api.post('/product', productData, {
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        });
        return { data: response.data }; // Верните данные ответа
    } catch (error) {
        console.error('Error creating product:', error);
        throw new Error('Failed to create product');
    }
};