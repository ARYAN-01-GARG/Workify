import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { JobState } from "../AllRecommendedJobSlice";

export interface AllAppliedJobsState {
    jobs: JobState[];
    isloading: boolean;
}

const initialState : AllAppliedJobsState = {
    isloading: false,
    jobs: [],
};

export const applyJob = createAsyncThunk(
  "applyJob/applyJobFunc",
  async (id : number) => {
    toast.loading("Applying for job");
    try {
      const response = await axios.post(`https://naitikjain.me/api/jobs/apply/applications/${id}`,
        id,
        {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.dismiss();
      toast.success("Applied for job");
      return response.data;
    } catch (err : unknown) {
        toast.dismiss();
        toast.error("Failed to apply for job");
        const error = err as AxiosError;
        console.error(error.message);
      return error.response ? error.response.data : error.message;
    }
  }
);

const ApplyJobSlice = createSlice({
    name: 'applyJob',
    initialState,
    reducers: {
        setAppliedJobs: (state, action) => {
            state.jobs = action.payload;
        }
    },
    extraReducers: (builder) => {
      builder
        .addCase(applyJob.pending, (state) => {
          state.isloading = true;
        })
        .addCase(applyJob.fulfilled, (state, action) => {
          state.isloading = false;
          state.jobs = action.payload;
        })
        .addCase(applyJob.rejected, (state) => {
          state.isloading = false;
        });
    }
});

export default ApplyJobSlice.reducer;

export const { setAppliedJobs } = ApplyJobSlice.actions;