import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { AllJobsState } from "../AllJobSlice";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { JobState, setAllRecommendedJobs } from "../AllRecommendedJobSlice";

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
  async (id : string , { dispatch }) => {
    toast.loading("Applying for job");
    const jobs = useSelector((state: { jobs: AllJobsState }) => state.jobs.jobs);
    try {
      const response = await axios.post(`https://naitikjain.me/api/jobs/apply/applications/${id}`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.dismiss();
      toast.success("Applied for job");
      dispatch(setAllRecommendedJobs([...jobs.filter((job) => job.id.toString() !== id)]));
      dispatch(setAppliedJobs(response.data));
      return response.data;
    } catch (err : unknown) {
        toast.dismiss();
        toast.error("Failed to apply for job");
        const error = err as AxiosError;
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
    }
});

export default ApplyJobSlice.reducer;

export const { setAppliedJobs } = ApplyJobSlice.actions;