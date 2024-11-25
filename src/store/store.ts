import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/AuthSlice';
import verifyReducer from './features/auth/VerifyOTPSlice';
import userReducer from './features/UserSlice';
import forgotPasswordReducer from './features/auth/ForgotPasswordSlice';
import newPasswordReducer from './features/auth/SetPasswordPageSlice';
import RoleSelectionReducer from './features/roleSelection/RoleSelectionSlice';
import candidateSliceReducer from './features/roleSelection/CandidateSlice';
import recruiterSliceReducer from './features/roleSelection/RecruiterSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    verifyOTP: verifyReducer,
    user: userReducer,
    forgot : forgotPasswordReducer,
    newPassword : newPasswordReducer,
    roleSelection : RoleSelectionReducer,
    candidate: candidateSliceReducer,
    recruiter: recruiterSliceReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;