import Footer from "../components/landingPage/Footer"
import Header from "../components/landingPage/Header"

const LandingPage = () => {
  return (
    <div className="
        flex flex-col
        relative
        min-h-screen
      bg-[#E7EDF8]
      ">
      <Header />
      <main className="flex-grow">
        <div>Content</div>
      </main>
      <Footer/>
    </div>
  )
}

export default LandingPage