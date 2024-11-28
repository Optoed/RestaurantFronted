// src/service/userService.ts

import axios from 'axios';
import { UserType } from '../types/userType';

// Simulate an API request to fetch all orders
export const getAllOrders = async (): Promise<{ data: OrderType[] }> => {
    try {
        const response = await axios.get('/all_orders'); // Replace with actual endpoint
        return { data: response.data };
    } catch (error) {
        throw new Error('Error fetching users');
    }
};