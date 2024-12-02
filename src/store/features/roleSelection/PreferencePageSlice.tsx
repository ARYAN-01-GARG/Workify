import { createSlice } from '@reduxjs/toolkit';

export interface PreferencePageState {
    isPreferenceOpen: boolean;
    error: string | null;
    location: string;
    domain: string;
}

const initialState: PreferencePageState = {
    isPreferenceOpen: false,
    error: null,
    location: '',
    domain: '',
};

const preferencePageSlice = createSlice({
    name: 'preferencePage',
    initialState,
    reducers: {
        openPreferencePage: (state) => {
            state.isPreferenceOpen = true;
        },
        closePreferencePage: (state) => {
            state.isPreferenceOpen = false;
        },
        setLocation : (state, action) => {
            state.location = action.payload;
        },
        setDomain : (state, action) => {
            state.domain = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const {
    openPreferencePage,
    closePreferencePage,
    setLocation,
    setDomain,
    setError,
} = preferencePageSlice.actions;

export default preferencePageSlice.reducer;