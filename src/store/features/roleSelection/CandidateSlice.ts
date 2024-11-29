import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

export interface Candidate {
  firstName: string;
  lastName: string;
  email: string;
  phone: number | null;
  education: {
    id: number;
    institution: string;
    degree: string;
    yearOfCompletion: number;
  }[];
  experience: {
    id: number;
    companyName: string;
    yearsWorked: string;
    position: string;
  }[];
  skill: string[];
  certificate: string[];
  resumeKey: string | null;
  profileImageKey: string | null;
  dob: string | null;
}

const initialState = {
    isCandidateOpen: false,
    candidate: {
      firstName: '',
      lastName: '',
      email: '',
      phone: null,
      education : [
        {
          id : 0,
          institution : '',
          degree : '',
          yearOfCompletion : 2023
        }
      ],
      experience : [
        {
          id : 0,
          companyName : '',
          yearsWorked : '',
          position : ''
        }
      ],
      skill : [],
      certificate : [],
      resumeKey : null,
      profileImageKey : null,
      dob : null,
    },
};

export const getCandidate = createAsyncThunk(
    'roleSelection/getCandidate',
    async ({ token }: { token: string }, { rejectWithValue , dispatch}) => {
        try {
            const response = await axios.get('https://naitikjain.me/api/candidates/get-current', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            dispatch(setCandidate(response.data));
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            console.log(err);
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch candidate details');
        }
    }
);

const candidateSlice = createSlice({
  name: 'candidate',
  initialState,
  reducers: {
    setCandidate(state, action) {
      state.candidate = action.payload;
      localStorage.setItem('candidate', JSON.stringify(action.payload));
    },
    setIsCandidateOpen(state, action) {
      state.isCandidateOpen = action.payload;
    },
  },
});


export default candidateSlice.reducer;
export const { setCandidate, setIsCandidateOpen } = candidateSlice.actions;