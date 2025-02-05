// import React, {useEffect, useRef, useState} from "react";
// import {Button, Col, message, Spin} from "antd";
// import {Header} from "antd/es/layout/layout";
// import {Logo} from "../../assets/constant";
// import {RiUserLine} from "react-icons/ri";
// import {MdOutlineFileDownload} from "react-icons/md";
// import {GiQueenCrown} from "react-icons/gi";
// import {FiPhoneCall} from "react-icons/fi";
// import {FaBars} from "react-icons/fa6";
// import {AiOutlineClose} from "react-icons/ai";
// import WaterMark from "../../components/WaterMark";
// import {useUserContext} from "../../context/UserContext";
// import apiClient from "../../Utiils/axiosInstance ";

// const EstimateSelection = ({data, selectedType, setSelectedType}) => {
//   const [otpRequeted, setOtpRequested] = useState(false);
//   const [isChecked, setIsChecked] = useState(false); // Track if checkbox is checked
//   const [estimatedata, setestimateData] = useState(null);
//   const [stageName, setStageName] = useState(null);
//   const {user} = useUserContext();
//   const [otpValue, setOtpValue] = useState(null);

//   const premiumRef = useRef(null);
//   const luxuryRef = useRef(null);
//   useEffect(() => {
//     if (data) {
//       setestimateData(data);
//       setStageName(data.name);
//     }
//   }, []);

//   const handleSelect = (type) => {
//     setSelectedType(type);
//   };

//   const handleCheckboxChange = (e) => {
//     setIsChecked(e.target.checked);
//   };
//   useEffect(() => {
//     if (premiumRef.current && luxuryRef.current) {
//       const premiumHeight = premiumRef.current.offsetHeight;
//       const luxuryHeight = luxuryRef.current.offsetHeight;
//       const maxHeight = Math.max(premiumHeight, luxuryHeight);
//       premiumRef.current.style.height = `${maxHeight}px`;
//       luxuryRef.current.style.height = `${maxHeight}px`;
//     }
//   }, [estimatedata]);

//   const handleSubmit = async (req, res) => {
//     if (!isChecked) {
//       message.error("Please confirm the design policy by checking the box.");
//       return;
//     }
//     try {
//       let response;
//       const payload = {stageName: stageName};

//       if (otpRequeted) {
//         // If OTP is already requested, send the OTP for verification
//         payload.otp = otpValue;
//         response = await apiClient.post(`customer/approval/${user.id}`, payload);

//         if (response.status === 200) {
//           message.success("Estimate selection submitted successfully");
//           setOtpRequested(false); // Reset OTP request state after successful verification
//           fetch();
//         }
//       } else {
//         // If OTP is not requested, request OTP first
//         response = await apiClient.post(`customer/approval/${user.id}`, payload);

//         if (response.status === 200) {
//           message.success("OTP sent successfully");
//           setOtpRequested(true); // Set OTP request state
//         }
//       }
//     } catch (error) {
//       console.error("Error:", error.response?.data?.message || error.message);
//       message.error(error.response?.data?.error || "An error occurred");
//     }
//   };
//   const MyComponent = ({estimatedata, type}) => {
//     if (type === "luxury")
//       return (
//         <div
//           className="custom-estimate-card"
//           dangerouslySetInnerHTML={{
//             __html: estimatedata.luxury.data,
//           }}
//         />
//       );
//     else
//       return (
//         <div
//           className="custom-estimate-card"
//           dangerouslySetInnerHTML={{
//             __html: estimatedata.premium.data,
//           }}
//         />
//       );
//   };
//   return (
//     <>
//       {estimatedata ? (
//         <>
//           {" "}
//           <div className="custom-container">
//             <div  ref={premiumRef} className="flex md:flex-row items-stretch flex-col justify-center  min-h-dvh gap-10">
//               <div className="border-4 border-[#99683033] flex-grow h-full md:py-16 md:px-10 py-8 px-5 w-3/6 max-w-md rounded-lg shadow-lg shadow-white">
//                 <h2 className="text-[#444] md:text-[32px] font-[700] text-[18px] md:leading-[72px] text-center font-Playfair mb-10">
//                   Premium
//                 </h2>
//                 <div className="text-[#444]  ">
//                   <MyComponent estimatedata={estimatedata} type={"luxury"} />
//                 </div>
//                 <div className=" flex justify-center items-center md:mb-10">
//                   <h3 className="md:text-[24px] text-[18px] font-[500] leading-[72px] underline underline-offset-4 text-[#996830] ">
//                     Download Estimate
//                   </h3>
//                   <span className="font-[600] md:text-[30px]  text-[20px] text-[#996830] ml-1">
//                     <MdOutlineFileDownload />
//                   </span>
//                 </div>
//                 <div className="text-center">
//                   <button
//                     onClick={() => {
//                       handleSelect("premium");
//                     }}
//                     className={`md:py-3 md:px-20 px-14 py-2 font-[500] md:text-[20px]  md:leading-[32px] rounded-xl shadow-xl shadow-[#99683066]
//                   ${selectedType === "premium" ? "bg-[#996830] text-[#fff] " : "bg-[#9968301A] text-[#996830]"}`}
//                   >
//                     <span className="font-[500] md:text-[18px]  text-[14px] md:leading-[32px] font-Outfit">
//                       {selectedType === "premium" ? "SELECTED" : "SELECT"}
//                     </span>
//                   </button>
//                 </div>
//               </div>

