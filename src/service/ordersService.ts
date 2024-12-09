// src/service/userService.ts

import axios from 'axios';
import { OrderType } from '../types/orderType';
import api from '../api';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../features/auth/authSlice';
import { selectUser, selectUserRole } from '../features/profile/profileSlice';


export const getOrders = async (): Promise<{ data: OrderType[] }> => {

    const userToken = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');

    const customerId = localStorage.getItem('customerId')

    console.log("token and other info", userToken, userRole, userId, customerId)

    try {
        if (userRole === "user") {
            const response = await api.get('/orders_by_customer_id/' + customerId);
            return { data: response.data };
        } else if (userRole === "admin") {
            const response = await api.get('/all_orders');
            return { data: response.data };
        } else {
            throw new Error('Unexpected role');
        }

    } catch (error) {
        throw new Error('Error fetching users');
    }
};