import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userData : {
    firstName:'',
    lastName:'',
    contact: '',
    emailVerified: false,
  },
  token : '',
  isAuthenticated: false
};



const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    activeUser(state){
      if(localStorage.getItem('userData')) (state.userData = JSON.parse(localStorage.getItem('userData') as string));
      if(localStorage.getItem('token')) (state.token = localStorage.getItem('token') as string);
      if(localStorage.getItem('isAuthenticated')) (state.isAuthenticated = JSON.parse(localStorage.getItem('isAuthenticated') as string));
    },
    setUserData(state, action){
      state.userData = action.payload;
      localStorage.setItem('userData', JSON.stringify(action.payload));
    },
    setToken(state, action){
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    setIsAuthenticated(state, action){
      state.isAuthenticated = action.payload;
      localStorage.setItem('isAuthenticated', action.payload);
    },
  }
})

export const { setUserData, setToken, setIsAuthenticated } = UserSlice.actions;

export default UserSlice.reducer;