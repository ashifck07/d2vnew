import React from "react";
import "./style.css";
import {MdArrowOutward} from "react-icons/md";
const Pageitems = ({data, type}) => {
  return (
    <>
      <div class="bg-[#99683033] min-w-full border border-[#996830] rounded-lg p-5 flex flex-col gap-4">
        <div class="flex justify-between pb-2">

          <h2 className="primary-txt text-xl">
            {data.type === "Estimate Lead" || data.type ==="Contact Us Lead" ? (
              <>
                {data?.type} {data?.leadId}
              </>
            ) : (
              <>Project {data?.count}</>
            )}
          </h2>
          <p class="text-end md:text-2xl text-lg text-[#996830]">
            <MdArrowOutward />
          </p>
        </div>
        <div class="flex flex-row align-middle">
          <div className="lg:basis-1/4 md:basis-36 basis-28 flex ">
            <h2 class="secondary-txt flex align-middle md:text-lg text-base">Client Name :</h2>
          </div>
          <div className="lg:basis-1/4 md:basis-36 basis-44">
            <h2 class="secondary-txt md:text-lg text-base">{data?.name}</h2>
          </div>
        </div>
        <div class="flex flex-row  align-middle">
          <div className="lg:basis-1/4 md:basis-36 basis-20 flex ">
            <h2 class="secondary-txt flex align-middle md:text-lg text-base">Email :</h2>
          </div>
          <div className="lg:basis-1/4 md:basis-36 basis-52">
            <h2 class="secondary-txt md:text-lg text-base">{data?.email}</h2>
          </div>
        </div>
        <div class="flex flex-row  align-middle">
          <div className="lg:basis-1/4 basis-36 flex ">
            <h2 class="secondary-txt flex align-middle md:text-lg text-base">Phone Number :</h2>
          </div>
          <div className="lg:basis-1/4  basis-20">
            <h2 class="secondary-txt md:text-lg text-base">{data?.phone}</h2>
          </div>
        </div>
        <div class="flex flex-row align-middle">
          <div className="lg:basis-1/4 md:basis-36 basis-40 flex ">
            <h2 class="secondary-txt flex align-middle md:text-lg text-base">
              {" "}
              {type === "leads"
                ? "Status :"
                : type === "design"
                ? "Design Stage :"
                : type === "work"
                ? "Work Progress :"
                : "Stage"}
            </h2>
          </div>
          <div className="lg:basis-1/4 md:basis-36 basis-56">
            <h2 class="primary-txt md:text-md text-base">
              {type === "leads"
                ? data?.status
                : type === "design"
                ? data?.status
                : type === "work"
                ? data?.status
                : ""}
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pageitems;
