import Footer from "../components/landingPage/Footer"
import Header from "../components/landingPage/Header"

const Profile = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
          <h1 className="text-6xl font-bold">Profile</h1>
          <p className="text-xl mt-4">Welcome to your profile</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Profile