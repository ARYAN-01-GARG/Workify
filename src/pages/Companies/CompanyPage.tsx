import { useState } from "react";
import TopCompanyCard from "../../components/company/TopCompanyCard"
import Footer from "../../components/landingPage/Footer"
import Header from "../../components/landingPage/Header"


const CompanyPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const CompaniesCount = [
    {title : 'Unicorns' , count : 100},
    {title : 'MNCs' , count : 900},
    {title : 'StartUps' , count : 300},
    {title : 'QuantCompanies' , count : 50},
    {title : 'Product Based' , count : 200},
    {title : 'Product Based' , count : 200}
  ];

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? CompaniesCount.length - 5 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === CompaniesCount.length - 5 ? 0 : prevIndex + 1));
  };

  return (
    <div className="min-h-screen w-full bg-[#E6ECF8] flex flex-col">
        <Header/>
        <main className="flex-grow px-14 py-2">
          <h1 className="font-semibold text-[1.6rem] py-4">Top companies hiring now</h1>
          <div className="relative bg-[#D1D1D1] rounded-2xl w-full p-7 flex gap-8 justify-center overflow-hidden">
              {CompaniesCount.slice(currentIndex, currentIndex + 5).map((company, index) => (
                <TopCompanyCard key={index} title={company.title} count={company.count}/>
              ))}
            <img src="/public/images/sideNavigationLeft.svg" alt="Previous" className="absolute top-[35%] left-1 scale-90 hover:scale-100 cursor-pointer" onClick={handlePrev}/>
            <img src="/public/images/sideNavigationRight.svg" alt="Next" className="absolute top-[35%] right-1 scale-90 hover:scale-100 cursor-pointer" onClick={handleNext}/>
          </div>
          <div className="flex">
            <div>

            </div>
            <div>
            </div>
          </div>
        </main>
        <Footer/>
    </div>
  )
}

export default CompanyPage