//               <div   ref={luxuryRef} className="border-4 border-[#99683033] flex-grow h-full md:py-16 md:px-10 py-8 px-5 w-3/6 max-w-md rounded-lg shadow-lg shadow-white">
//                 <div className="text-[#444] md:text-[32px] font-[700] text-[18px] md:leading-[72px]  font-Playfair mb-10 flex justify-center items-center">
//                   <span className=" mr-2">
//                     <GiQueenCrown />
//                   </span>
//                   <h2 className="font-Playfair">Luxury</h2>
//                 </div>
//                 <div className="text-[#444] ">
//                   <MyComponent estimatedata={estimatedata} type={"premium"} />
//                 </div>
//                 <div className="">
//                   <div className=" flex justify-center items-center md:mb-10">
//                     <h3 className="md:text-[24px] text-[18px] font-[500] leading-[72px] underline underline-offset-4 text-[#996830] ">
//                       Download Estimate
//                     </h3>
//                     <span className="font-[600] md:text-[30px]  text-[20px] text-[#996830] ml-1">
//                       <MdOutlineFileDownload />
//                     </span>
//                   </div>
//                   <div className="text-center">
//                     <button
//                       onClick={() => handleSelect("luxury")}
//                       className={`md:py-3 md:px-20 px-14 py-2 font-[500] md:text-[20px]  md:leading-[32px] rounded-xl shadow-xl shadow-[#99683066]
//             ${selectedType === "luxury" ? "bg-[#996830] text-[#fff] " : "bg-[#9968301A] text-[#996830]"}`}
//                     >
//                       <span className="font-[500] md:text-[18px]  text-[14px] md:leading-[32px] font-Outfit">
//                         {selectedType === "luxury" ? "SELECTED" : "SELECT"}
//                       </span>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* <div className="flex flex-col justify-center items-center mb-10">
//               <div className="flex  justify-center items-center gap-2 my-8 text-[#444]">
//                 <input type="checkbox" className="md:w-5 md:h-5 w-6 h-6" onChange={handleCheckboxChange} />
//                 <h1 className="font-[400] text-[15px] md:text-[20px] md:leading-[32px] ml-2">
//                   Approved the <span className="underline underline-offset-4">design policy </span> and proceed to
//                   estimation
//                 </h1>
//               </div>
//               {!otpRequeted ? (
//                 <>
//                   <Button
//                     type="primary"
//                     className="primary-btn-active btn-contact md:py-8 md:px-20 py-6 px-8 font-[500] text-[20px] md:leading-[32px] rounded-md"
//                     onClick={handleSubmit}
//                   >
//                     <span className="font-[500] md:text-[18px] text-[14px] md:leading-[32px] font-Outfit">
//                       CONFIRM ESTIMATE & SEND OTP
//                     </span>
//                   </Button>
//                   <p className="text-[#C8C8C8] font-[500] md:text-[20px] text-[12px] md:leading-[32px] mt-6">
//                     OTP will be sent to your registered mobile number
//                   </p>
//                 </>
//               ) : (
//                 <div className="">
//                   <div className="flex flex-col md:flex-row items-center justify-center gap-4 ">
//                     <h2 className="font-[400] md:text-[22px] text-[14px] md:leading-[32px] text-[#444] ">Enter OTP</h2>
//                     <input
//                       type="text"
//                       name="otp"
//                       onChange={(e) => setOtpValue(e.target.value)}
//                       className="border border-[#99683099]  md:text-[17px] text-[13px] w-36 h-10 md:w-44 md:h-14   rounded-xl shadow-xl focus-visible:outline-none focus-visible:border-[#996380]"
//                     />
//                     <Button
//                       onClick={handleSubmit}
//                       className="primary-btn-active btn-contact md:py-7 md:px-18 py-5 px-12 font-[500] text-[20px] leading-[32px] rounded-xl shadow-xl shadow-[#99683066] "
//                     >
//                       <span className="font-[500] md:text-[20px] text-[12px] md:leading-[32px] font-Outfit">
//                         SUBMIT
//                       </span>
//                     </Button>
//                   </div>

