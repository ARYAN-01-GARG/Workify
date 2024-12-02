import { createSlice } from '@reduxjs/toolkit';

export interface SkillsPageState {
    isSkillsOpen: boolean;
    error: string;
    skills: string[];
}

const initialState: SkillsPageState = {
    isSkillsOpen: false,
    error: '',
    skills: [],
};

const skillsPageSlice = createSlice({
    name: 'skillsPage',
    initialState,
    reducers: {
        openSkillsPage: (state) => {
            state.isSkillsOpen = true;
        },
        closeSkillsPage: (state) => {
            state.isSkillsOpen = false;
        },
        setSkills: (state, action) => {
            state.skills = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const {
    openSkillsPage,
    closeSkillsPage,
    setSkills,
    setError,
} = skillsPageSlice.actions;

export default skillsPageSlice.reducer;