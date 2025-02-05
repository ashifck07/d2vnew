import React, {useEffect, useState} from "react";
import {Col, Layout, message, Spin} from "antd";
import {Header} from "antd/es/layout/layout";
import {Logo} from "../../assets/constant";
import {leftarrow} from "../../assets/constant";
import {Link, useNavigate} from "react-router-dom";
import apiClient from "../../Utiils/axiosInstance ";
import {useUserContext} from "../../context/UserContext";

const UserLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();
  const [timer, setTimer] = useState(15); // Countdown timer (1 minute)
  const [inputValue, setInputValue] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpExpired, setOtpExpired] = useState(false); // Track OTP expiration

  const [loading, setLoading] = useState(false);
  const {login} = useUserContext();
  useEffect(() => {
    if (isOtpSent && timer > 0 && !otpExpired) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval); // Cleanup interval
    }
  }, [isOtpSent, timer, otpExpired]);

  const handleButtonClick = async () => {
    if (inputValue === "") {
      message.error("Please enter field");
      return;
    }
    if (!isOtpSent) {
      const phn = inputValue;
      try {

        setLoading(true);
        const response = await apiClient.post(`/customer/auth/send-otp`, {phoneNumber: inputValue});
        if (response.status === 200) {
          message.success("OTP Sent");
        }
        setPhoneNumber(phn);
        setInputValue("");
        setIsOtpSent(true);
        setLoading(false);
      } catch (error) {
        console.error("Error sending OTP:", error.response?.data?.message || error.message);
        message.error(`${error.response?.data?.error}`);
      }
    } else {
      try {
        setLoading(true);
        const response = await apiClient.post(`customer/auth/verify-otp`, {phoneNumber: phoneNumber, otp: inputValue});
        if (response.status === 200) {
          message.success("OTP Verify Success");
        }
        setLoading(false);
        login(response.data.token);
        

        navigate(`/userupdate/${response.data.id}`);
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
  const handleBackClick = () => {
    setIsOtpSent(false);
    setTimer(15);
    setInputValue("");
    setOtpExpired(false);
  };
  return (
    <>
      <Layout />
      <Header className=" ant-header flex-row items-center px-10 md:px-20 py-4 ">
  <Col span={10} className="py-2">
    <Link to="/">
      <Logo className="w-28 h-auto sm:w-24 md:w-28 lg:w-32"  /> {/* Adjusted logo size */}
    </Link>
  </Col>
</Header>


      <div
        className={`w-full flex flex-col justify-center items-center bg-cover shadow-2xl h-[90vh]`}
        style={{
          backgroundImage: "url('/loginbackground.png')",
          backgroundPosition: "center",
        }}
      >
        <div className="flex flex-col items-center justify-center py-8 px-4 sm:px-6 md:px-10 w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%]">
          <div className="w-full mb-3 flex justify-start">
            <button
              className="backdrop-blur-md flex items-center text-gray-700 bg-[#FFFFFF99] px-3 py-1.5 rounded-xl font-medium text-sm md:text-base"
              onClick={() => navigate(-1)}
            >
              <img src={leftarrow} alt="Back" className="w-5 sm:w-7 mr-2" />
              Back
            </button>
          </div>
          <div className="bg-[#FFFFFF99] backdrop-blur-xl rounded-2xl shadow-lg py-8 px-6 sm:px-8 md:px-10 w-full">
            {/* Tabs */}
            <div className="flex justify-center pb-4">
              <button
                className={`text-sm sm:text-base md:text-lg font-medium w-[100px] ${
                  isLogin ? "text-black border-b-2 border-black" : "text-gray-500"
                }`}
                onClick={() => {
                  setIsLogin(true);
                  setIsOtpSent(false);
                }}
              >
                Login
              </button>
              {/* Uncomment if Signup Tab is needed */}
              {/* 
              <button
                className={`text-sm sm:text-base md:text-lg font-medium w-[100px] ${
                  !isLogin ? "text-black border-b-2 border-black" : "text-gray-500"
                }`}
                onClick={() => {
                  setIsLogin(false);
                  setIsOtpSent(false);
                }}
              >
                Signup
              </button> */}
            </div>

            {/* Login Form */}
            {isLogin && !isOtpSent && (
              <form className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Enter Phone Number"
                  name="phone"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl outline-none border-[rgb(68_68_68_/_20%)] placeholder-[#44444499] text-sm sm:text-base bg-[#FFFFFF33]"
                />
                <button
                  type="button"
                  // onClick={() => setIsOtpSent(true)}
                  onClick={handleButtonClick}
                  className="w-full bg-[#996830] text-white py-3 rounded-xl font-medium hover:bg-[#7f5526] transition"
                >
                  {loading ? <Spin size="small" /> : "Send OTP"}
                </button>
              </form>
            )}

            {/* OTP Verification Form */}
            {isOtpSent && isLogin && (
              <form className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Enter OTP here"
                  name="otp"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl outline-none border-[rgb(68_68_68_/_20%)] placeholder-[#44444499] text-sm sm:text-base bg-[#FFFFFF33]"
                />
                <button
                  type="button"
                  onClick={handleButtonClick}
                  className="w-full bg-[#996830] text-white py-3 rounded-xl font-medium hover:bg-[#7f5526] transition"
                >
                  {loading ? <Spin size="small" /> : "Login"}
                </button>
                <p className="text-center text-[#996830] underline text-sm mt-2">{`00:${
                  timer < 10 ? `0${timer}` : timer
                }`}</p>
                <p className="text-center text-sm">
                  Didn’t receive OTP?{" "}
                  <button
                    className="text-[#996830] underline"
                    // onClick={(e) => {
                    //   e.preventDefault();
                    //   setIsOtpSent(false);
                    // }}
                    disabled={timer !== 0}
                    onClick={() => {
                      handleBackClick();
                    }}
                  >
                    Resend
                  </button>
                </p>
              </form>
            )}

            {/* Toggle Message */}
            <p className="text-center text-gray-500 text-sm mt-4">
              {isLogin ? (
                <>
                  Don’t have an account?{" "}
                  <button className="text-[#996830] underline" onClick={() => setIsLogin(false)}>
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button className="text-[#996830] underline" onClick={() => setIsLogin(true)}>
                    Login Now
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserLogin;
