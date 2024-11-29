import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';

export interface RoleSelectionState {
    isOpen : boolean;
    role: string | null;
    skip : boolean;
    recruiter : {
        jobTitle : string;
        companyName : string;
        location : string;
        jobType : string;
        companyEmail : string;
        companyWebsite : string;
        jobDescription: string;
        jobRequirements: string;
    };
    candidate : {
        email : string;
        location : string;
        experience : string;
        education : string;
        course : string;
        careerInterests : string;
        companyName : string;
        currentJobTitle : string;
        skills : string[];
        isResumeUploaded : boolean;
        resumeFileName: string | null;
    };
}

const initialState:RoleSelectionState = {
    isOpen : false,
    role: null,
    skip : false,
    recruiter : {
        jobTitle : '',
        companyName : '',
        location : '',
        jobType : '',
        companyEmail : '',
        companyWebsite : '',
        jobDescription: '',
        jobRequirements: '',
    },
    candidate : {
        email : '',
        location : '',
        experience : '',
        education : '',
        course : '',
        careerInterests : '',
        companyName : '',
        currentJobTitle : '',
        skills : [],
        isResumeUploaded : false,
        resumeFileName: null,
    }
};


export const createCandidate = createAsyncThunk(
    'roleSelection/createCandidate',
    async ({ candidate, token }: { candidate: RoleSelectionState['candidate'], token: string }, { rejectWithValue }) => {
        toast.loading('Creating candidate...');
        try {
            const response = await axios.post('https://naitikjain.me/api/candidates/create', {
                educations: [
                    { institution: candidate.education, degree: candidate.course, yearOfCompletion: 2023 },
                ],
                experiences: [
                    { companyName: candidate.companyName, yearsWorked: 1, position: candidate.currentJobTitle }
                ],
                skill: [...candidate.skills],
                DOB: '2003-10-14'
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.dismiss();
            toast.success('Candidate created successfully!');
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            toast.dismiss();
            console.log(err)
            toast.error('Candidate creation failed');
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

export const uploadResume = createAsyncThunk(
    'roleSelection/uploadResume',
    async ({ resume, token }: { resume: File | null, token: string }, { rejectWithValue }) => {
        if (!resume) {
            toast.error('No resume file selected');
            return rejectWithValue('No resume file selected');
        }
        toast.loading('Uploading resume...');
        try {
            const formData = new FormData();
            formData.append('Resume', resume);
            const response = await axios.post('https://naitikjain.me/api/candidates/resume', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            toast.dismiss();
            toast.success('Resume uploaded successfully!');
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            toast.dismiss();
            toast.error(error.response?.data?.message || 'Resume upload failed');
            return rejectWithValue(error.response?.data?.message || 'Resume upload failed');
        }
    }
);

const roleSelectionSlice = createSlice({
  name: 'roleSelection',
  initialState,
  reducers: {
    setRole(state, action) {
      state.role = action.payload;
    },
    setSkip(state, action) {
      state.skip = action.payload;
    },
    setRecruiter(state, action) {
      state.recruiter = {
        ...state.recruiter,
        ...action.payload
      };
    },
    setCandidate(state, action) {
      localStorage.setItem('localCandidate',JSON.stringify(action.payload))
      state.candidate = {
        ...state.candidate,
        ...action.payload,
        resumeFileName: action.payload.resumeFileName || state.candidate.resumeFileName
      };
    },
    setResumeUploaded(state, action) {
      state.candidate.isResumeUploaded = action.payload;
    },
    setIsOpen(state, action) {
      state.isOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCandidate.fulfilled, (state) => {
        state.candidate = initialState.candidate;
      })
      .addCase(createCandidate.rejected, (state) => {
        state.candidate = initialState.candidate;
      })
      .addCase(createCandidate.pending, (state) => {
        state.candidate = initialState.candidate;
      })
      .addCase(uploadResume.fulfilled, (state) => {
        state.candidate = initialState.candidate;
      })
      .addCase(uploadResume.rejected, (state) => {
        state.candidate = initialState.candidate;
      })
      .addCase(uploadResume.pending, (state) => {
        state.candidate = initialState.candidate;
      });


  }
});

// {
//     "educations":[{"institution":"AKGEC",
//     "degree":"Btech.(CSE)",
//     "yearOfCompletion":2023},
//     {"institution":"IMS",
//     "degree":"MBA",
//     "yearOfCompletion":2025}],
//     "experiences":[{"companyName":"Google",
//     "yearsWorked":2,
//     "position":"SDE1"}],
//     "skill":["java","SpringBoot"],
//     "DOB":"2005-10-20"
// }

export default roleSelectionSlice.reducer;
export const { setRole, setIsOpen, setRecruiter, setCandidate } = roleSelectionSlice.actions;