import { createSlice ,createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface User {
    id: number;
    firstName: string;
    lastName: string | null;
    email: string;
    mobile: string | null;
    status: string | null;
    membership: boolean;
    role: string;
    enabled: boolean;
    authorities: { authority: string }[];
    accountNonExpired: boolean;
    accountNonLocked: boolean;
    credentialsNonExpired: boolean;
}

export interface PostedBy {
    id: number;
    user: User;
    companyEmail: string;
    companyName: string;
    jobTitle: string;
    companyWebsite: string;
    companyLocation: string;
    industry: string;
    profileImage: string | null;
}

export interface JobState {
    id: number;
    title: string;
    description: string;
    company: string;
    location: string;
    experience: number;
    industry: string;
    postedAt: string;
    jobType: string | null;
    mode: string;
    minSalary: number;
    maxSalary: number;
    requiredSkills: string[];
    postedBy: PostedBy;
    jobStatus: string;
}

export interface AllJobsState {
    jobs: JobState[];
}

const initialState: AllJobsState = {
    jobs: []
};

export const getAllJobs = createAsyncThunk(
    'allJobs/getAllJobs',
    async (_,{dispatch}) => {
        try {
            const response = await axios.get('https://naitikjain.me/api/jobs/all-jobs', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            dispatch(setJobs(response.data));
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    }
);

const AllJobSlice = createSlice({
    name: 'allJobs',
    initialState,
    reducers: {
        setJobs: (state, action) => {
            state.jobs = action.payload;
        }
    }
});

export const { setJobs } = AllJobSlice.actions;

export default AllJobSlice.reducer;



// https://naitikjain.me/api/jobs/all-jobs