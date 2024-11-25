import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isRecruiterOpen: false,
    recruiter: null,
};

const recruiterSlice = createSlice({
  name: 'recruiter',
  initialState,
  reducers: {
    setRecruiter(state, action) {
      state.recruiter = action.payload;
    },
    setIsRecruiterOpen(state, action) {
      state.isRecruiterOpen = action.payload;
    },
  },
});

export default recruiterSlice.reducer;
export const { setRecruiter, setIsRecruiterOpen } = recruiterSlice.actions;