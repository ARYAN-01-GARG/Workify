import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/AuthSlice';
import verifyReducer from './features/auth/VerifyOTPSlice';
import userReducer from './features/UserSlice';
import forgotPasswordReducer from './features/auth/ForgotPasswordSlice';
import newPasswordReducer from './features/auth/SetPasswordPageSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    verifyOTP: verifyReducer,
    user: userReducer,
    forgot : forgotPasswordReducer,
    newPassword : newPasswordReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;