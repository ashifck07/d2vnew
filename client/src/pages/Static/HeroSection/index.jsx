import React from "react";
import {herobackground} from "../../../assets/constant";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section
      className="  relative bg-cover  h-[600px] text-white"
      style={{
        backgroundImage: `url(${herobackground})`,
        backgroundSize: "cover",
        backgroundPosition: "top",
        
      }}
    >
      <div className=" absolute top-60 flex flex-col  bg-black bg-opacity-40 w-full  p-6 ">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-Playfair ml-6 py-3 max-w-xl max-sm:ml-0 max-sm:text-left">
            We help to bring your dream home to reality
          </h1>
        </div>
      </div>
      <button
        className=" absolute  left-20   top-[430px]  max-sm:left-4 max-sm:right-4 max-sm:w-[calc(250px)]
    max-sm:text-base
    max-sm:py-2
    max-sm:top-[430px]
    mt-4 
    rounded-md 
    bg-[#996830] 
    px-6 
    py-3 
    text-lg 
    text-white 
    transition 
    duration-300 
    hover:bg-[#6a4c29]
   
  "      onClick={() => navigate("/liveestimation")}

      >
        GET LIVE ESTIMATION
      </button>
    </section>
  );
};

export default HeroSection;
