import React from 'react';
import { useNavigate } from "react-router-dom";
import { Project } from "../../../assets/constant";

const ProjectEstimate = () => {
    const navigate = useNavigate();
    return (
        <div className="custom-container px-4 sm:px-8 md:px-12 lg:px-20 pb-16">
            {/* Main Wrapper */}
            <div className="py-16">
                {/* Image Section */}
                <div className="relative flex items-center justify-center">
                    <img
                        src={Project}
                        alt="Got a project"
                        className="shadow-2xl rounded-xl w-full max-w-[600px] md:max-w-[800px]"
                    />
                    <h2 className="absolute bottom-1/2 transform translate-y-1/2 font-Playfair font-semibold text-[28px] sm:text-[40px] md:text-[48px] text-center leading-tight text-black">
                        Got a Project?
                    </h2>
                </div>

                {/* Button Section */}
                <div className="flex items-center justify-center">
                    <button className="mt-6 bg-[#996830] text-white py-3 px-8 sm:py-4 sm:px-10 rounded-xl shadow-md hover:bg-[#7e5825] transition-all font-medium text-sm sm:text-base leading-tight"
                    onClick={() => navigate("/maintenance")} >
                        GET LIVE ESTIMATION
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectEstimate;
