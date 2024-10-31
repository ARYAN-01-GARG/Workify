import { Link } from "react-router-dom"

const LandingPage = () => {
  return (
    <div>
      landing page
      <Link to="/auth/register">Sign Up</Link>
    </div>
  )
}

export default LandingPage