import { useState } from "react";
import TopCompanyCard from "../../components/company/TopCompanyCard"
import Footer from "../../components/landingPage/Footer"
import Header from "../../components/landingPage/Header"
import CompanyCard from "../../components/company/CompanyCard";
import { SearchInput } from "../../components/Jobs/SearchBar";
import { HiMiniMagnifyingGlassCircle } from "react-icons/hi2";


const CompanyPage = () => {
  const [SearchText , setSearchText] = useState('');
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
          <div className="flex gap-3 mt-10 w-full pb-32 items-start">
            <div className="bg-white p-10 w-full flex-grow max-w-[22vw] rounded-2xl ">
              <SearchInput
                placeholder={'Search a job title'}
                value={SearchText}
                onChange={(e) => setSearchText(e.target.value)}
                Icon={HiMiniMagnifyingGlassCircle}
                size={20}
              />
              <div>
                <h4>Filters</h4>
                <div>
                  <h5>Industry</h5>
                  <input type="checkbox" id="it"/>
                  <label htmlFor="it">IT</label>
                  <input type="checkbox" id="it"/>
                  <label htmlFor="it">IT</label>
                  <input type="checkbox" id="it"/>
                  <label htmlFor="it">IT</label>
                  <input type="checkbox" id="it"/>
                  <label htmlFor="it">IT</label>
                  <input type="checkbox" id="it"/>
                  <label htmlFor="it">IT</label>
                  <input type="checkbox" id="it"/>
                  <label htmlFor="it">IT</label>
                </div>
              </div>
            </div>
            <div>
              <h2 className="font-medium text-xl pb-5">{`Showing ${8780} companies`}</h2>
              <div className="flex justify-evenly items-start gap-5 flex-wrap">
                <CompanyCard />
                <CompanyCard />
                <CompanyCard />
                <CompanyCard />
                <CompanyCard />
                <CompanyCard />
                <CompanyCard />
                <CompanyCard />
                <CompanyCard />
                <CompanyCard />
                <CompanyCard />
                <CompanyCard />
              </div>
            </div>
          </div>
        </main>
        <Footer/>
    </div>
  )
}

export default CompanyPage