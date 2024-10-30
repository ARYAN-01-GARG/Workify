import { Route, Routes } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import AuthPage from "./pages/Auth/AuthPage"
import RegisterPage from "./pages/Auth/RegisterPage"

const App = () => {
  return (
    <Routes>
      {/* Landing page/ not protected  */}
      <Route index element={<LandingPage />} />

      {/* Auth routes  */}
      <Route path="/auth" element={<AuthPage/>}>
        <Route path="register" element={<RegisterPage/>} />
        <Route path="login" element={<div>Login</div>} />
      </Route>

      {/* Protected routes */}
      {/* <Route path="/dashboard" element={<Dashboard />} /> */}
    </Routes>
  )
}

export default App