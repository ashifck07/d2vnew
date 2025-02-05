import React, {useEffect, useState} from "react";
import {MdOutlineFileDownload} from "react-icons/md";
import {GiQueenCrown} from "react-icons/gi";
import {Spin} from "antd";
import { LuIndianRupee } from "react-icons/lu";

const FInalEstimation = ({data}) => {
  const [estimatedata, setestimateData] = useState(null);
  const [stageName, setStageName] = useState(null);
  useEffect(() => {
    if (data) {
      setestimateData(data);
      setStageName(data.name);
    }
  }, []);


  const MyComponent = ({estimatedata}) => {
    return (
      <div
        className="custom-estimate-card"
        dangerouslySetInnerHTML={{
          __html: estimatedata?.data,
        }}
      />
    );
  };
  return (
    <>
      {estimatedata ? (
        <div className="custom-container">
          <div className="flex  justify-center items-center my-10 gap-10">
            <div className="border-4 border-[#99683033] flex-grow h-full md:py-16 md:px-10 py-8 px-5 w-3/6 max-w-md rounded-lg shadow-lg shadow-white">
              <div className="text-[#444] md:text-[32px] font-[700] text-[18px] md:leading-[72px]  font-Playfair mb-10 flex justify-center items-center">
                <span className=" mr-2">
                  <GiQueenCrown />
                </span>
                <h2 className="font-Playfair">{estimatedata?.selectedDesign?.name.toUpperCase()}</h2>
              </div>
              <div className="text-[#444] ">
                <MyComponent estimatedata={estimatedata?.selectedDesign} type={"premium"} />
              </div>
              <div className="">
                <div className="  md:mb-8 mt-5">
                  <a
                    href={estimatedata?.selectedDesign?.file?.path}
                    className="md:text-[24px] text-[18px] font-[500] leading-[72px] text-[#996830] flex justify-center items-center underline underline-offset-4  hover:underline hover:underline-offset-4   hover:text-[#996830]"
                  >
                    Download Estimate
                    <span className="font-[600] md:text-[30px]  text-[20px] text-[#996830] ml-1">
                      <MdOutlineFileDownload />
                    </span>
                  </a>
                </div>
                <div className="text-center">

                  <h1 className="text-[#444444] font-medium md:text-2xl text-lg leading-8  flex justify-center items-center">
                    Grand Total : 
                    <span className="md:text-xl text-xl flex justify-center items-center"><LuIndianRupee />{estimatedata?.amount}</span>
                  </h1>
                  {/* <button
           className={`md:py-3 md:px-20 px-14 py-2 font-[500] md:text-[20px]  md:leading-[32px] rounded-xl shadow-xl shadow-[#99683066]
             ${selectedType === "luxury" ? "bg-[#996830] text-[#fff] " : "bg-[#9968301A] text-[#996830]"}`}
         >
           <span className="font-[500] md:text-[18px]  text-[14px] md:leading-[32px] font-Outfit">
             {selectedType === "luxury" ? "SELECTED" : "SELECT"}
           </span>
         </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Spin className="custom-spinner" tip="Loading..." />
      )}
    </>
  );
};

export default FInalEstimation;
