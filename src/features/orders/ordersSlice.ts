import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Order {
    id: string;
    items: string[];
    total: number;
}

interface OrdersState {
    orders: Order[];
}

const initialState: OrdersState = {
    orders: [],
};

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        setOrders(state, action: PayloadAction<Order[]>) {
            state.orders = action.payload;
        },
        addOrder(state, action: PayloadAction<Order>) {
            state.orders.push(action.payload);
        },
        clearOrders(state) {
            state.orders = [];
        },
    },
});

export const { setOrders, addOrder, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