//                   <div className="flex flex-col items-center justify-center">
//                     <p className="text-[#996830] underline decoration-1 underline-offset-2 mt-5">00:06</p>

//                     <p className=" text-[#444444] mt-7">
//                       Didn’t receive OTP?{" "}
//                       <button className="text-[#996830] underline decoration-1 underline-offset-2 font-[500] text-[16px] leading-[32px] ml-3">
//                         Resend
//                       </button>
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div> */}
//           </div>
//           <div className="flex md:flex-row flex-col  items-center justify-center ">
//             <p className="font-[400] md:text-[20px] text-[10px] md:leading-[32px] md:mr-4 text-[#444444]">
//               For clarifications and remarks, contact Project Architect at:
//             </p>
//             <Button className="font-[500] md:text-[16px] text-[12px] md:leading-[32px] rounded-md bg-[#ffff] text-[#996830] border-0">
//               <span className="">
//                 <FiPhoneCall />
//               </span>
//               <span className="underline underline-offset-4 font-Outfit">CONTACT</span>
//             </Button>
//           </div>
//         </>
//       ) : (
//         <Spin></Spin>
//       )}
//     </>
//   );
// };

// export default EstimateSelection;
import React, { useEffect, useRef, useState } from "react";
import { Button, Col, message, Spin } from "antd";
import { Header } from "antd/es/layout/layout";
import { Logo } from "../../assets/constant";
import { RiUserLine } from "react-icons/ri";
import { MdOutlineFileDownload } from "react-icons/md";
import { GiQueenCrown } from "react-icons/gi";
import { FiPhoneCall } from "react-icons/fi";
import { FaBars } from "react-icons/fa6";
import { AiOutlineClose } from "react-icons/ai";
import WaterMark from "../../components/WaterMark";
import { useUserContext } from "../../context/UserContext";
import apiClient from "../../Utiils/axiosInstance ";

