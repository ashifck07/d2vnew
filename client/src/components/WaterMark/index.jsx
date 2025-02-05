import React from "react";
import {FaRegCopyright} from "react-icons/fa6";
import {FaFacebook, FaYoutube, FaInstagram, FaTwitter} from "react-icons/fa";

const WaterMark = () => {
  return (
    <>
      <div className="">
        <div className="border-t-2 border-b-1 border-[#D9D9D6]"></div>
        <div className="flex justify-between md:flex-row flex-col items-center md:my-14 my-10">
          <div className="flex justify-center items-center md:leading-5 mb-5">
            <FaRegCopyright className="text-[#444] font-light text-base" />
            <p className="text-[#444] font-light text-xs md:text-base ml-2  ">
              2022 Inteo - Award winning studio. Made with love by <span className="text-[#996830]">Landify</span>
            </p>
          </div>
          <div className="flex justify-center items-center text-[#444]">
            <p className="font-semibold md:text-sm text-[12px] md:leading-5 flex items-center justify-center">
              CONNECT
              <span className="border-t border-[#444] md:w-16 w-10 inline-block md:mx-5 mx-2 mb-1"></span>
            </p>
            <div className="flex md:gap-5 gap-3 text-[#996830]">
              <FaInstagram className="border border-[#E6D8CC] rounded-full md:w-9 w-6 md:h-9 h-6 md:p-2 p-1" />
              <FaFacebook className="border border-[#E6D8CC] rounded-full md:w-9 w-6 md:h-9 h-6 md:p-2 p-1" />
              <FaYoutube className="border border-[#E6D8CC] rounded-full md:w-9 w-6 md:h-9 h-6 md:p-2 p-1" />
              <FaTwitter className="border border-[#E6D8CC] rounded-full md:w-9 w-6 md:h-9 h-6 md:p-2 p-1" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WaterMark;
