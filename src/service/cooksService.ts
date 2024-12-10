import axios from 'axios';
import { CookType } from '../types/cookType'; // Make sure to define this type
import api from '../api';

// Function to fetch all cooks
export const getCooks = async (): Promise<{ data: CookType[] }> => {
    try {
        const response = await api.get('/all_cooks');
        console.log(response.data);
        return { data: response.data }; // Return the list of cooks
    } catch (error) {
        console.error('Error fetching cooks:', error);
        throw new Error('Error fetching cooks');
    }
};

// Function to add a new cook
export const addCook = async (cookData: CookType): Promise<{ data: CookType }> => {
    const userToken = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');

    if (!userToken || !userRole) {
        throw new Error('No authToken or user information');
    }

    try {
        const response = await api.post('/cook', cookData, {
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        });
        return { data: response.data }; // Return the created cook data
    } catch (error) {
        console.error('Error creating cook:', error);
        throw new Error('Failed to create cook');
    }
};