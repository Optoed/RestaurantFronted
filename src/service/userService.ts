// src/service/userService.ts

import axios from 'axios';
import { UserType } from '../types/userType';

// Simulate an API request to fetch all users
export const getAllUsers = async (): Promise<{ data: UserType[] }> => {
    try {
        const response = await axios.get('/api/users'); // Replace with actual endpoint
        return { data: response.data };  // Assuming the data returned is an array of users
    } catch (error) {
        throw new Error('Error fetching users');
    }
};

// Simulate an API request to fetch all admins
export const getAllAdmins = async (): Promise<{ data: UserType[] }> => {
    try {
        const response = await axios.get('/api/admins'); // Replace with actual endpoint
        return { data: response.data };  // Assuming the data returned is an array of admins
    } catch (error) {
        throw new Error('Error fetching admins');
    }
};
