import React from 'react';
import { WaterMark } from '../../../components';

const Footer = () => {
  return (
    <div className="custom-container px-4 sm:px-8 md:px-16 lg:px-32 pb-8 sm:pb-12">
      <div className="border-t-2 border-b-1 border-[#D9D9D6]">
        <div className="flex flex-col md:flex-row justify-between items-start my-8 sm:my-12 md:my-16 space-y-8 md:space-y-0">
          {/* Left Section */}
          <div className="md:max-w-[502px]  md:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-[40px] font-[400] mb-3 leading-tight sm:leading-[48px] md:leading-[56px] font-Playfair text-[#2C2C2C]">
              Kick-start your dream home with us
            </h1>
            <a
              href="mailto:hello@landify.design"
              className="text-[#996830] underline text-lg sm:text-xl md:text-[32px] font-Playfair italic font-[400] leading-6 sm:leading-[40px] md:leading-[48px]"
            >
              Send us a hi
            </a>
          </div>

          {/* Right Section */}
          <div className="space-y-8  md:text-left">
            {/* Address Section */}
            <div className="text-[#2C2C2C]">
              <p className="font-[600] font-Playfair text-lg sm:text-xl md:text-[22px] leading-[28px] sm:leading-[32px] mb-2">
                Brooklyn, New York
              </p>
              <p className="font-[300] text-sm sm:text-base leading-[20px] sm:leading-[24px]">
                962 Fifth Avenue Str, 3rd Floor - Trump
              </p>
              <p className="font-[300] text-sm sm:text-base leading-[20px] sm:leading-[24px]">
                Building NY 10006, United States
              </p>
            </div>

            {/* Email Section */}
            <div>
              <p className="font-[300] text-sm sm:text-base leading-[20px] sm:leading-[24px] text-[#2C2C2C]">
                Email us at
              </p>
              <a
                href="mailto:hello@landify.design"
                className="text-[#996830] font-[400] font-Playfair text-base sm:text-lg md:text-[20px] leading-[24px] md:leading-[28px]"
              >
                hello@landify.design
              </a>
            </div>

            {/* Phone Section */}
            <div>
              <p className="font-[300] text-sm sm:text-base leading-[20px] sm:leading-[24px] text-[#2C2C2C]">
                If you're in a hurry, give us a quick call
              </p>
              <a
                href="tel:+86631250859"
                className="text-[#996830] font-[400] font-Playfair text-base sm:text-lg md:text-[20px] leading-[24px] md:leading-[28px]"
              >
                +8(663)125-08-59
              </a>
            </div>
          </div>
        </div>
      </div>
      <WaterMark/>
    </div>
   
  );
};

export default Footer;
