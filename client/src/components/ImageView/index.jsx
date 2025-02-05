import {Button} from "antd";
import React, {useState} from "react";
import {FiPhoneCall} from "react-icons/fi";
import {BsChevronRight, BsChevronLeft} from "react-icons/bs";
import {AiOutlineClose} from "react-icons/ai";

import {
  moodboardone,
  moodboardtwo,
  moodboardthree,
  moodboardfour,
  moodboardfive,
  carosuel,
} from "../../assets/constant";

const ImageView = (img) => {
  // const allImages = [
  //   moodboardone,
  //   moodboardtwo,
  //   moodboardthree,
  //   moodboardfour,
  //   carosuel,
  //   moodboardfive,
  //   moodboardtwo,
  //   moodboardthree,
  // ];
  const data = img.data;
  const maxVisible = 5; // Define the maximum number of visible images
  const visibleImages = data && data.slice(0, maxVisible); // First 5 images
  const hiddenImages = data && data.slice(maxVisible); // Remaining images
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);

  const openCarousel = (startIndex = 0) => {
    setCurrentIndex(startIndex);
    setIsCarouselOpen(true);
  };

  const closeCarousel = () => {
    setIsCarouselOpen(false);
  };

  const changeImage = (direction) => {
    const newIndex = (currentIndex + direction + data.length) % data.length;
    setCurrentIndex(newIndex);
  };

  return (
    <>
      <div className="custom-container ">
        {data && (
          <div className="grid md:rounded-l-[80px] md:rounded-tr-[80px] rounded-l-[30px] rounded-tr-[30px] overflow-hidden">
            {/* First Row */}
            <div className="grid grid-cols-2 ">
              {visibleImages.slice(0, 2).map((image, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden aspect-[4/3] md:h-[380px] w-full cursor-pointer  "
                  onClick={() => openCarousel(index)}
                >
                  <img
                    src={image}
                    alt={`Moodboard ${index + 1}`}
                    className="h-full  md:h-[380px] w-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Second Row */}
            {/* Second Row */}
            <div
              className={`grid ${
                visibleImages.slice(2).length === 1
                  ? "grid-cols-1"
                  : visibleImages.slice(2).length === 2
                  ? "grid-cols-2"
                  : "grid-cols-3"
              }`}
            >
              {visibleImages.slice(2).map((image, index) => {
                const isLastImageWithMore = index === 2 && hiddenImages.length > 0; // Check if this is the last visible image and there are hidden images
                return (
                  <div
                    key={index}
                    className="relative aspect-[4/3] md:h-[320px] md:w-full cursor-pointer"
                    onClick={() => openCarousel(isLastImageWithMore ? visibleImages.length : index + 2)}
                  >
                    <img src={image} alt={`Moodboard ${index + 3}`} className=" h-full w-full  object-fill " />
                    {/* Overlay "+More" Button */}
                    {isLastImageWithMore && (
                      <div className="absolute inset-0 flex items-center justify-center text-[#fff] md:text-[36px] text-lg font-norml bg-[#000000B2]  bg-opacity-25">
                        +{hiddenImages.length}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {/* Image Grid */}

        {/* Carousel */}
        {isCarouselOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col justify-center items-center ">
            <button className="absolute top-4 right-4 text-white text-3xl" onClick={closeCarousel}>
              <AiOutlineClose />
            </button>
            <div className="flex items-center ">
              <button
                className="md:text-[44px] text-[30px] text-white md:p-2 px-1 rounded-full bg-opacity-60 hover:bg-opacity-100"
                onClick={() => changeImage(-1)}
              >
                <BsChevronLeft />
              </button>
              <div className="shadow-lg overflow-hidden mt-7">
                <img src={data[currentIndex]} alt="Carousel" className="w-[900px] md:h-[550px] h-[300px] " />
              </div>
              <button
                className="md:text-[44px] text-[30px] text-white md:p-2 px-1 rounded-full bg-opacity-60 hover:bg-opacity-100"
                onClick={() => changeImage(1)}
              >
                <BsChevronRight />
              </button>
            </div>

            <ul className="flex md:gap-4 my-6">
              {data.map((image, index) => (
                <li
                  key={index}
                  className={`cursor-pointer border-[3px] ${
                    index === currentIndex ? "border-[#996830]" : "border-transparent"
                  } rounded-md`}
                  onClick={() => setCurrentIndex(index)}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="md:w-20 md:h-14 w-10 h-7 object-cover rounded-md transition-transform duration-300 transform hover:scale-125"
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Assigned Architect */}
        {/* <div className="flex flex-col justify-center items-center mt-10 mb-16">
          <h1 className="font-normal  md:text-2xl text-lg text-[#444444]">Assigned Architect: Sivakumar P S</h1>
          <p className="md:text-xl text-[16px] font-normal text-[#444444] mt-7">For clarifications and remarks:</p>
          <Button className="primary-btn-active btn-contact mt-4 md:px-14 md:py-6 md:text-[20px] text-[5px] flex items-center ">
            <FiPhoneCall className="md:text-[20px] text-[13px]" />
            <span className="md:text-[20px] text-[13px]">CONTACT</span>
          </Button>
        </div> */}
      </div>
    </>
  );
};

export default ImageView;
