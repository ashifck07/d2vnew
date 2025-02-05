import React, {useEffect, useState} from "react";
import ImageView from "../ImageView";
import {Button, message, Steps} from "antd";
import WaterMark from "../WaterMark";
import apiClient from "../../Utiils/axiosInstance ";
import DesignApproval from "../DesignApproval";
import FinalEstimation from "../FinalEstimation";
import EstimateSelection from "../EstimateSelection";
import {FiPhoneCall} from "react-icons/fi";
import {useNavigate} from "react-router-dom";
import {useUserContext} from "../../context/UserContext";

const DesignStages = ({data}) => {
  const [current, setCurrent] = useState(0);
  const [currentStage, setCurrentStage] = useState("");
  const [loading, setloading] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [clientData, setClientData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [otpRequeted, setOtpRequested] = useState(false);
  const [isChecked, setIsChecked] = useState(false); // Track if checkbox is checked
  const [currentStageData, setCurrentStageData] = useState("");
  const [currentStageKey, setCurrentStageKey] = useState("");
  const [otpValue, setOtpValue] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const {user} = useUserContext();
  const navigate = useNavigate();
  useEffect(() => {
    if (data) {
      setClientData(data);
    }
    // if (clientData) {
    //   const stagesArray = Object.keys(clientData?.stages)
    //     .sort()
    //     .map((key) => clientData.stages[key]);

    //   // Find the last enabled stage index
    //   const lastEnabledIndex = stagesArray.reduce((lastIndex, stage, index) => {
    //     return stage.enabled ? index : lastIndex;
    //   }, 0);

    //   setCurrent(lastEnabledIndex);
    //   setCurrentStage(stagesArray[lastEnabledIndex]?.name || "");
    //   setCurrentImages(stagesArray[lastEnabledIndex]?.images || []);
    //   setCurrentStageData(stagesArray[lastEnabledIndex]);
    // }
    if (clientData) {
      const stagesObject = clientData?.stages || {}; // Ensure stages exist
      const stageKeys = Object.keys(stagesObject).sort(); // Get sorted stage keys

      let lastEnabledIndex = 0;
      let lastEnabledKey = ""; // Store the key of the last enabled stage

      const stagesArray = stageKeys.map((key, index) => {
        const stage = stagesObject[key];
        if (stage.enabled) {
          lastEnabledIndex = index;
          lastEnabledKey = key; // Store the key of the enabled stage
        }
        return {...stage, key}; // Store the stage data along with its key
      });

      setCurrent(lastEnabledIndex);
      setCurrentStage(stagesArray[lastEnabledIndex]?.name || "");
      setCurrentImages(stagesArray[lastEnabledIndex]?.images || []);
      setCurrentStageData(stagesArray[lastEnabledIndex]);
      setCurrentStageKey(lastEnabledKey); // Store the key separately
    }
  }, [clientData]);

  const stagesArray = clientData?.stages
    ? Object.keys(clientData.stages)
        .sort()
        .map((key) => clientData.stages[key])
    : [];

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleSubmit = async () => {
    if (!isChecked) {
      message.error("Please confirm the design policy by checking the box.");
      return;
    }

    try {
      setloading(true);
      let response;
      let payload;
      if (currentStage === "Final Design") {
        payload = {stageName: currentStageKey};
      } else if (currentStage === "Premium/Luxury") {
        if (selectedType === "") {
          message.error("Please select a type");
          return;
        }
        payload = {stageName: currentStageKey, selection: selectedType};
      } else if (currentStage === "Final Estimation") {
        payload = {stageName: currentStageKey};
      }
      if (otpRequeted) {
        // If OTP is already requested, send the OTP for verification
        payload.otp = otpValue;
        response = await apiClient.post(`customer/approval/${clientData.id}`, payload);

        if (response.status === 200) {
          message.success("Design approval submitted successfully");
          setOtpRequested(false); // Reset OTP request state after successful verification
          navigate(`/userupdate/${user.id}`);
          window.location.reload();
        }
      } else {
        // If OTP is not requested, request OTP first
        response = await apiClient.post(`customer/approval/${clientData.id}`, payload);

        if (response.status === 200) {
          message.success("OTP sent successfully");
          setOtpRequested(true); // Set OTP request state
        }
      }
    } catch (error) {
      console.error("Error:", error.response?.data?.message || error.message);
      message.error(error.response?.data?.error || "An error occurred");
    } finally {
      setloading(false);
    }
  };

  return (
    <>
      <div className="custom-container min-h-[90dvh] flex flex-col justify-between">
        <div className="pt-3 md:pt-12 pb-3">
          <h2 className="md:text-[24px] text-[16px] font-[600] text-[#996830cc] sm:ml-16 md:leading-[20px] tracking-widest">
            <span className="border-t-2 border-[#996830cc] w-14 inline-block mr-2 mb-1.5"></span>
            {currentStage === "Premium/Luxury" && currentStageData?.loading ? "Design Approved" : currentStage}
          </h2>
        </div>
        <div className="flex flex-col gap-5 md:gap-10 md:p-10 ">
          {clientData && (
            <>
              {["Basic Design", "Mood Board", "Final Design"].includes(currentStage) && (
                <>
                  {currentImages.length !== 0 ? <ImageView data={currentImages} /> : <DesignApproval type={"images"} />}
                </>
              )}

              {currentStage === "Premium/Luxury" &&
                (currentStageData?.loading ? (
                  <DesignApproval type={"designapproval"} />
                ) : (
                  <EstimateSelection
                    data={currentStageData}
                    selectedType={selectedType}
                    setSelectedType={setSelectedType}
                  />
                ))}
              {currentStage === "Final Estimation" &&
                (currentStageData?.loading ? (
                  <DesignApproval type={"final"} />
                ) : (
                  <FinalEstimation data={currentStageData} />
                ))}
              {currentStage === "Estimation Confirmed" && <DesignApproval type={"confirmation"} />}

              {/* otp verification section */}
              <div className="text-center">
                {["Premium/Luxury", "Final Design", "Final Estimation"].includes(currentStage) &&
                  !currentStageData.loading && (
                    <>
                      {" "}
                      <div className="flex flex-col justify-center items-center mb-10">
                        <div className="flex  justify-center md:items-center md:gap-2 md:my-8 text-[#444]">
                          <input type="checkbox" className="md:w-5 md:h-5 w-6 h-6" onChange={handleCheckboxChange} />
                          <h1 className="font-[400] text-[15px] md:text-[20px] md:leading-[32px] md:ml-2">
                            Approved the <span className="underline underline-offset-4">design policy </span> and
                            proceed to estimation
                          </h1>
                        </div>
                      </div>
                      {!otpRequeted ? (
                        <>
                          <Button
                            type="primary"
                            loading={loading}
                            className="primary-btn-active btn-contact md:py-8 md:px-20 py-6 px-8 font-[500] text-[20px] md:leading-[32px] rounded-md"
                            onClick={handleSubmit}
                          >
                            <span className="font-[500] md:text-[18px] text-[14px] md:leading-[32px] font-Outfit">
                              CONFIRM DESIGN & SEND OTP
                            </span>
                          </Button>
                          <p className="text-[#C8C8C8] font-[500] md:text-[20px] text-[12px] md:leading-[32px] mt-6">
                            OTP will be sent to your registered mobile number
                          </p>
                        </>
                      ) : (
                        <div className="">
                          <div className="flex flex-col md:flex-row items-center justify-center gap-4 ">
                            <h2 className="font-[400] md:text-[22px] text-[14px] md:leading-[32px] text-[#444] ">
                              Enter OTP
                            </h2>
                            <input
                              type="text"
                              name="otp"
                              onChange={(e) => setOtpValue(e.target.value)}
                              placeholder=""
                              className="border border-[#99683099]  md:text-[17px] text-[13px] w-36 h-10 md:w-44 md:h-14 px-2   rounded-xl shadow-xl focus-visible:outline-none focus-visible:border-[#996380]"
                            />
                            <Button
                              onClick={handleSubmit}
                              loading={loading}
                              className="primary-btn-active btn-contact md:py-7 md:px-18 py-5 px-12 font-[500] text-[20px] leading-[32px] rounded-xl shadow-xl shadow-[#99683066] "
                            >
                              <span className="font-[500] md:text-[20px] text-[12px] md:leading-[32px] font-Outfit">
                                SUBMIT
                              </span>
                            </Button>
                          </div>

                          <div className="flex flex-col items-center justify-center">
                            <p className="text-[#996830] underline decoration-1 underline-offset-2 mt-5">00:06</p>

                            <p className=" text-[#444444] mt-7">
                              Didn’t receive OTP?{" "}
                              <button className="text-[#996830] underline decoration-1 underline-offset-2 font-[500] text-[16px] leading-[32px] ml-3">
                                Resend
                              </button>
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex md:flex-row flex-col  items-center justify-center ">
                        <p className="font-[400] md:text-[20px] text-[10px] md:leading-[32px] md:mr-4 text-[#444444]">
                          For clarifications and remarks, contact Project Architect at:
                        </p>
                        <Button className="font-[500] md:text-[16px] text-[12px] md:leading-[32px] rounded-md bg-[#ffff] text-[#996830] border-0">
                          <span className="">
                            <FiPhoneCall />
                          </span>
                          <span className="underline underline-offset-4 font-Outfit">CONTACT</span>
                        </Button>
                      </div>
                    </>
                  )}
              </div>
            </>
          )}
        </div>
        <WaterMark />
      </div>
    </>
  );
};

export default DesignStages;
