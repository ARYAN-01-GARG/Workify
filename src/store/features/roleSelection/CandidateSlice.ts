import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  candidate: null,
};

const candidateSlice = createSlice({
  name: 'candidate',
  initialState,
  reducers: {
    setCandidate(state, action) {
      state.candidate = action.payload;
    },
  },
});


export default candidateSlice.reducer;
export const { setCandidate } = candidateSlice.actions;