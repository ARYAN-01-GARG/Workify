import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

interface JobState {
  title: string;
  description: string;
  location: string;
  experience: number;
  jobType: string;
  mode: string;
  minSalary: number;
  maxSalary: number;
  employmentType: string;
  requiredSkills: string[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: JobState = {
  title: "Software Engineer",
  description: "Responsible for developing and maintaining web applications.",
  location: "Bangalore, India",
  experience: 1,
  jobType: "PART_TIME",
  mode: "ONLINE",
  minSalary: 500000,
  maxSalary: 1000000,
  employmentType: "Full-Time",
  requiredSkills: [],
  status: 'idle',
  error: null
};

export const postJob = createAsyncThunk('job/postJob', async (jobData: JobState, { rejectWithValue }) => {
  try {
    toast.loading("Posting job...");
    const { title, description, location, experience, jobType, mode, minSalary, maxSalary, employmentType, requiredSkills } = jobData;
    const token = localStorage.getItem('authToken');
    const response = await axios.post('https://naitikjain.me/api/jobs/post', {
      title,
      description,
      location,
      experience,
      jobType,
      mode,
      minSalary,
      maxSalary,
      employmentType,
      requiredSkills
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    toast.dismiss();
    toast.success("Job posted successfully!");
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    toast.dismiss();
    toast.error("Failed to post job.");
    return rejectWithValue(error?.response?.data?.message);
  }
});

const postJobSlice = createSlice({
  name: 'postJob',
  initialState,
  reducers: {
    updateJobField: (state, action: PayloadAction<{ field: keyof JobState; value: string | number | string[] | null }>) => {
      const { field, value } = action.payload;
      if (field in state) {
        (state[field] as typeof value) = value;
      }
    },
    addSkill: (state, action: PayloadAction<string>) => {
      state.requiredSkills.push(action.payload);
    },
    removeSkill: (state, action: PayloadAction<string>) => {
      state.requiredSkills = state.requiredSkills.filter(skill => skill !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(postJob.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(postJob.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(postJob.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  }
});

export const { updateJobField, addSkill, removeSkill } = postJobSlice.actions;

export default postJobSlice.reducer;
