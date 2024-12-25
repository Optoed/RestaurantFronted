// src/features/profile/profileSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProfileState {
    id: number;
    id_customer: number;
    name: string;
    email: string;
    role: string; // User role
}

const initialState: ProfileState = {
    id: 1,
    id_customer: 1,
    name: '',
    email: '',
    role: 'user', // Default role
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfile(state, action: PayloadAction<ProfileState>) {
            // Обновляем все поля профиля
            state.id = action.payload.id;
            state.id_customer = action.payload.id_customer;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.role = action.payload.role;
        },
        clearProfile(state) {
            // Сбрасываем все поля профиля
            state.id = 1;
            state.id_customer = 1;
            state.name = '';
            state.email = '';
            state.role = 'user';
        },
    },
});

export const { setProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;

// Selector
export const selectUser = (state: { profile: ProfileState }) => state.profile;
export const selectUserRole = (state: { profile: ProfileState }) => state.profile.role;