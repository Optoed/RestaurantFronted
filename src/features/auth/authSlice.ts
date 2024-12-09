// src/features/auth/authSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    token: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthToken(state, action: PayloadAction<string>) {
            state.token = action.payload;
            state.isAuthenticated = true;
        },
        clearAuthToken(state) {
            state.token = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setAuthToken, clearAuthToken } = authSlice.actions;
export default authSlice.reducer;

// Selector
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthToken = (state: { auth: AuthState }) => state.auth.token;