import React, {useState} from "react";
import {Col} from "antd";
import {Header} from "antd/es/layout/layout";
import {Logo, designapporavl} from "../../assets/constant";
import {RiUserLine} from "react-icons/ri";
import {FiPhoneCall} from "react-icons/fi";
import {FaBars} from "react-icons/fa6";
import {AiOutlineClose} from "react-icons/ai";
import WaterMark from "../../components/WaterMark";

const DesignApproval = ({type, architect}) => {
  let content;
  if (type === "designapproval") {
    content = " Your approval has been recorded and the estimate will be available here soon.";
  }
  if (type === "images") {
    content = "Images will be available here soon.";
  }
  if (type === "estimate") {
    content = "Your confirmation has been recorded and the project will be initiated soon.";
  }
  if (type === "final") {
    content = "Your Estimate Selection has been recorded and the estimate amount will be available here soon.";
  }
  if (type === "confirmation") {
    content = "Your confirmation has been recorded and the project will be initiated soon.";
  }
  return (
    <>
      <div className="">
        <div className=" relative  md:p-5 md:mb-16 py-8">
          <div className="relative flex items-center justify-center">
            <img src={designapporavl} alt="Got a project" className="shadow-2xl rounded-xl  object-contain " />
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="flex justify-center ">
              <p className=" md:max-w-[545px] max-w-[275px] font-bold font-Playfair text-sm md:text-[32px] text-center md:leading-[55px] text-[#444444] mx-auto my-auto">
                {content}
              </p>
            </div>
            <div className="flex md:mt-12 mt-3 items-center justify-center flex-col">
              <p className="font-[400] md:text-[20px] md:leading-[32px] md:mr-4 text-[#444444] text-[10px]">
                For clarifications and remarks, contact Project Architect at:
              </p>
              <div className="">
                <button className=" mt-3 md:py-2 md:px-4 py-2 px-3  font-[500] md:text-[16px] text-[10px] md:leading-[32px] rounded-md flex justify-center items-center bg-[#996830] text-[#fff]">
                  <span className="font-[500] md:text-[16px] text-[10px] md:leading-[32px] mr-2">
                    <FiPhoneCall />
                  </span>
                  CONTACT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DesignApproval;
