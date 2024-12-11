import api from "../api";
import { OrderType } from "../types/orderType";

export const getOrders = async (userToken: string, userRole: string, customerId: number): Promise<{ data: OrderType[] }> => {
    if (!userToken || !userRole || !customerId) {
        throw new Error('No authToken or user information');
    }

    try {
        if (userRole === "user") {
            const response = await api.get('/orders_by_customer_id/' + customerId, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });
            return { data: response.data };
        } else if (userRole === "admin") {
            const response = await api.get('/all_orders', {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });
            return { data: response.data };
        } else {
            throw new Error('Unexpected role');
        }
    } catch (error) {
        throw new Error('Error fetching orders');
    }
};

export const makeNewOrder = async (orderData: OrderType, userToken: string, customerId: number): Promise<{ data: OrderType }> => {
    if (!userToken || !customerId) {
        throw new Error('No authToken or user information');
    }

    orderData.id_customer = Number(customerId);

    try {
        const response = await api.post('/order', orderData, {
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        });

        return { data: response.data };
    } catch (error) {
        console.error('Error creating order:', error);
        throw new Error('Failed to create order');
    }
};