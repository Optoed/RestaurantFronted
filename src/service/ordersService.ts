// src/service/userService.ts

import axios from 'axios';
import { OrderType } from '../types/orderType';
import api from '../api';


export const getAllOrders = async (): Promise<{ data: OrderType[] }> => {
    try {
        const response = await api.get('/all_orders');
        return { data: response.data };
    } catch (error) {
        throw new Error('Error fetching users');
    }
};