import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
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
import Layout from "./pages/Home/Layout";
import HomePage from "./pages/Home/HomePage";
import AllRoutesWithOutLogin from "./pages/AllRoutesWithOutLogin";

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
        {/* Landing page/ not protected  */}
        {(role ==='') && <Route index element={<LandingPage />} />}
        {(role ==='') && <Route path="*" element={<AllRoutesWithOutLogin/>} />}

        {/* Auth routes  */}
        <Route path="/auth" element={<AuthPage />}>
          <Route path="verify" element={<VerifyOTP />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="new-password" element={<SetPasswordPage />} />
        </Route>

        {/* Protected routes */}
        {(role !== '' && isAuthenticated) &&
          <Route path='/' element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>}

      </Routes>
    </>
  );
};

export default App;