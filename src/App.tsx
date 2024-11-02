import { Route, Routes } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import AuthPage from "./pages/auth/AuthPage"
import RegisterPage from "./pages/auth/RegisterPage"
import LoginPage from "./pages/auth/LoginPage"
import ToastProvider from "./components/ToastProvider"
import VerifyOTP from "./pages/auth/VerifyOTP"
import ForgotPassword from "./pages/auth/ForgotPassword"

const App = () => {
  return (
    <>
      <ToastProvider/>
      <Routes>
        {/* Landing page/ not protected  */}
        <Route index element={<LandingPage />} />

        {/* Auth routes  */}
        <Route path="/auth" element={<AuthPage/>}>
          <Route path="verify" element={<VerifyOTP/>} />
          <Route path="register" element={<RegisterPage/>} />
          <Route path="login" element={<LoginPage/>} />
          <Route path="forgot-password" element={<ForgotPassword/>} />
        </Route>

        {/* Protected routes */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </>
  )
}

export default App