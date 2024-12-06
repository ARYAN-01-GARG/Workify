import { FaArrowRight } from "react-icons/fa6"
import FooterComponents from "./FooterComponents"

const Footer = () => {
  const footerLinks = [
    {
      title: "Quick Link",
      links: [
        "About",
        "Contact",
        "Pricing",
        "Blog"
      ],
    },
    {
      title: "Candidate",
      links: [
        "Browse Jobs",
        "Browse Employers",
        "Candidate Dashboard",
        "Saved Jobs"
      ],
    },
    {
      title: "Employers",
      links: [
        "Post a Job",
        "Browse Candidates",
        "Employers Dashboard",
        "Applications",
      ],
    },
    {
      title: "Support",
      links: [
        "Faqs",
        "Privacy Policy",
        "Terms & Conditions",
      ],
    },
  ]
  return (
    <div className="bg-[#18191C] text-white hidden lg:block">
      <div className="px-[3.125rem] py-[5.3rem] flex justify-between items-center">
        <div className="flex gap-4 flex-grow flex-col items-start ">
          <img src="/footerLogo.svg" alt="Logo" />
          <p className="text-[#888888] text-lg font-medium">Call now: <span className="text-[#ffffff]">+91 5555544444</span></p>
          <p className="text-sm font-medium text-[#888888] max-w-[350px] pr-10">123,Workify Hub, Connaught Place, New Delhi, 110001-India</p>
        </div>
        <div className="flex justify-between w-[70%] gap-3">
          {footerLinks.map((footerLink, index) => (
            <div key={index} className="w-[200px] font-medium flex flex-col gap-5">
              <h6 className="text-xl">{footerLink.title}</h6>
              <ul className="flex flex-col flex-start">
                {footerLink.links.map((link, index) => (
                  <li key={index} className="pb-2 text-[#888888] text-[1.05rem] flex gap-3 items-center group hover:text-[#ffffff] hover:pl-3 hover:scale-110 transition duration-300 cursor-pointer text-wrap"><FaArrowRight size={20} className="group-hover:block hidden"/><span>{link}</span></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <FooterComponents/>
    </div>
  )
}

export default Footer