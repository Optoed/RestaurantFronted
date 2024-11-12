import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import settingsReducer from './features/settings/settingsSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        settings: settingsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
