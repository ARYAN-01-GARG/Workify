import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/AuthSlice';
import verifyReducer from './features/auth/VerifyOTPSlice';
import userReducer from './features/UserSlice';
import forgotPasswordReducer from './features/auth/ForgotPasswordSlice';
import newPasswordReducer from './features/auth/SetPasswordPageSlice';
import RoleSelectionReducer from './features/roleSelection/RoleSelectionSlice';
import candidateSliceReducer from './features/roleSelection/CandidateSlice';
import recruiterSliceReducer from './features/roleSelection/RecruiterSlice';
import postJobReducer from './PostJobSlice';
import EducationPageSliceReducer from './features/roleSelection/EducationPageSlice';
import preferencePageReducer from './features/roleSelection/PreferencePageSlice';
import experiencePageReducer from './features/roleSelection/ExperiencePageSlice';
import skillsPageReducer from './features/roleSelection/SkillsPageSlice';
import landingPageReducer from './features/LandingPageSlice';
import profileEditReducer from './features/profile/ProfileEditSlice';
import getAllRecommendedJobsReducer from './features/AllRecommendedJobSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    verifyOTP: verifyReducer,
    user: userReducer,
    landingPage : landingPageReducer,
    forgot : forgotPasswordReducer,
    newPassword : newPasswordReducer,
    roleSelection : RoleSelectionReducer,
    candidate: candidateSliceReducer,
    recruiter: recruiterSliceReducer,
    postJob: postJobReducer,
    educationPage : EducationPageSliceReducer,
    preferencePage: preferencePageReducer,
    experiencePage: experiencePageReducer,
    skillsPage : skillsPageReducer,
    profileEdit : profileEditReducer,
    getAllRecommendedJobs: getAllRecommendedJobsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;