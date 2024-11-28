import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/auth/AuthPage";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import ToastProvider from "./components/ToastProvider";
import VerifyOTP from "./pages/auth/VerifyOTP";
import ForgotPassword from "./pages/auth/ForgotPassword";
import SetPasswordPage from "./pages/auth/SetPasswordPage";
import Dashboard from "./pages/Home/Dashboard";
import { AppDispatch } from "./store/store";
import { activeUser } from "./store/features/UserSlice";
import { UserState } from "./store/features/auth/UserState";
import HomePage from "./pages/Home/HomePage";
import JobsPage from "./pages/JobsPage";
import CompanyPage from "./pages/Companies/CompanyPage";
import LayoutForcandidate from "./pages/LayoutForCandidate";
import LayoutForRecruiter from "./pages/LayoutForRecruiter";
import PostJob from "./pages/Home/PostJob";
import JobDetailsPage from "./components/Jobs/JobDetailsPage";
import CompanyDetailsPage from "./pages/Companies/CompanyDetailsPage";

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const role = useSelector((state: { user : UserState}) => state.user.userData.role);
  const isAuthenticated = useSelector((state: { user : UserState}) => state.user.isAuthenticated);


  useEffect(() => {
    dispatch(activeUser());
  }, [dispatch]);

  return (
    <>
      <ToastProvider />
      <Routes>
        {/* Landing page not protected  */}
        {(role ==='USER' || !isAuthenticated) &&
        <Route path="/" element={<LandingPage />}>
          <Route path="dashboard" element={<Navigate to="/"/>} />
        </Route>}

        {/* Auth routes  */}
        <Route path="/auth" element={<AuthPage />}>
          <Route path="verify" element={<VerifyOTP />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="new-password" element={<SetPasswordPage />} />
        </Route>

        {/* Protected routes */}
        {(role === 'candidate' && isAuthenticated) &&
          <>
            <Route path='/' element={<LayoutForcandidate />}>
              <Route index element={<HomePage />} />
              <Route path="dashboard" element={<Dashboard />} />
            </Route>
            <Route path="jobs" element={<JobsPage />}/>
            <Route path="jobs/:id" element={<JobDetailsPage />} />
            <Route path="companies" element={<CompanyPage />}/>
            <Route path="companies/:id" element={<CompanyDetailsPage />}/>
          </>
        }

        {(role === 'recruiter' && isAuthenticated) &&
          <>
            <Route path='/' element={<LayoutForRecruiter />}/>
            <Route path='/post-a-job' element={<PostJob />} />
            <Route path="dashboard" element={<Dashboard />} />
          </>
        }

        
      </Routes>
    </>
  );
};

export default App;