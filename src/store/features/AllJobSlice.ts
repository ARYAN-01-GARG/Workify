// import { createSlice ,createAsyncThunk } from '@reduxjs/toolkit';

interface User {
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

interface PostedBy {
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

interface JobState {
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

const initialState: JobState = {
    id: 0,
    title: "",
    description: "",
    company: "",
    location: "",
    experience: 0,
    industry: "",
    postedAt: "",
    jobType: null,
    mode: "",
    minSalary: 0,
    maxSalary: 0,
    requiredSkills: [],
    postedBy: {
        id: 0,
        user: {
            id: 0,
            firstName: "",
            lastName: null,
            email: "",
            mobile: null,
            status: null,
            membership: false,
            role: "",
            enabled: false,
            authorities: [],
            accountNonExpired: false,
            accountNonLocked: false,
            credentialsNonExpired: false
        },
        companyEmail: "",
        companyName: "",
        jobTitle: "",
        companyWebsite: "",
        companyLocation: "",
        industry: "",
        profileImage: null
    },
    jobStatus: ""
}

console.log(initialState);