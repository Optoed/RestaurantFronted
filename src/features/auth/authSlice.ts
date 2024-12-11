// src/features/auth/authSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    userToken: string;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    userToken: '',
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthToken(state, action: PayloadAction<string>) {
            state.userToken = action.payload;
            state.isAuthenticated = true;
        },
        clearAuthToken(state) {
            state.userToken = '';
            state.isAuthenticated = false;
        },
    },
});

export const { setAuthToken, clearAuthToken } = authSlice.actions;
export default authSlice.reducer;

// Selector
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthToken = (state: { auth: AuthState }) => state.auth.userToken;