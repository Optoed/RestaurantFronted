// src/features/profile/profileSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProfileState {
    name: string;
    email: string;
    role: string; // User role
}

const initialState: ProfileState = {
    name: '',
    email: '',
    role: 'user', // Default role
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfile(state, action: PayloadAction<ProfileState>) {
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.role = action.payload.role;
        },
        clearProfile(state) {
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