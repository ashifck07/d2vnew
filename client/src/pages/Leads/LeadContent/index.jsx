import React, {useEffect, useState} from "react";
import {FaArrowLeft} from "react-icons/fa6";
import {useNavigate, useParams} from "react-router-dom";
import {IoMdArrowDropdown} from "react-icons/io";
import "./style.css";
import axios from "axios";
import API_BASE_URL from "../../../config/config";
import {message, Spin} from "antd";
import apiClient from "../../../Utiils/axiosInstance ";
import {useUserContext} from "../../../context/UserContext";

const LeadContent = () => {
  const navigate = useNavigate();
  const {id} = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [leadsData, setLeadsData] = useState([]);
  const [architectData, setArchitectData] = useState([]);
  const [selectedArchitectId, setSelectedArchitectId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {user} = useUserContext();
  const statuses = ["OPEN", "NO RESPONSE", "CLOSED"];

  const handleUpdate = async (type, value) => {
    try {
      setLoading(true);
      let response;
      if (type === "status") {
        // Handle Status Change
        response = await apiClient.patch(`/leads/${id}`, {status: value});
        if (response.status === 200) {
          setSelectedStatus(value);
          message.success("Stage Updated Successfully");
          fetchLead();
        }
      } else if (type === "architect") {
        if (user.role !== "master") {
          return;
        }
        response = await apiClient.patch(`/leads/${id}`, {assignedArchitect: value});
        if (response.status === 200) {
          setSelectedArchitectId(value);
          message.success("Architect Assigned Successfully");
          fetchLead();
        }
      }
    } catch (error) {
      console.error("Error updating lead:", error);
      message.error("Failed to update lead.");
    } finally {
      setLoading(false);
    }
    setIsModalOpen(false);
  };
  const fetchLead = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/leads/${id}`);
      if (response.status !== 200) {
        throw new Error(`Failed to fetch data: Status ${response.status}`);
      }
      const result = response.data;

      setLeadsData(result);

      if (result.assignedArchitect) {
        setSelectedArchitectId(result.assignedArchitect);
      }
      setSelectedStatus(result.status);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const fetchAllArchitect = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/architect`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();
      setArchitectData(result);
    } catch (error) {}
  };
  useEffect(() => {
    fetchLead();

    fetchAllArchitect();
  }, []);
  const formatDate = (isoDate) => {
    if (!isoDate) return "N/A"; // Fallback if the date is null or undefined

    const date = new Date(isoDate);
    const options = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };
  return (
    <Spin className="custom-spinner" spinning={loading} tip="Loading...">
      <div className="flex flex-col gap-2 md:pt-6 pt-0">
        <div className="my-5 lg:my-0">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex primary-btn-boarded rounded-2 gap-1 px-2 py-2 items-center"
          >
            <FaArrowLeft className="text-2xl" />
            Go back
          </button>
        </div>
        <div className="bg-[#99683033] min-w-full border flex flex-col gap-6 border-[#996830] rounded-lg md:p-10 p-5">
          <h3 className="primary-txt text-2xl text-center p-3">Contact Us lead</h3>
          <div className="flex md:flex-row flex-col">
            <div className="basis-8/12 flex flex-col gap-4">
              <div className="flex flex-row  align-middle">
                <div className="lg:basis-1/4 md:basis-36 basis-28  flex ">
                  <h2 className="secondary-txt flex align-middle md:text-lg text-base">Name :</h2>
                </div>
                <div className="md:basis-1/4">
                  <h2 className="secondary-txt md:text-lg text-base">{leadsData.name}</h2>
                </div>
              </div>
              <div className="flex flex-row  align-middle">
                <div className="lg:basis-1/4 md:basis-36 basis-32  flex ">
                  <h2 className="secondary-txt flex align-middle md:text-lg text-base">Email :</h2>
                </div>
                <div className="md:basis-1/4">
                  <h2 className="secondary-txt md:text-lg text-base">{leadsData.email}</h2>
                </div>
              </div>
              <div className="flex flex-row  align-middle">
                <div className=" flex lg:basis-1/4 md:basis-40 basis-32 ">
                  <h2 className="secondary-txt flex align-middle md:text-lg text-base">Phone Number :</h2>
                </div>
                <div className="md:basis-1/4">
                  <h2 className="secondary-txt md:text-lg text-base">{leadsData.phone}</h2>
                </div>
              </div>
              <div className="flex flex-row align-middle md:mb-0 mb-8">
                <div className=" flex lg:basis-1/4 basis-44 ">
                  <h2 className="secondary-txt flex items-center md:text-lg text-base">Assign Architect :</h2>
                </div>
                <div className="basis-1/4">
                  <select
                    className="custome-select md:pl-9  px-5 py-1.5 "
                    onChange={(e) => handleUpdate("architect", e.target.value)}
                    name="assignedArchitect"
                    id="assignedArchitect"
                    value={selectedArchitectId || ""}
                    disabled={user && user.role !== "master"}
                  >
                    <option value="" disabled>
                      Select Architect
                    </option>
                    {architectData.map((data, index) => (
                      <option key={index} value={data.id}>
                        {data.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="md:basis-4/12 flex flex-col justify-center items-center">
              <div className="flex flex-col gap-4">
                <button
                  className="custome-select px-5 py-1.5 bg-gray-200 inline-flex gap-2 items-center justify-center"
                  onClick={() => setIsModalOpen(true)}
                  disabled={selectedStatus === "CLOSED"}
                >
                  {selectedStatus} <IoMdArrowDropdown className="text-2xl" />
                </button>
                <p className="text-m">{formatDate(leadsData?.updatedAt)}</p>
              </div>
            </div>
          </div>
          <div className="flex md:flex-row flex-col gap-2">
            <div className="basis-10/12">
              <textarea className="custom-textarea" value={leadsData.description} rows="5" cols="20" name="blog">
                Share your knowledge by writing your own blog!
              </textarea>
            </div>
            <div className="basis-2/12 md:flex items-end">
              <p className="text-m">{formatDate(leadsData?.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
            onClick={() => setIsModalOpen(false)}
          >
            <div className="bg-white rounded-2xl shadow-lg w-40 overflow-hidden">
              <ul>
                {statuses.map((status) => (
                  <li key={status}>
                    <button
                      className={`w-full text-center bg-white text-[#996830] px-3 py-2.5  font-medium ${
                        selectedStatus === status ? "bg-gray-100 cursor-not-allowed" : "bg-white hover:bg-gray-100"
                      }`}
                      onClick={() => handleUpdate("status", status)}
                      disabled={selectedStatus === status}
                    >
                      {status}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </Spin>
  );
};

export default LeadContent;
