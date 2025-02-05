import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import { InView } from 'react-intersection-observer';
import "./style.css";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { chennaiportfolio, residiantialhouse, highlandhotel } from "../../../assets/constant";
import { PiArrowUpRightBold } from "react-icons/pi";
import { FaExpandArrowsAlt, FaCalendarAlt, FaArrowRight } from "react-icons/fa";
const Portfolio = () => {
  useEffect(() => {
    AOS.init();
  }, [])

  const [triggerCount, setTriggerCount] = useState(false);
  return (
    <div className="custom-container my-15">
      <div className="">
        <div id="portfolio">
          <h2 className="text-xl font-semibold text-[#996830cc] mb-4 mt-28">
            <span className="border-t border-[#996830cc] w-12 inline-block mr-2 mb-1"></span>
            PORTFOLIO
          </h2>
          <h3 className="content text-6xl font-Playfair font-normal max-w-[500px]">
            Some of our crafts made with love
          </h3>
        </div>

        <div className="firstsection  flex mt-16 gap-8 relative" data-aos="fade-left" data-aos-duration="1000">
          {/* Image Section */}
          <div className="">
            <img
              src={chennaiportfolio}
              className="img w-full max-w-[881px] max-h-[572px] rounded-xl "
              alt="Dreams Guest House"
            />
          </div>

          {/* Text Section */}
          <div className="firsttable absolute bg-white border border-[#996833] rounded-2xl p-6 shadow-md max-h-[400px] max-w-[500px] top-40 left-1/2">
            <h2 className="font-semibold text-lg md:text-xl lg:text-2xl text-[#996830] mb-4">
              Dreams Guest House, Chennai
            </h2>

            {/* Info Row */}
            <div className="flex items-center text-[#996830] mb-4 space-x-4 md:space-x-6 lg:space-x-8">
              <div className="flex items-center">
                <FaExpandArrowsAlt className="mr-2 text-sm md:text-base lg:text-lg" />
                <span className="text-sm md:text-base lg:text-lg">4500 Sq.Ft</span>
              </div>
              <div className="flex items-center">
                <FaCalendarAlt className="mr-2 text-sm md:text-base lg:text-lg" />
                <span className="text-sm md:text-base lg:text-lg">2018</span>
              </div>
            </div>

            <p className="text-gray-600 text-xs md:text-sm lg:text-base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Faucibus fringilla dui amet faucibus nam. Erat id
              laoreet posuere etiam morbi.
            </p>
          </div>
        </div>

        <div className="py-4">
          <a href="/contactpage">
            <button className="btn  px-3 py-2 bg-[#996830] text-white rounded-lg flex items-center justify-center gap-2 text-sm w-[160px] h-[56px] drop-shadow-[0_4px_4px_0px(#99683066)]">
              CONTACT US <PiArrowUpRightBold />
            </button>
          </a>
        </div>
        {/* portfolio second section */}
        <div className="secondsection flex mt-16 relative  justify-end" data-aos="fade-right" data-aos-duration="1000">
          {/* Text Section */}
          <div className="secondtable mt-36 bg-white border border-[#996833] rounded-2xl p-6 shadow-md max-h-[400px] max-w-[500px] absolute left-36">
            <h2 className="font-semibold text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#996830] mb-4">
              Highland Hotel, Chennai
            </h2>

            {/* Info Row */}
            <div className="flex items-center text-[#996830] mb-4 space-x-4 sm:space-x-6 md:space-x-8">
              <div className="flex items-center">
                <FaExpandArrowsAlt className="mr-2 text-sm sm:text-base md:text-lg" />
                <span className="text-sm sm:text-base md:text-lg lg:text-xl">4500 Sq.Ft</span>
              </div>
              <div className="flex items-center">
                <FaCalendarAlt className="mr-2 text-sm sm:text-base md:text-lg" />
                <span className="text-sm sm:text-base md:text-lg lg:text-xl">2018</span>
              </div>
            </div>

            <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg max-w-full">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Faucibus fringilla dui amet faucibus nam. Erat id
              laoreet posuere etiam morbi.
            </p>
          </div>

          <div className=" max-h-[572px]">
            <img
              src={highlandhotel}
              className="img max-w-[881px] max-h-[572px] w-full rounded-xl "
              alt="Dreams Guest House"
            />
          </div>
        </div>

        {/* thrid portfolio section */}

        <div className="thirdsection  flex mt-16  gap-8 relative" data-aos="fade-left" data-aos-duration="1000" >
          {/* Image Section  */}
          <div className=" max-w-[881px] max-h-[572px]">
            <img
              src={residiantialhouse}
              className="img w-full rounded-xl  max-w-[881px] max-h-[572px] "
              alt="Dreams Guest House"
            />
          </div>

          {/* Text Section */}
          <div className=" thirdtable absolute bg-white border border-[#996833] rounded-2xl p-6 shadow-md  max-h-[400px] max-w-[500px] top-40 left-1/2">
            <h2 className="font-semibold  text-[#996830] mb-4 text-lg sm:text-xl md:text-2xl ">
              Dreams Guest House, Chennai
            </h2>

            {/* Info Row */}
            <div className="flex items-center text-[#996830] mb-4 space-x-8">
              <div className="flex items-center">
                <FaExpandArrowsAlt className="mr-2" />
                <span className="text-sm sm:text-base md:text-lg">4500 Sq.Ft</span>
              </div>
              <div className="flex items-center">
                <FaCalendarAlt className="mr-2" />
                <span className="text-sm sm:text-base md:text-lg">2018</span>
              </div>
            </div>

            <p className="text-gray-600 text-xs sm:text-sm md:text-base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Faucibus fringilla dui amet faucibus nam. Erat id
              laoreet posuere etiam morbi.
            </p>
          </div>
          <a href="/contactpage">
            <button className="contactbtn absolute bottom-1 right-1 px-4 py-2 bg-[#8b5d33] text-white rounded-lg flex items-center space-x-2 text-sm w-[160px] h-[56px]">
              CONTACT US <FaArrowRight className="ml-2" />
            </button>
          </a>
        </div>

        <div className="comapanypreview my-20 flex justify-between items-center gap-10">
          <div className="ad flex  items-center gap-3">

          <InView
        as="div"
        onChange={(inView) => {
          setTriggerCount(inView);
        }}
      >
        <div className="ads text-6xl font-normal">
          {triggerCount && (
            <CountUp
              start={0}
              end={100}
              duration={3}
              suffix="%"
            />
          )}
          {!triggerCount && "100%"}
        </div>
      </InView>
            <div>
              <h5 className="text-sm font-normal w-44">SATISFITATION CLIENTS</h5>
            </div>
          </div>
          <div className="ad flex items-center gap-3">
          <InView
        as="div"
        onChange={(inView) => {
          setTriggerCount(inView); 
        }}
      >
        <div className="ads text-6xl font-normal">
          {triggerCount && (
            <CountUp
              start={0}
              end={250}
              duration={3}
              suffix=""
            />
          )}
          {!triggerCount && "250"}
        </div>
      </InView>
            <div>
              <h5 className="text-sm font-normal w-48">EMPLOYEES ON WORLDWIDE</h5>
            </div>
          </div>
          <div className="ad flex items-center gap-3">
          <InView
        as="div"
        onChange={(inView) => {
          setTriggerCount(inView); 
        }}
      >
        <div className="ads text-6xl font-normal">
          {triggerCount && (
            <CountUp
              start={0}
              end={3469}
              duration={3}
              suffix=""
            />
          )}
          {!triggerCount && "3469"} 
        </div>
      </InView>
            <div>
              <h5 className="text-sm font-normal w-44">PROJECTS COMPLETED ON 60 COUNTRIES</h5>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t-[1px] border-b-1 border-[#996830] md:my-24 my-20"></div>
    </div>
  );
};

export default Portfolio;
