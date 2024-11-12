// settingsSlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface SettingsState {
    isLoading: boolean;
    error: string | null;
}

const initialState: SettingsState = {
    isLoading: false,
    error: null,
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setLoading(state, action) {
            state.isLoading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
        clearError(state) {
            state.error = null;
        },
    },
});

export const { setLoading, setError, clearError } = settingsSlice.actions;
export default settingsSlice.reducer;

export { };  // This makes sure the file is treated as a module
