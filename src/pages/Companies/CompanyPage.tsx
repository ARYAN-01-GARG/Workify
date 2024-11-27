import Companies from "../../components/Companies"
import Footer from "../../components/landingPage/Footer"
import Header from "../../components/landingPage/Header"


const CompanyPage = () => {
  return (
    <div className="min-h-screen w-full bg-[#E6ECF8] flex flex-col">
        <Header/>
        <main className="flex-grow">
            <Companies/>
        </main>
        <Footer/>
    </div>
  )
}

export default CompanyPage