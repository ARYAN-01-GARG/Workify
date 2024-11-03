import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userData : {
    firstName:'',
    lastName:'',
    email: null,
    mobile: null,
    password:'',
    emailVerified: false,
  },
  token : null,
  isAuthenticated: false
};

const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData(state, action){
      state.userData = action.payload;
    },
    setToken(state, action){
      state.token = action.payload;
    },
    setIsAuthenticated(state, action){
      state.isAuthenticated = action.payload;
    },
    verifyOTP(state, action) {
      if (action.payload.isVerified) {
        state.userData = action.payload.userData;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      }
    }
  }
})

export const { setUserData, setToken, setIsAuthenticated, verifyOTP } = UserSlice.actions;

export default UserSlice.reducer;