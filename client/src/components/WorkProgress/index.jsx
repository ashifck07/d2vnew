import React, {useEffect, useState} from "react";
import WaterMark from "../WaterMark";
import ImageView from "../ImageView";
import {Steps} from "antd";
import DesignApproval from "../DesignApproval";
const WorkProgress = (data) => {
  const [current, setCurrent] = useState(0);
  const [currentDescription, setCurrentDescription] = useState("");
  const [currentImages, setCurrentImages] = useState([]);
  const [clientData, setClientData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const toggleMenu = () => {
  //   setIsMenuOpen(!isMenuOpen);
  // };
  useEffect(() => {
    data && setClientData(data.data);

    if (clientData) {
      const stagesArray = Object.keys(clientData?.stages)
        .sort()
        .map((key) => clientData.stages[key]);

      // Find the last enabled stage index
      const lastEnabledIndex = stagesArray.reduce((lastIndex, stage, index) => {
        return stage.enabled ? index : lastIndex;
      }, 0);

      setCurrentDescription(stagesArray[lastEnabledIndex]?.description);
      setCurrent(lastEnabledIndex);
      setCurrentImages(stagesArray[lastEnabledIndex]?.images || []); // Set initial images
    }
  }, [clientData]);

  const stagesArray = clientData?.stages
    ? Object.keys(clientData.stages)
        .sort()
        .map((key) => clientData.stages[key])
    : [];

  const onStepChange = (step) => {
    if (!stagesArray[step]?.enabled) {
      // Exit early if the stage is not enabled
      return;
    }
    setCurrent(step);

    setCurrentDescription(stagesArray[step]?.description || "");
    setCurrentImages(stagesArray[step]?.images || []); // Update images for the selected step
  };

  return (
    <>
      <div className="custom-container">
        <div className="pt-5 md:pt-20 pb-5">
          <h2 className="md:text-[24px] text-[16px] font-[600] text-[#996830cc] sm:ml-16 md:leading-[20px] tracking-widest">
            <span className="border-t-2 border-[#996830cc] w-14 inline-block mr-2 mb-1.5"></span>
            Work Progress
          </h2>
        </div>
        <div className="flex flex-col gap-10 md:p-20 ">
          {clientData && (
            <>
              <Steps current={current} onChange={onStepChange} className="custom-steps">
                {stagesArray.map((step, index) => (
                  <Steps.Step
                    key={index}
                    title={
                      <span
                        className={`block text-sm mt-2 ${
                          current === index
                            ? "text-yellow-700 font-semibold"
                            : step.enabled
                            ? "text-yellow-700"
                            : "text-gray-300"
                        }`}
                      >
                        {step.name}
                      </span>
                    }
                  />
                ))}
              </Steps>

              {/* Step Content */}
              <div className="">
                {currentImages.length !== 0 ? <ImageView data={currentImages} /> : <DesignApproval type={"images"} />}
                <div className="tex-[#444] mt-28 md:mb-10 p-10 ">
                  <h2 className="font-[400] text-[24px] leading-8 pb-3 ">Remarks</h2>
                  <p className=" font-[400] text-[20px] leading-8 ">{currentDescription}</p>
                </div>
              </div>
            </>
          )}
        </div>
        <WaterMark />
      </div>
    </>
  );
};

export default WorkProgress;