const EstimateSelection = ({ data, selectedType, setSelectedType }) => {
  const [otpRequeted, setOtpRequested] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [estimatedata, setestimateData] = useState(null);
  const [stageName, setStageName] = useState(null);
  const { user } = useUserContext();
  const [otpValue, setOtpValue] = useState(null);

  const premiumRef = useRef(null);
  const luxuryRef = useRef(null);

  useEffect(() => {
    if (data) {
      setestimateData(data);
      setStageName(data.name);
    }
  }, [data]);

  useEffect(() => {
    if (premiumRef.current && luxuryRef.current) {
      const premiumHeight = premiumRef.current.offsetHeight;
      const luxuryHeight = luxuryRef.current.offsetHeight;
      const maxHeight = Math.max(premiumHeight, luxuryHeight);
      premiumRef.current.style.height = `${maxHeight}px`;
      luxuryRef.current.style.height = `${maxHeight}px`;
    }
  }, [estimatedata]);

  const handleSelect = (type) => {
    setSelectedType(type);
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleSubmit = async () => {
    if (!isChecked) {
      message.error("Please confirm the design policy by checking the box.");
      return;
    }
    try {
      let response;
      const payload = { stageName };

      if (otpRequeted) {
        payload.otp = otpValue;
        response = await apiClient.post(`customer/approval/${user.id}`, payload);

        if (response.status === 200) {
          message.success("Estimate selection submitted successfully");
          setOtpRequested(false);
          fetch();
        }
      } else {
        response = await apiClient.post(`customer/approval/${user.id}`, payload);

        if (response.status === 200) {
          message.success("OTP sent successfully");
          setOtpRequested(true);
        }
      }
    } catch (error) {
      console.error("Error:", error.response?.data?.message || error.message);
      message.error(error.response?.data?.error || "An error occurred");
    }
  };

  const MyComponent = ({ estimatedata, type }) => (
    <div
      className="custom-estimate-card"
      dangerouslySetInnerHTML={{
        __html: type === "luxury" ? estimatedata.luxury.data : estimatedata.premium.data,
      }}
    />
  );

  return (
    <>
      {estimatedata ? (
        <>
          <div className="custom-container">
            <div className="flex flex-col md:flex-row items-stretch justify-center min-h-dvh gap-10">
              <div
                ref={premiumRef}
                className="border-4 border-[#99683033] flex-grow h-full py-8 px-8 w-full md:w-3/6 rounded-lg shadow-lg shadow-white"
              >
                <h2 className="text-[#444] text-[18px] md:text-[32px] font-[700] leading-[72px] text-center font-Playfair mb-10">
                  Premium
                </h2>
                <div className="text-[#444]">
                  <MyComponent estimatedata={estimatedata} type={"premium"} />
                </div>
                <div className="flex justify-center items-center md:mb-8 mt-5">
                  {/* <h3 className="text-[18px] md:text-[24px] font-[500] leading-[72px] underline underline-offset-4 text-[#996830]">
                    Download Estimate
                  </h3> */}
                   <a
                      href={estimatedata?.premium?.file?.path}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="md:text-[20px] text-[16px] font-[500] leading-[72px] underline underline-offset-4 hover:underline hover:underline-offset-4  text-[#996830] hover:text-[#996830]"
                    >
                      Download Estimate
                    </a>
                  <span className="font-[600] text-[20px] md:text-[30px] text-[#996830] ml-1">
                    <MdOutlineFileDownload />
                  </span>
                </div>
                <div className="text-center">
                  <button
                    onClick={() => handleSelect("premium")}
                    className={`py-2 md:py-3 px-14 md:px-20 font-[500] text-[14px] md:text-[20px] leading-[32px] rounded-xl shadow-xl shadow-[#99683066] ${selectedType === "premium" ? "bg-[#996830] text-[#fff]" : "bg-[#9968301A] text-[#996830]"
                      }`}
                  >
                    <span className="font-Outfit">
                      {selectedType === "premium" ? "SELECTED" : "SELECT"}
                    </span>
                  </button>
                </div>
              </div>

              <div
                ref={luxuryRef}
                className="border-4 border-[#99683033] flex-grow h-full py-8 px-8 w-full md:w-3/6 rounded-lg shadow-lg shadow-white"
              >
                <div className="text-[#444] text-[18px] md:text-[32px] font-[700] leading-[72px] font-Playfair mb-10 flex justify-center items-center">
                  <span className="mr-2">
                    <GiQueenCrown />
                  </span>
                  <h2 className="text-[#444] text-[18px] md:text-[32px] font-[700] leading-[72px] text-center font-Playfair ">Luxury</h2>
                </div>
                <div className="text-[#444]">
                  <MyComponent estimatedata={estimatedata} type={"luxury"} />
                </div>

                <div className="">
                  <div className=" flex justify-center items-center md:mb-8 mt-5">
                    {/* <h3 className="md:text-[24px] text-[18px] font-[500] leading-[72px] underline underline-offset-4 text-[#996830] ">
                      Download Estimate
                    </h3> */}
                    <a
                      href={estimatedata?.luxury?.file?.path}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="md:text-[20px] text-[16px] font-[500] leading-[72px] underline underline-offset-4  hover:underline hover:underline-offset-4  text-[#996830] hover:text-[#996830]"
                    >
                      Download Estimate
                    </a>
                    <span className="font-[600] md:text-[30px]  text-[20px] text-[#996830] ml-1">
                      <MdOutlineFileDownload />
                    </span>
                  </div>
                  <div className="text-center">
                    <button
                      onClick={() => handleSelect("luxury")}
                      className={`md:py-3 md:px-20 px-14 py-2 font-[500] md:text-[20px]  md:leading-[32px] rounded-xl shadow-xl shadow-[#99683066]
                       ${selectedType === "luxury" ? "bg-[#996830] text-[#fff] " : "bg-[#9968301A] text-[#996830]"}`}
                    >
                      <span className="font-[500] md:text-[18px]  text-[14px] md:leading-[32px] font-Outfit">
                        {selectedType === "luxury" ? "SELECTED" : "SELECT"}
                      </span>
                    </button>
                  </div>
                </div>
                {/* <div className="text-center">
                  <button
                    onClick={() => handleSelect("luxury")}
                    className={`py-2 md:py-3 px-14 md:px-20 font-[500] text-[14px] md:text-[20px] leading-[32px] rounded-xl shadow-xl shadow-[#99683066] ${selectedType === "luxury" ? "bg-[#996830] text-[#fff]" : "bg-[#9968301A] text-[#996830]"
                      }`}
                  >
                    <span className="font-Outfit">
                      {selectedType === "luxury" ? "SELECTED" : "SELECT"}
                    </span>
                  </button>
                </div> */}
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center mt-10">
            <p className="font-[400] text-[10px] md:text-[20px] leading-[32px] text-[#444444] mb-4 md:mb-0 md:mr-4">
              For clarifications and remarks, contact Project Architect at:
            </p>
            <Button className="font-[500] text-[12px] md:text-[16px] leading-[32px] rounded-md bg-[#ffff] text-[#996830] border-0">
              <span>
                <FiPhoneCall />
              </span>
              <span className="underline underline-offset-4 font-Outfit ml-1">CONTACT</span>
            </Button>
          </div>
        </>
      ) : (
        <Spin />
      )}
    </>
  );
};

export default EstimateSelection;