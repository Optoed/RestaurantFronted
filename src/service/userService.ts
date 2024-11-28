// src/service/userService.ts

import axios from 'axios';
import { UserType } from '../types/userType';

// Simulate an API request to fetch all users
export const getAllUsers = async (): Promise<{ data: UserType[] }> => {
    try {
        const response = await axios.get('/all_users'); // Replace with actual endpoint
        return { data: response.data };  // Assuming the data returned is an array of users
    } catch (error) {
        throw new Error('Error fetching users');
    }
};