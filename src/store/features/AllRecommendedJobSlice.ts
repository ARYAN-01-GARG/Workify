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

export interface AllRecommendedJobsState {
    jobs: JobState[];
}

const initialState: AllRecommendedJobsState = {
    jobs: []
};

export const getAllRecommendedJobs = createAsyncThunk(
    'allJobs/getAllRecommendedJobs',
    async (_,{dispatch}) => {
        const response = await axios.get('https://naitikjain.me/api/jobs/get-recommended-Jobs' , 
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }
        );
        console.log(response.data);
        dispatch(setAllRecommendedJobs(response.data));
        return response.data;
    }
);

const allRecommendedJobsSlice = createSlice({
    name: 'allRecommendedJobs',
    initialState,
    reducers: {
        setAllRecommendedJobs: (state, action) => {
            state.jobs = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAllRecommendedJobs.fulfilled, (state, action) => {
            state.jobs = action.payload;
        });
    }
});

export const { setAllRecommendedJobs } = allRecommendedJobsSlice.actions;

export default allRecommendedJobsSlice.reducer;