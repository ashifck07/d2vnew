import React, { useState } from "react";

import {
  designapporavl,
  falseceilingcal,
  kitchenshapes,
  Logo,
  wallpainting,
  wallpanel,
  wardrobecal,
} from "../../assets/constant";
import { FiPhoneCall } from "react-icons/fi";
import { MdOutlineApartment } from "react-icons/md";
import { RiHome2Fill } from "react-icons/ri";
import { FaBars } from "react-icons/fa6";
import { AiOutlineClose } from "react-icons/ai";
import { Col, Drawer } from "antd";
import { Header } from "antd/es/layout/layout";
import { RiUserLine } from "react-icons/ri";
import { WaterMark } from "../../components";
import apiClient from "../../Utiils/axiosInstance ";
import { IoCloseCircleOutline } from "react-icons/io5";

const LiveEstimation = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    liveEstimationData: {
      projectType: null,
      homeConfiguration: null,
      wardrobe: {
        numberOfWardrobes: 4,
        area: Array(4).fill(""),
      },
      modularKitchen: {
        // type: "L type",
        approxArea: "",
      },
      wallPaneling: {
        numberOfPanels: 4,
        area: Array(4).fill(""),
      },
      falseCeiling: {
        type: "Gypsum",
        approxArea: "",
      },
      wallpaper: {
        type: "Normal",
        approxArea: "",
      },
    },
    customerData: {
      name: "",
      email: "",
      phone: "",
    },
  });
  const pages = [
    <Step1
      data={formData.liveEstimationData}
      setData={(data) => setFormData({ ...formData, liveEstimationData: data })}
    />,
    <Step2
      data={formData.liveEstimationData.wardrobe}
      setData={(data) =>
        setFormData({ ...formData, liveEstimationData: { ...formData.liveEstimationData, wardrobe: data } })
      }
    />,
    <Step3
      data={formData.liveEstimationData.modularKitchen}
      setData={(data) =>
        setFormData({ ...formData, liveEstimationData: { ...formData.liveEstimationData, modularKitchen: data } })
      }
    />,
    <Step4
      data={formData.liveEstimationData.wallPaneling}
      setData={(data) =>
        setFormData({ ...formData, liveEstimationData: { ...formData.liveEstimationData, wallPaneling: data } })
      }
    />,
    <Step5
      data={formData.liveEstimationData.falseCeiling}
      setData={(data) =>
        setFormData({ ...formData, liveEstimationData: { ...formData.liveEstimationData, falseCeiling: data } })
      }
    />,
    <Step6
      data={formData.liveEstimationData.wallpaper}
      setData={(data) =>
        setFormData({ ...formData, liveEstimationData: { ...formData.liveEstimationData, wallpaper: data } })
      }
    />,
    <Step7 data={formData.customerData} setData={(data) => setFormData({ ...formData, customerData: data })} />,
    <Step8 />,
  ];
  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleEstimate = async () => {
    try {
      console.log("dddd", formData);
      const response = await apiClient.post(`/leads/estimate`, formData);
      const data = response.data;
      setShowPopup(true);
    } catch (error) {
      
      console.error(error);
    }
  };
  return (
    <div className="w-full custom-container">
      <Header className="ant-header flex items-center justify-between px-2 md:px-12">
        <Col span={10} className="py-3">
          <Logo className="w-28 h-auto sm:w-24 md:w-28 lg:w-32" />
        </Col>
        
      </Header>
      <div>
        <div className="flex items-center">
          <h2 className="md:text-2xl text-base font-[600] leading-5 text-[#996830cc] md:my-20 my-10">
            <span className="border-t border-[#996830cc] w-12 inline-block mr-2 mb-1"></span>
            LIVE ESTIMATION
          </h2>
        </div>
      </div>
      <div>{pages[currentPage]}</div>
      <div className="text-center md:my-24 my-12 gap-6 flex flex-col justify-center items-center md:flex-row">
        {currentPage > 0 && (
          <button
            onClick={handlePrevious}
            className="bg-[#9968301A] text-[#996830] w-52 h-12 font-[500] md:text-[20px] text-sm leading-8 rounded-xl"
          >
            PREVIOUS
          </button>
        )}
        {currentPage < pages.length - 2 ? (
          <button
            onClick={handleNext}
            className="bg-[#996830] text-white w-52 h-12 font-[500] md:text-[20px] text-sm leading-8 rounded-xl"
          >
            NEXT
          </button>
        ) : (
          <button
            onClick={handleEstimate}
            className="bg-[#996830] text-white w-52 h-12 font-[500] md:text-[20px] text-sm leading-8 rounded-xl"
          >
            ESTIMATE
          </button>
        )}
      </div>
      <Pagination totalPages={pages.length} currentPage={currentPage} onClick={(page) => setCurrentPage(page)} />
      <WaterMark />
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-[#996830]/90 p-12 rounded-xl shadow-lg relative lg:w-[30%] w-[90%] ">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              onClick={() => setShowPopup(false)}
            >
              <IoCloseCircleOutline className="text-white text-xl" />
            </button>
            <div className="flex flex-col gap-4 md:p-10 p-5">
              <p className="md:text-xl text-lg text-white text-center">Calculating...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
const Step1 = ({ data, setData }) => {
  const [projectType, setProjectType] = useState(data.projectType);
  const [homeConfiguration, sethomeConfiguration] = useState(data.homeConfiguration);
  const [customBHK, setCustomBHK] = useState(data.homeConfiguration);
  const bhkOptions = ["1 BHK", "2 BHK", "3 BHK", "4 BHK"];
  const handleProjectTypeChange = (type) => {
    setProjectType(type);
    setData({ ...data, projectType: type });
  };
  const handleBHKChange = (bhk) => {
    sethomeConfiguration(bhk);
    setCustomBHK("");
    setData({ ...data, homeConfiguration: bhk });
  };
  const handleCustomBHKChange = (e) => {
    const value = e.target.value;
    setCustomBHK(value);
    sethomeConfiguration("");
    // setData({ ...data, selectedBHK: value });
    setData({ ...data, homeConfiguration: value });
  };
  return (
    <div className="mt-8">
      <div className="flex md:gap-[210px] gap-4 md:items-start md:flex-row flex-col items-start text-[#444]">
        <div className="md:text-2xl font-normal leading-8 text-xl">Project Type:</div>
        <div className="flex border border-[#996833] rounded-xl">
          <button
            className={`flex flex-col gap-2 items-center rounded-xl px-4 py-2 ${projectType === "apartment" ? "bg-[#996833] text-white" : "text-[#996833]"
              }`}
            onClick={() => handleProjectTypeChange("apartment")}
          >
            <div className="text-3xl">
              <MdOutlineApartment />
            </div>
            <div className="md:text-lg leading-6 font-medium text-base">Apartment</div>
          </button>
          <button
            className={`flex flex-col gap-2 items-center rounded-xl px-8 py-2 ${projectType === "villa" ? "bg-[#996833] text-white" : "text-[#996833]"
              }`}
            onClick={() => handleProjectTypeChange("villa")}
          >
            <div className="text-3xl">
              <RiHome2Fill />
            </div>
            <div className="md:text-lg leading-6 font-medium text-base">Villa</div>
          </button>
        </div>
      </div>
      <div className="flex text-center md:items-start md:gap-32 gap-3 flex-col md:flex-row mt-16 items-start text-[#444]">
        <div className="md:text-2xl font-normal leading-8 text-xl">Home Configuration :</div>
        <div className="grid md:grid-cols-4 grid-cols-3 md:gap-y-11 gap-y-5">
          {bhkOptions.map((bhk, index) => (
            <button
              key={index}
              className={`border border-[#99683099] rounded-xl text-center w-20 h-10 md:w-28 md:h-12 font-normal md:text-lg leading-6 text-sm ${homeConfiguration === bhk ? "bg-[#996833] text-white" : ""
                }`}
              onClick={() => handleBHKChange(bhk)}
            >
              {bhk}
            </button>
          ))}
          <div className="flex items-center justify-center border rounded-xl w-20 h-10 md:w-28 md:h-12 border-[#99683099] font-normal md:text-lg leading-6 text-sm">
            Others
          </div>
          <input
            type="text"
            value={customBHK}
            onChange={handleCustomBHKChange}
            className="col-span-1 border rounded-xl py-2 px-2 text-start border-[#99683099] md:w-36 w-24 md:h-12 h-10 font-normal md:text-lg leading-6 text-sm focus-visible:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

const Step2 = ({ data, setData }) => {
  const [numberOfWardrobes, setNumberOfWardrobes] = useState(data.numberOfWardrobes);
  const [wardrobeAreas, setWardrobeAreas] = useState(data.area);
  const handleSelectChange = (e) => {
    const value = Number(e.target.value);
    setNumberOfWardrobes(value);
    setWardrobeAreas(Array(value).fill(""));
    setData({ ...data, numberOfWardrobes: value, area: Array(value).fill("") });
  };
  const handleAreaChange = (index, value) => {
    const newWardrobeAreas = [...wardrobeAreas];
    newWardrobeAreas[index] = value;
    setWardrobeAreas(newWardrobeAreas);
    setData({ ...data, area: newWardrobeAreas });
  };
  return (
    <div>
      <h1 className="md:mb-14 mb-7 font-light md:text-3xl text-xl leading-[72px] underline underline-offset-4 text-[#444]">
        Wardrobe
      </h1>
      <div className="flex items-center gap-4  mb-10 md:mb-20">
        <h2 className="font-normal md:text-2xl md:leading-6 text-[18px] text-[#444]">Number of Wardrobe:</h2>
        <select
          className="border border-[#99683099] rounded-xl md:px-6 md:py-3 px-3 py-1 text-[#444] focus-visible:outline-none "
          value={numberOfWardrobes}
          onChange={handleSelectChange}
        >
          {Array.from({ length: 10 }, (_, i) => (
            <option key={i + 1} value={i + 1} className="">
              {i + 1}
            </option>
          ))}
        </select>
      </div>
      <div className="flex md:gap-32 gap-7 items-baseline md:items-center">
        <div className="flex flex-col md:gap-0 gap-7">
          <h2 className="font-normal md:text-2xl text-base leading-6 text-[#444] md:mb-8">Area:</h2>
          <img src={wardrobecal} alt="wardrobe calculator" />
          <p className="font-Playfair font-normal text-[14px] text-xs leading-5 text-center">Sq Area = l * b</p>
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 md:gap-x-28 md:gap-y-16 gap-4">
          {Array.from({ length: numberOfWardrobes }).map((_, index) => (
            <div key={index} className="flex gap-3 justify-center items-center">
              <h2 className="font-normal md:text-xl leading-8 text-[#444] text-base">{index + 1}</h2>
              <input
                type="number"
                min="1"
                max="10"
                value={wardrobeAreas[index]}
                onChange={(e) => handleAreaChange(index, e.target.value)}
                className="border border-[#99683099] rounded-xl md:w-40 md:h-11 w-80 h-11 focus-visible:outline-none pl-3"
              />
              <h2 className="mt-5 font-normal md:text-xl text-base leading-6 text-[#444]">Sq.Ft</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
const Step3 = ({ data, setData }) => {
  // const [kitchenType, setKitchenType] = useState(data.type);
  const [kitchenArea, setKitchenArea] = useState(data.approxArea);
  // const handleTypeChange = (e) => {
  //     const value = e.target.value;
  //     setKitchenType(value);
  //     setData({ ...data, type: value });
  // };
  const handleAreaChange = (e) => {
    const value = e.target.value;
    setKitchenArea(value);
    setData({ ...data, approxArea: value });
  };
  return (
    <div className="">
      <h1 className="mb-14 font-light md:text-3xl text-xl leading-[72px] underline underline-offset-4 text-[#444]">
        Modular Kitchen
      </h1>
      {/* <div className="flex items-center gap-4 mb-20">
                <h2 className="font-normal md:text-2xl leading-6 text-[#444] text-lg">Type :</h2>
                <select
                    className="border border-[#99683099] rounded-xl px-6 py-3 text-[#444] focus-visible:outline-none"
                    value={kitchenType}
                    onChange={handleTypeChange}
                >
                    <option value="L type">L type</option>
                    <option value="U type">U type</option>
                    <option value="Straight">Straight</option>
                </select>
            </div> */}
      <div className="flex md:gap-28 gap-5 md:items-center flex-col md:flex-row">
        <h2 className="font-normal md:text-2xl text-lg leading-6 text-[#444]">Approximate Area :</h2>
        <div className="flex md:gap-20 gap-5">
          <div className="flex justify-center items-center md:gap-5 gap-2">
            <input
              type="text"
              min="1"
              max="10"
              value={kitchenArea}
              onChange={handleAreaChange}
              className="border border-[#99683099] rounded-xl md:w-40 md:h-11 w-32 h-11 focus-visible:outline-none pl-3"
            />
            <h2 className="mt-12 font-normal md:text-xl text-base leading-6 text-[#444]">Sq.Ft</h2>
          </div>
          <div>
            <img src={kitchenshapes} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};
const Step4 = ({ data, setData }) => {
  const [numberOfPanels, setNumberOfPanels] = useState(data.numberOfPanels);
  const [wallPanelAreas, setWallPanelAreas] = useState(data.area);
  const handleSelectChange = (e) => {
    const value = Number(e.target.value);
    setNumberOfPanels(value);
    setWallPanelAreas(Array(value).fill(""));
    setData({ ...data, numberOfPanels: value, area: Array(value).fill("") });
  };
  const handleAreaChange = (index, value) => {
    const newWallPanelAreas = [...wallPanelAreas];
    newWallPanelAreas[index] = value;
    setWallPanelAreas(newWallPanelAreas);
    setData({ ...data, area: newWallPanelAreas });
  };
  return (
    <div>
      <h1 className="my-2 font-light md:text-3xl text-xl leading-[72px] underline underline-offset-4 text-[#444]">
        Wall Paneling
      </h1>
      <div className="flex items-center gap-4  md:mb-20 mb-10">
        <h2 className="font-normal md:text-2xl leading-6 text-lg text-[#444]">Number of Wall Panel:</h2>
        <select
          className="border border-[#99683099] rounded-xl md:px-6 md:py-3 px-3 py-1 text-[#444] focus-visible:outline-none"
          value={numberOfPanels}
          onChange={handleSelectChange}
        >
          {Array.from({ length: 10 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>
      <div className="flex md:gap-32 gap-7 items-baseline md:items-center">
        <div className="flex flex-col md:gap-0 gap-7">
          <h2 className="font-normal md:text-2xl text-base leading-6 text-[#444] md:mb-8">Area:</h2>
          <img src={wallpanel} alt="wall panel calculator" />
          <p className="font-Playfair font-normal text-[14px] text-xs leading-5 text-center">Sq Area = l * b</p>
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 md:gap-x-28 md:gap-y-16 gap-4">
          {Array.from({ length: numberOfPanels }).map((_, index) => (
            <div key={index} className="flex gap-3 justify-center items-center">
              <h2 className="font-normal md:text-xl leading-8 text-[#444] text-base">{index + 1}</h2>
              <input
                type="number"
                min="1"
                max="10"
                value={wallPanelAreas[index]}
                onChange={(e) => handleAreaChange(index, e.target.value)}
                className="border border-[#99683099] rounded-xl md:w-40 md:h-11 w-80 h-11 focus-visible:outline-none pl-3"
              />
              <h2 className="mt-5 font-normal md:text-xl text-base leading-6 text-[#444]">Sq.Ft</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Step5 = ({ data, setData }) => {
  const [falseCeilingType, setFalseCeilingType] = useState(data.type);
  const [falseCeilingArea, setFalseCeilingArea] = useState(data.approxArea);
  const handleTypeChange = (e) => {
    const value = e.target.value;
    setFalseCeilingType(value);
    setData({ ...data, type: value });
  };
  const handleAreaChange = (e) => {
    const value = e.target.value;
    setFalseCeilingArea(value);
    setData({ ...data, approxArea: value });
  };
  return (
    <div className="relative">
      <h1 className="md:mb-14 mb-7 font-light text-xl sm:text-3xl leading-[60px] sm:leading-[72px] underline underline-offset-4 text-[#444]">
        False Ceiling
      </h1>
      <div className="flex mb-28 flex-col lg:flex-row lg:justify-between lg:items-start">
        <div className="relative flex flex-col justify-around">
          <div className="flex items-center gap-4 sm:gap-10 mb-[3rem] sm:mb-[8rem] lg:gap-96">
            <h2 className="font-normal text-lg md:text-2xl leading-6 text-[#444]">Type :</h2>
            <select
              className="border border-[#99683099] rounded-xl w-40 md:w-60 sm:w-72 h-10 sm:h-12 pl-3 focus-visible:outline-none text-[#444] text-left"
              value={falseCeilingType}
              onChange={handleTypeChange}
            >
              <option value="Gypsum">Gypsum</option>
              <option value="POP">POP</option>
              <option value="Grid">Grid</option>
            </select>
          </div>
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center lg:gap-20">
            <div>
              <h2 className="font-normal text-lg sm:text-2xl leading-6 text-[#444] mb-6 sm:mb-8 mt-[-15px] sm:mt-0">
                Approximate Area :
              </h2>
            </div>
            <div className="flex flex-row-reverse justify-end gap-2 sm:gap-4 mt-6 items-center lg:mt-0">
              <div className="flex gap-2 sm:gap-4 justify-center items-center mt-[-65px] sm:mt-[-75px]">
                <input
                  type="text"
                  min="1"
                  max="10"
                  value={falseCeilingArea}
                  onChange={handleAreaChange}
                  className="border border-[#99683099] rounded-xl w-40 sm:w-48 h-10 sm:h-12 focus-visible:outline-none pl-3"
                />
                <h2 className="mt-1 sm:mt-2 lg:mt-0 font-normal text-lg sm:text-xl leading-6 text-[#444]">Sq.Ft</h2>
              </div>
              <div className="lg:absolute lg:right-[-361px] lg:top-0">
                <img className="mb-12 sm:mb-14 lg:mb-0 lg:ml-8 max-w-full" src={falseceilingcal} alt="False Ceiling" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const Step6 = ({ data, setData }) => {
  const [wallpaperType, setWallpaperType] = useState(data.type);
  const [wallpaperArea, setWallpaperArea] = useState(data.approxArea);
  const handleTypeChange = (e) => {
    const value = e.target.value;
    setWallpaperType(value);
    setData({ ...data, type: value });
  };
  const handleAreaChange = (e) => {
    const value = e.target.value;
    setWallpaperArea(value);
    setData({ ...data, approxArea: value });
  };
  return (
    <div className="relative">
      <h1 className="md:mb-14 mb-7 font-light text-2xl sm:text-3xl leading-[60px] sm:leading-[72px] underline underline-offset-4 text-[#444]">
        Wall Painting
      </h1>
      <div className="flex mb-28 flex-col lg:flex-row lg:justify-between lg:items-start">
        <div className="relative flex flex-col justify-around">
          <div className="flex items-center gap-4 sm:gap-10 mb-[3rem] sm:mb-[8rem] lg:gap-96">
            <h2 className="font-normal text-lg sm:text-2xl leading-6 text-[#444]">Type :</h2>
            <select
              className="border border-[#99683099] rounded-xl md:w-60 w-40 sm:w-72 h-10 sm:h-12 pl-3 focus-visible:outline-none text-[#444] text-left"
              value={wallpaperType}
              onChange={handleTypeChange}
            >
              <option value="Normal">Normal</option>
              <option value="Premium">Premium</option>
              <option value="Luxury">Luxury</option>
            </select>
          </div>
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center lg:gap-20">
            <div>
              <h2 className="font-normal text-lg sm:text-2xl leading-6 text-[#444] mb-6 sm:mb-8 mt-[-15px] sm:mt-0">
                Approximate Area :
              </h2>
            </div>
            <div className="flex flex-row-reverse justify-end gap-2 sm:gap-4 mt-6 items-center lg:mt-0">
              <div className="flex gap-2 sm:gap-4 justify-center items-center mt-[-65px] sm:mt-[-75px]">
                <input
                  type="text"
                  min="1"
                  max="10"
                  value={wallpaperArea}
                  onChange={handleAreaChange}
                  className="border border-[#99683099] rounded-xl w-40 sm:w-48 h-10 sm:h-12 focus-visible:outline-none pl-3"
                />
                <h2 className="mt-1 sm:mt-2 lg:mt-0 font-normal text-lg sm:text-xl leading-6 text-[#444]">Sq.Ft</h2>
              </div>
              <div className="lg:absolute lg:right-[-361px] lg:top-0">
                <img className="mb-12 sm:mb-14 lg:mb-0 lg:ml-8 max-w-full" src={wallpainting} alt="Wall Painting" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Step7 = ({ data, setData }) => {
  const [name, setName] = useState(data.name);
  const [email, setEmail] = useState(data.email);
  const [phone, setPhone] = useState(data.phone);

  const [acceptPolicy, setAcceptPolicy] = useState(data.acceptPolicy);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setName(value);
      setData({ ...data, name: value });
    } else if (name === "email") {
      setEmail(value);
      setData({ ...data, email: value });
    } else if (name === "phone") {
      setPhone(value);
      setData({ ...data, phone: value });
    }
  };
  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setAcceptPolicy(checked);
    setData({ ...data, acceptPolicy: checked });
  };
  return (
    <div className="flex flex-col items-center md:my-16">
      <p className="font-normal md:text-xl text-base leading-4 text-center text-[#444]">
        Your estimation is almost complete, we just need few more details here.
      </p>
      <div className="flex flex-col justify-center items-center gap-10 mt-10">
        <input
          type="text"
          name="name"
          min="1"
          max="10"
          value={name}
          onChange={handleInputChange}
          placeholder="Enter Your Name*"
          className="border-2 border-[#99683099] rounded-xl md:w-80 w-60 h-12 focus-visible:outline-none pl-4 placeholder-[#444444CC] placeholder:font-normal placeholder:text-base leading-5"
        />
        <input
          type="text"
          name="email"
          min="1"
          max="10"
          value={email}
          onChange={handleInputChange}
          placeholder="Enter Email Id*"
          className="border-2 border-[#99683099] rounded-xl md:w-80 w-60 h-12 focus-visible:outline-none pl-4 placeholder-[#444444CC] placeholder:font-normal placeholder:text-base leading-5"
        />
        <input
          type="text"
          name="phone"
          min="1"
          max="10"
          value={phone}
          onChange={handleInputChange}
          placeholder="Enter your Number*"
          className="border-2 border-[#99683099] rounded-xl md:w-80 w-60 h-12 focus-visible:outline-none pl-4 placeholder-[#444444CC] placeholder:font-normal placeholder:text-base leading-5"
        />
      </div>
      <div className="flex mt-5 justify-center items-center">
        <input
          type="checkbox"
          name="acceptPolicy"
          checked={acceptPolicy}
          onChange={handleCheckboxChange}
          className="w-5 h-5"
        />
        <p className="font-normal text-base leading-5 text-[#444444CC] ml-3">
          {" "}
          Accept to <span className="underline underline-offset-4">Privacy policy</span>
        </p>
      </div>

    </div>
  );
};
const Step8 = () => (
  <div className="p-4 text-center">
    {/* Wrapper */}
    <div className="relative py-16">
      {/* Background Image Section */}
      <div className="relative flex items-center justify-center">
        <img
          src={designapporavl}
          alt="Got a project"
          className="shadow-2xl rounded-xl opacity-30 max-w-full h-auto object-cover"
        />
      </div>
      {/* Content Section */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        {/* Title */}
        <div className="text-center text-[#444444CC] font-Playfair mb-8">
          <h2 className="font-semibold text-lg md:text-3xl leading-tight">Your Final Estimate</h2>
          <span className="font-normal text-sm md:text-xl mt-2">&#40;approx&#41;</span>
        </div>
        {/* Price Range */}
        <p className="font-semibold font-Playfair text-2xl sm:text-3xl md:text-5xl leading-[55px] text-[#444444] my-8 ">
          &#8377; 60,00,000 <span className="text-xl sm:text-2xl md:text-4xl text-[#44444480]">to</span> &#8377;
          90,00,000
        </p>
        {/* Contact Section */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
          <p className="font-medium text-sm md:text-lg leading-6 text-[#444444]">Contact Project Architect at:</p>
          <button className="primary-btn-active btn-contact flex items-center justify-center gap-2 py-2 px-5 md:py-3 md:px-7 font-medium text-sm md:text-lg rounded-md">
            <span className="text-base md:text-lg">
              <FiPhoneCall />
            </span>
            CONTACT
          </button>
        </div>
      </div>
    </div>
  </div>
);
const Pagination = ({ totalPages, currentPage, onClick }) => {
  return (
    <div className="flex justify-center mt-6 md:mb-24 mb-12 space-x-2">
      {Array.from({ length: totalPages }, (_, index) => (
        <span
          key={index}
          className={`w-3 h-3 rounded-full cursor-pointer ${index === currentPage ? "bg-[#A47237]" : "bg-gray-300"}`}
          onClick={() => onClick(index)}
        ></span>
      ))}
    </div>
  );
};
export default LiveEstimation;
