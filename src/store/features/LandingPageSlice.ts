import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

export interface LandingPageState {
  count : {
    liveJobCount : number,
    companiesCount : number,
    candidatesCount : number,
    newJobCount : number
  }
}

const initialState = {
  count : {
    liveJobCount : 0,
    companiesCount : 0,
    candidatesCount : 0,
    newJobCount : 0
  }
};

export const getStats = createAsyncThunk(
  'landingPage/getStats',
  async (_, { dispatch }) => {
    try {
      const response = await axios.get('https://naitikjain.me/api/v1/auth/statistics');
      dispatch(setCount({
        liveJobCount : response.data.totalJobs,
        companiesCount : response.data.numberOfRecruiters,
        candidatesCount : response.data.numberOfCandidates,
        newJobCount : response.data.totalJobs
      }));
      return response.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
     console.log(error.message);
    }
  } 
);

const LandingPageSlice = createSlice({
  name: 'landingPage',
  initialState,
  reducers: {
    setCount : (state, action) => {
      state.count = action.payload;
    }
  }
});

export const { setCount } = LandingPageSlice.actions;

export default LandingPageSlice.reducer;