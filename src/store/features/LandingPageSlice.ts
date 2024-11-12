import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  count : 0,
};

const LandingPageSlice = createSlice({
  name: 'landingPage',
  initialState,
  reducers: {
    increment(state){
      state.count += 1;
    },
    decrement(state){
      state.count -= 1;
    },
  },
});

export const { increment, decrement } = LandingPageSlice.actions;

export default LandingPageSlice.reducer;