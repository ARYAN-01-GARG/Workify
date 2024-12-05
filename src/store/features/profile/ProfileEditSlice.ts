import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    editPageOpen : false,
    candidate: {
        firstName: '',
        lastName: '',
        email: '',
        phone: null,
        education: [
        {
            institution: '',
            degree: '',
            yearOfCompletion: 2023,
        },
        ],
        experiences: [
        {
            companyName: '',
            yearsWorked: 0,
            position: '',
        },
        ],
        skill: [],
        certificate: [],
        resumeKey: null,
        profileImageKey: null,
        domain: '',
        location: '',
        dob: null,
    },
    error: null,
};

const ProfileEditSlice = createSlice({
    name: 'profileEdit',
    initialState,
    reducers: {
        openEditPage: (state) => {
            state.editPageOpen = true;
        },
        closeEditPage: (state) => {
            state.editPageOpen = false;
        },
        updateCandidate: (state, action) => {
            state.candidate = action.payload;
        },
        updateError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { openEditPage, closeEditPage, updateCandidate, updateError } = ProfileEditSlice.actions;
export default ProfileEditSlice.reducer;