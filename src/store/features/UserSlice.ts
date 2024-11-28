import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userData: {
    firstName: '',
    lastName: '',
    contact: '',
    emailVerified: false,
    role : 'USER',
  },
  token: '',
  isAuthenticated: false,
};


const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    activeUser(state) {
      const userData = localStorage.getItem('userData');
      const token = localStorage.getItem('token');
      const isAuthenticated = localStorage.getItem('isAuthenticated');

      if (userData) state.userData = JSON.parse(userData);
      if (token) state.token = token;
      if (isAuthenticated) state.isAuthenticated = JSON.parse(isAuthenticated);
    },
    logout(state) {
      state.userData = {
        firstName: '',
        lastName: '',
        contact: '',
        emailVerified: false,
        role : 'USER',
      };
      state.token = '';
      state.isAuthenticated = false;
      localStorage.removeItem('userData');
      localStorage.removeItem('token');
      localStorage.removeItem('isAuthenticated');
    },
    setUserData(state, action) {
      state.userData = action.payload;
      localStorage.setItem('userData', JSON.stringify(action.payload));
    },
    setToken(state, action) {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    setIsAuthenticated(state, action) {
      state.isAuthenticated = action.payload;
      localStorage.setItem('isAuthenticated', JSON.stringify(action.payload));
    },
  },
});

export const { activeUser, setUserData, setToken, setIsAuthenticated , logout } = UserSlice.actions;

export default UserSlice.reducer;