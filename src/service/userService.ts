// src/service/userService.ts

import axios from 'axios';
import { UserType } from '../types/userType';
import api from '../api';

// Simulate an API request to fetch all users
export const getAllUsers = async (): Promise<{ data: UserType[] }> => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await api.get('/all_users', {
            headers: { Authorization: `Bearer ${token}` }
        }); // Replace with actual endpoint
        return { data: response.data };  // Assuming the data returned is an array of users
    } catch (error) {
        throw new Error('Error fetching users');
    }
};