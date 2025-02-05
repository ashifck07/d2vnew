import { Col } from 'antd';
import { Header } from 'antd/es/layout/layout';
import React from 'react';
import { Logo } from '../../assets/constant';
import { leftarrow } from '../../assets/constant';
import { Link } from 'react-router-dom';

const Contactus = () => {
    return (
        <>
          <Header className=" ant-header flex-row items-center px-10 md:px-20  " >
          
            <Col span={10} className="py-2">
              
             <Link to="/">
                   <Logo className="w-28 h-auto sm:w-24 md:w-28 lg:w-32"  /> {/* Adjusted logo size */}
                 </Link>
             
            </Col>
          </Header>
            <div
                className="flex flex-col px-4 sm:px-8 md:px-12 py-10 min-h-screen w-full bg-cover hide-scrollbar::-webkit-scrollbar"
                style={{
                    backgroundImage: "url('/loginbackground.png')",
                }}
            >
                <div className="">
                    <h2 className="text-[20px] md:text-[24px] font-[600] text-white ml-4 md:ml-12 tracking-widest leading-[24px]">
                        <span className="border-t border-white w-12 inline-block mr-2 mb-1"></span>Contact Us
                    </h2>

                    <div className="flex flex-col items-center justify-center mt-6 ">
                        <div className="w-full max-w-md sm:max-w-2xl lg:max-w-3xl my-3 md:flex justify-start items-start hidden">
                            <button className="  backdrop-blur-md flex  items-center justify-center text-gray-700 bg-[#FFFFFF99] px-3 py-2 rounded-xl font-semibold text-[14px] leading-[17px]">
                                <img src={leftarrow} alt="Back" className="w-7 mr-2" />
                                Back
                            </button>
                        </div>
                        <div className="bg-[#99683080] backdrop-blur-xl py-8 px-14  sm:px-14  rounded-[20px] shadow-md w-full max-w-lg md:max-w-3xl">
                            <form className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-x-20 ">
                                <div className="flex flex-col">
                                    <label
                                        className="text-gray-100 mb-2 font-[400] text-[14px] leading-[17.6px]"
                                        htmlFor="name"
                                    >
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="px-4 py-3 rounded-xl bg-transparent text-gray-100 border border-white outline-none focus:ring-1 focus:ring-white"
                                        placeholder="Enter your name"
                                        required
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label
                                        className="text-gray-100 mb-2 font-[400] text-[14px] leading-[17.6px]"
                                        htmlFor="phone"
                                    >
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="phone"
                                        className="px-4 py-3 rounded-xl bg-transparent text-gray-100 border border-white outline-none focus:ring-1 focus:ring-white"
                                        placeholder="Enter your phone"
                                        required
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label
                                        className="text-gray-100 mb-2 font-[400] text-[14px] leading-[17.6px]"
                                        htmlFor="email"
                                    >
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="px-4 py-3 rounded-xl bg-transparent text-gray-100 border border-white outline-none focus:ring-1 focus:ring-white"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label
                                        className="text-gray-100 mb-2 font-[400] text-[14px] leading-[17.6px]"
                                        htmlFor="message"
                                    >
                                        How can we help?
                                    </label>
                                    <textarea
                                        id="message"
                                        rows="4"
                                        className="px-4 py-3 rounded-xl bg-transparent text-gray-100 border border-white outline-none focus:ring-1 focus:ring-white"
                                        placeholder="Your message"
                                    ></textarea>
                                </div>

                                <div className="col-span-1 md:col-span-2 flex justify-center mt-4">
                                    <button
                                        type="submit"
                                        className="mt-4 bg-[#FFFFFF99] text-[#996830] py-4 px-10 rounded-xl shadow-md hover:bg-[#ffffffcc] transition font-[600] text-[14px] leading-[24px]"
                                    >
                                        SUBMIT
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="bg-white drop-shadow-2xl h-20"></div> */}
        </>
    );
};

export default Contactus;
