import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    isCandidateOpen: false,
    candidate: null,
};

const candidateSlice = createSlice({
  name: 'candidate',
  initialState,
  reducers: {
    setCandidate(state, action) {
      state.candidate = action.payload;
    },
    setIsCandidateOpen(state, action) {
      state.isCandidateOpen = action.payload;
    },
  },
});


export default candidateSlice.reducer;
export const { setCandidate, setIsCandidateOpen } = candidateSlice.actions;