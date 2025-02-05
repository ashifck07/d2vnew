import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {Logo} from "../../../src/assets/constant";
import {IoArrowBack} from "react-icons/io5";
import apiClient from "../../Utiils/axiosInstance ";
import {message, Spin} from "antd";
import {useUserContext} from "../../context/UserContext";

const ArchitectPortal = ({portalType}) => {
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [timer, setTimer] = useState(15); 
  const [inputValue, setInputValue] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpExpired, setOtpExpired] = useState(false); // Track OTP expiration
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {login} = useUserContext();
  const heading = portalType === "master" ? "Master's Portal" : "Architect's Portal";
  const route = portalType === "master" ? "user" : "architect";

  // Handle countdown timer
  useEffect(() => {
    if (isOtpStep && timer > 0 && !otpExpired) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval); // Cleanup interval
    }
  }, [isOtpStep, timer, otpExpired]);

  // Handle back button click
  const handleBackClick = () => {
    setIsOtpStep(false);
    setTimer(15);
    setInputValue("");
    setOtpExpired(false);
  };
  // const handleResentOTP = () => {
  //   const phone = phoneNumber;
  //   setIsOtpStep(false);
  //   setInputValue(...phone);
  //   handleButtonClick();
  // };
  // Handle Send OTP / Verify OTP button click
  const handleButtonClick = async () => {
    if (inputValue === "") {
      message.error("Please enter field");
      return;
    }
    if (!isOtpStep) {
      // Send OTP logic
      const phn = inputValue;
      try {
        console.log("ugujyguy", isOtpStep);

        setLoading(true);
        const response = await apiClient.post(`/${route}/auth/send-otp`, {phoneNumber: inputValue});
        if (response.status === 200) {
          message.success("OTP Sent");
        }
        setPhoneNumber(phn);
        setInputValue("");
        setIsOtpStep(true);
        setLoading(false);
      } catch (error) {
        console.error("Error sending OTP:", error.response?.data?.message || error.message);
        message.error(`${error.response?.data?.error}`);
      } finally {
        setLoading(false);
      }
    } else {
      // OTP verification logic
      try {
        setLoading(true);
        const response = await apiClient.post(`${route}/auth/verify-otp`, {phoneNumber: phoneNumber, otp: inputValue});
        if (response.status === 200) {
          message.success("OTP Verify Success");
        }
        setLoading(false);
        login(response.data.token); // Save JWT after successful login
        navigate("/pannel");
      } catch (error) {
        console.error("Error verifying OTP:", error.response?.data?.message || error.message);
        if (error.response?.data?.message === "OTP has expired") {
          setOtpExpired(true);
          message.error("OTP has expired. Please request a new one.");
        } else {
          message.error("Invalid OTP or OTP expired");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="custom-container">
      <div className="p-2 py-5">
        <Logo className="w-28 h-auto sm:w-24 md:w-28 lg:w-32" />
      </div>
      <div className="flex flex-col md:gap-10 mb-10">
        <div className="flex items-center mt-16 justify-center">
          <h1 className="md:text-4xl text-2xl font-semibold text-[rgba(153,104,48,0.6)] text-center">{heading}</h1>
        </div>
        <div className={`flex justify-center text-center mt-6 m-auto  ${isOtpStep ? "w-80" : ""}`}>
          <div className="flex w-full justify-start">
            {isOtpStep && (
              <button onClick={handleBackClick} className="text-black text-[24px] ">
                <IoArrowBack />
              </button>
            )}
            <h2 className="text-[rgba(68,68,68,1)] md:text-2xl text-xl font-bold ml-0 flex-1 ">SIGN IN</h2>
          </div>
        </div>
        <div className="flex flex-col items-center md:mt-10 mt-10">
          <input
            type="text"
            placeholder={isOtpStep ? "Enter OTP here" : "Enter mobile number here"}
            name={isOtpStep ? "otp" : "phone"}
            value={inputValue}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleButtonClick(); // Call your function here
              }
            }}
            onChange={(e) => setInputValue(e.target.value)}
            className="px-8 py-3 md:text-base text-sm md:w-80  font-light rounded-xl border placeholder-[rgba(196,163,134,1)]  outline-none focus:ring-1 focus:ring-[#996833] custom-portal-input"
          />
          <button
            onClick={handleButtonClick}
            className="md:mt-10 mt-5 bg-[#996833] hover:bg-[#854E1F] text-white md:text-base text-sm font-semibold    py-2 px-10 rounded-xl "
          >
            {loading ? <Spin size="small" className="button-spinner" /> : isOtpStep ? "Login" : "Send OTP"}
          </button>
          {isOtpStep && !otpExpired && (
            <div className="mt-4 text-center text-gray-500">
              <p className="text-sm">{`00:${timer < 10 ? `0${timer}` : timer}`}</p>
              <p className="text-sm mt-2">
                Didn't receive OTP?{" "}
                <button
                  onClick={() => {
                    handleBackClick();
                  }}
                  disabled={timer !== 0}
                  className="text-[#996833] underline"
                >
                  Resend
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArchitectPortal;
