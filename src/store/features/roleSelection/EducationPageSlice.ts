import { createSlice } from '@reduxjs/toolkit';

export interface EducationState {
    isEducationOpen: boolean;
    education: {
        institution: string;
        degree: string;
        yearOfCompletion: number;
    };
    error: string | null;
}

const initialState: EducationState = {
    isEducationOpen: false,
    education: {
        institution: '',
        degree: '',
        yearOfCompletion: 2023,
    },
    error: null,
};

const educationPageSlice = createSlice({
    name: 'educationPage',
    initialState,
    reducers: {
        openEducationPage: (state) => {
            state.isEducationOpen = true;
        },
        closeEducationPage: (state) => {
            state.isEducationOpen = false;
        },
        setEducation: (state, action) => {
            state.education = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const {
    openEducationPage,
    closeEducationPage,
    setEducation,
    setError,
} = educationPageSlice.actions;

export default educationPageSlice.reducer;