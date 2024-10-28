import { Outlet } from "react-router-dom"

const AuthPage = () => {
  return (
    <div>
        <div>
            authimage
        </div>
        <div>
            <Outlet/>
        </div>
    </div>
  )
}

export default AuthPage