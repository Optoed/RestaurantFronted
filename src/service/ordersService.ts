import api from "../api";
import { OrderType } from "../types/orderType";

export const getDetailedOrders = async (userToken: string, userRole: string, customerId: number): Promise<{ data: OrderType[] }> => {
    if (!userToken || !userRole || !customerId) {
        throw new Error('No authToken or user information');
    }

    console.log('userToken = ', userToken)
    console.log('userRole = ', userRole)
    console.log('customerId = ', customerId)

    try {
        if (userRole === "user") {
            const response = await api.get('/orders_by_customer_id/' + customerId, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });
            return { data: response.data };
        } else if (userRole === "admin") {
            const response = await api.get('/all_detailed_orders', {
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


export const newOrder = async (
    authToken: string,
    customerId: number,
    userId: number,
    userRole: string,
    total_cost: number,
    cart: { [key: number]: { dish: any; quantity: number } }
): Promise<{
    ok: boolean
}> => {
    if (!authToken || !customerId || !userId) {
        throw new Error('No authToken or user information');
    }

    try {
        // Создаем новый заказ
        const newOrderData = {
            id: 1,
            id_waiter: Math.floor(Math.random() * 3) + 1, // Здесь можно заменить на реальный id официанта
            id_customer: customerId,
            total_cost: total_cost,
            status: 'Pending'
        };

        console.log("newOrderData = ", newOrderData)

        const responseNewOrder = await api.post('/order', newOrderData, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        console.log("response usual new order", responseNewOrder)

        const responseNewOrderData = responseNewOrder.data;

        if (!responseNewOrderData) {
            console.error('Error creating order');
            throw new Error('Failed to create order');
        }

        // console.log("here after !responseNewOrderDaTA")

        // Формируем массив блюд для добавления в orders_dish_cook
        const dishes = Object.values(cart).map(item => ({
            dishId: item.dish.id,
            quantity: item.quantity,
        }));

        // Отправляем данные о каждом блюде по отдельности
        for (const dish of dishes) {
            for (let i = 0; i < dish.quantity; i++) {
                const orderDishCookData = {
                    id_orders: Number(responseNewOrderData.id),
                    id_dish: Number(dish.dishId), // Используем id блюда из cart
                    id_cook: Number(Math.floor(Math.random() * 4) + 1), // Генерируем случайный id повара (пример)
                    status: 'Pending'
                };

                console.log("orderDishCookData = ", orderDishCookData)

                // Отправляем данные о каждом блюде
                const responseDishCook = await api.post('/order_dish_cook', orderDishCookData);

                if (!responseDishCook.data) {
                    console.error('Error adding dish to order:', dish.dishId);
                    throw new Error('Failed to add dish to order');
                }
            }
        }

        return { ok: true };
    } catch (error) {
        console.error('BIG Error creating order:', error);
        throw new Error('BIG Failed to create order');
    }
};

// ------------------------------ ПОКА ЧТО НЕ НУЖНО ---------------------------------------------------

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