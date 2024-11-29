import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';

export interface Candidate {
  firstName: string;
  lastName: string;
  email: string;
  phone: number | null;
  education: {
    institution: string;
    degree: string;
    yearOfCompletion: number;
  }[];
  experiences: {
    companyName: string;
    yearsWorked: number;
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
          institution : '',
          degree : '',
          yearOfCompletion : 2023
        }
      ],
      experiences : [
        {
          companyName : '',
          yearsWorked : 0,
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

export const uploadProfilePic = createAsyncThunk(
    'roleSelection/uploadProfilePic',
    async ({ token, profileImageKey }: { token: string, profileImageKey: string }, { rejectWithValue }) => {
      const formData = new FormData();
      const blob = await fetch(profileImageKey).then(res => res.blob());
      formData.append('image', blob, 'profile.jpg');
      toast.loading('Uploading profile picture...');
      try {
            await axios.post('https://naitikjain.me/api/candidates/Profile-picture', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.dismiss();
            toast.success('Profile picture uploaded successfully');
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            toast.dismiss();
            console.log(err);
            toast.error('Failed to upload profile picture');
            return rejectWithValue(error.response?.data?.message || 'Failed to upload profile picture');
        }
    }
)

export const uploadResume = createAsyncThunk(
    'roleSelection/uploadResume',
    async ({ token, resumeFile }: { token: string, resumeFile: File }, { rejectWithValue, dispatch }) => {
      const formData = new FormData();
      formData.append('Resume', resumeFile, resumeFile.name);
      try {
            toast.loading('Uploading resume...');
            await axios.post('https://naitikjain.me/api/candidates/resume', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.dismiss();
            toast.success('Resume uploaded successfully');
            dispatch(getCandidate({ token }));
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            toast.dismiss();
            console.log(err);
            toast.error(error.response?.data?.message || 'Failed to upload resume');
            return rejectWithValue(error.response?.data?.message || 'Failed to upload resume');
        }
    }
)

export const updateCandidate = createAsyncThunk(
    'roleSelection/updateCandidate',
    async ({ token, candidateData }: { token: string, candidateData: Candidate }, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.put('https://naitikjain.me/api/candidates/update', {
                education: [{
                  institution: candidateData.education[0].institution,
                  degree: candidateData.education[0].degree,
                  yearOfCompletion: candidateData.education[0].yearOfCompletion
                }],
                experiences: candidateData.experiences,
                skill: candidateData.skill
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            dispatch(setCandidate(response.data));
            toast.success('Profile updated successfully');
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            console.log(err);
            toast.error('Failed to update profile');
            return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
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