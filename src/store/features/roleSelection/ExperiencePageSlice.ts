import { createSlice } from '@reduxjs/toolkit';

export interface ExperiencePageState {
    isExperienceOpen: boolean;
    error: string | null;
    experience: {
        companyName: string;
        yearsWorked: number;
        position: string;
    };
}

const initialState: ExperiencePageState = {
    isExperienceOpen: false,
    error: null,
    experience: {
        companyName: '',
        yearsWorked: 0,
        position: '',
    },
};

const experiencePageSlice = createSlice({
    name: 'experiencePage',
    initialState,
    reducers: {
        openExperiencePage: (state) => {
            state.isExperienceOpen = true;
        },
        closeExperiencePage: (state) => {
            state.isExperienceOpen = false;
        },
        setExperience: (state, action) => {
            state.experience = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const {
    openExperiencePage,
    closeExperiencePage,
    setExperience,
    setError,
} = experiencePageSlice.actions;

export default experiencePageSlice.reducer;