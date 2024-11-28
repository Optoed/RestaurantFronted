import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import profileReducer from './features/profile/profileSlice';
import ordersReducer from './features/orders/ordersSlice';
import uiReducer from './features/ui/uiSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        orders: ordersReducer,
        ui: uiReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
