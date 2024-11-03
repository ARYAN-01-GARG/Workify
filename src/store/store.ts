import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/AuthSlice';
import verifyReducer from './features/auth/VerifyOTPSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    verifyOTP: verifyReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;