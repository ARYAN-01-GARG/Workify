import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';

export interface Recruiter {
  firstName : string;
  lastName : string;
  email : string | null;
  phone : string | null;
  companyName: string;
  companyEmail: string;
  jobTitle: string;
  companyWebsite: string;
  industry: string;
  companyLocation: string;
  profileImage: string | null;
}

export interface RecruiterState {
  isRecruiterOpen: boolean;
  isRecruiterJobOpen: boolean;
  isRecruiterLocationOpen : boolean;
  isRecruiterCompanyDetailsOpen : boolean;
  recruiter: Recruiter;
}

const initialState : RecruiterState = {
    isRecruiterOpen: false,
    isRecruiterJobOpen : false,
    isRecruiterLocationOpen : false,
    isRecruiterCompanyDetailsOpen : false,
    recruiter: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      companyName: "",
      companyEmail: "",
      jobTitle: "",
      companyWebsite:"",
      industry: "",
      companyLocation:"",
      profileImage: null
    },
};

export const createRecruiterProfile = createAsyncThunk(
  'recruiter/createRecruiterProfile',
  async (recruiter: Recruiter , { rejectWithValue }) => {
    toast.loading('Creating Recruiter Profile...');
    try {
        const response = await axios.post('https://naitikjain.me/api/recruiter/create',
          {...recruiter }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        toast.dismiss();
        toast.success('Profile created successfully');
        return response.data;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message: string }>;
        toast.dismiss();
        console.log(err)
        toast.error('Profile creation failed');
        return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
)

export const getRecruiterProfile = createAsyncThunk(
  'recruiter/getRecruiterProfile',
  async (_,{dispatch}) => {
    try {
      console.log(localStorage.getItem('token'));
      const response = await axios.get('https://naitikjain.me/api/recruiter/current-recruiter', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      dispatch(setRecruiter(response.data));
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }
)


const recruiterSlice = createSlice({
  name: 'recruiter',
  initialState,
  reducers: {
    openRecruiterJob(state) {
      state.isRecruiterJobOpen = true;
    },
    closeRecruiterJob(state) {
      state.isRecruiterJobOpen = false;
    },
    openRecruiterLocation(state) {
      state.isRecruiterLocationOpen = true
    },
    closeRecruiterLocation(state) {
      state.isRecruiterLocationOpen = false;
    },
    openRecruiterCompany(state) {
      state.isRecruiterCompanyDetailsOpen = true
    },
    closeRecruiterCompany(state) {
      state.isRecruiterCompanyDetailsOpen = false;
    },
    setRecruiter(state, action) {
      state.recruiter = action.payload;
      localStorage.setItem('recruiter', JSON.stringify(action.payload));
    },
    setIsRecruiterOpen(state, action) {
      state.isRecruiterOpen = action.payload;
    },
  },
});

export default recruiterSlice.reducer;
export const { setRecruiter, setIsRecruiterOpen , openRecruiterJob , closeRecruiterJob  ,openRecruiterCompany , openRecruiterLocation ,closeRecruiterCompany ,closeRecruiterLocation} = recruiterSlice.actions;