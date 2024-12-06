import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa6"

const FooterComponents = () => {
  return (
    <div className="border-t border-[#888888]/30 text-[#888888] px-[3.125rem] py-6 text-sm font-medium flex justify-between items-center">
      <p>@ 2024 Workify - Job Portal. All rights Reserved</p>
      <div className="text-[#888888] flex gap-5 items-center">
        <FaFacebookF size={22} className="hover:opacity-50 cursor-pointer"/>
        <FaYoutube size={22} className="hover:opacity-50 cursor-pointer"/>
        <FaInstagram size={22} className="hover:opacity-50 cursor-pointer"/>
        <FaTwitter size={22} className="hover:opacity-50 cursor-pointer"/>
      </div>
    </div>
  )
}

export default FooterComponents