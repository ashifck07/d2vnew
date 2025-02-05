import React, {useEffect, useState} from "react";
import {FaArrowLeft} from "react-icons/fa6";
import {IoMdArrowDropdown} from "react-icons/io";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";

import {Image, message, Spin, Upload} from "antd";
import API_BASE_URL from "../../config/config";
import {useUserContext} from "../../context/UserContext";
import apiClient from "../../Utiils/axiosInstance ";
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const FormComponent = ({mode}) => {
  const {id} = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [editData, seteditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [architectData, setArchitectData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("Select Design State");
  const designStatuses = ["Mood Board", "Basic Design", "Final Design", "Choose Estimation", "Estimation Confirmed"];
  const workStatuses = ["Work Started", "Materials Arrived", "Assembly Finished", "Ready to Deliver"];
  const {user} = useUserContext();
  const navigate = useNavigate();

  //UPLOAD
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    assignedArchitect: "",
    selectedStatus: "Select current Status",
    images: [],
  });

  const fetchAllArchitect = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/architect`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();
      setArchitectData(result);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/workProgress/${id}`);
      if (response.status == 200) {
        seteditData(response.data.project);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProjectData();
    }
  }, []);

  useEffect(() => {
    fetchAllArchitect();
    mode === "work" && setSelectedStatus("Select Work Progress");
    if (editData) {
      setFormData({
        ...formData,
        name: editData.name || "",
        email: editData.email || "",
        phone: editData.phone || "",
        assignedArchitect: editData.assignedArchitect || "",
        selectedStatus: editData.status || "Select Design State",
        images: editData.images || [],
      });
    } else {
      setFormData({...formData, assignedArchitect: user && user.id});
    }
  }, [editData]);

  const validateField = (e) => {
    const {name, value} = e.target;
    let errorMsg = "";

    if (name === "name") {
      if (!value) {
        errorMsg = "Name is required.";
      }
    }
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        errorMsg = "Email is required.";
      } else if (!emailRegex.test(value)) {
        errorMsg = "Please enter a valid email.";
      }
    }

    if (name === "phone") {
      const phoneRegex = /^\d{10}$/;
      if (!value) {
        errorMsg = "Phone number is required.";
      } else if (!phoneRegex.test(value)) {
        errorMsg = "Please enter a valid 10-digit phone number.";
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));
  };
  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData((prevData) => ({...prevData, [name]: value}));

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const handleStatusChange = (status) => {
    setFormData((prevData) => ({...prevData, selectedStatus: status}));
    setIsModalOpen(false);
  };
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChange = ({fileList: newFileList}) => setFileList(newFileList);
  const handleAddImage = () => {
    document.querySelector(".ant-upload input[type='file']").click();
  };
  const handleUpdate = async () => {
    console.log("edited values are", formData);
  };
  const handleSubmit = async () => {
    try {
      setLoading(true);
      // const requiredFields = ["name", "email", "phone", "assignedArchitect", "selectedStatus"];
      // for (const field of requiredFields) {
      //   if (!formData[field] || (field === "selectedStatus" && formData[field] === "Select current Status")) {
      //     const formattedField = field
      //       .replace(/([A-Z])/g, " $1") // Add spaces before capital letters
      //       .toLowerCase(); // Convert to lowercase
      //     message.error(`Please enter a valid ${formattedField}.`);
      //     return;
      //   }
      // }
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("assignedArchitect", formData.assignedArchitect);
      formDataToSend.append("status", formData.selectedStatus);
      formDataToSend.append("type", mode);
      // Append each file from the fileList
      fileList.forEach((file) => {
        formDataToSend.append("img", file.originFileObj);
      });
      const route = mode === "work" ? "workProgress" : "designs";
      const response = await apiClient.post(`/${route}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 201) {
        message.success("Work Added successfully");
      } else {
        message.error(`Failed to update architect`);
      }
      navigate(-1);
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error(`${error.response.data.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin className="custom-spinner" spinning={loading} tip="Loading...">
      <div className="flex flex-col gap-2 md:px-10">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex primary-btn-boarded rounded-2 gap-1 px-2 py-2 items-center md:my-0 my-4"
          >
            <FaArrowLeft className="text-2xl" />
            Go back
          </button>
        </div>
        <div className="bg-[#99683033] min-w-full border flex flex-col gap-6 border-[#996830] rounded-lg md:p-10 p-5 ">
          <div className="flex md:flex-row flex-col">
            <div className="basis-8/12 flex flex-col gap-5">
              <div className="flex md:flex-row flex-col gap-3 md:gap-0 align-middle md:text-lg text-base">
                <div className="basis-1/4 flex items-center ">
                  <h2 className="secondary-txt flex align-middle md:text-lg text-base">Name :</h2>
                </div>
                <div className="basis-2/4">
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    type="text"
                    onBlur={validateField}
                    className={`custom-input w-full h-[45px] text-base rounded-xl pl-4 outline-none focus:ring-1 ${
                      errors.name ? "ring-red-500" : "focus:ring-[#996833]"
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>
              </div>
              <div className="flex md:flex-row flex-col gap-3 md:gap-0 align-middle md:text-lg text-base">
                <div className="basis-1/4 flex items-center">
                  <h2 className="secondary-txt flex align-middle md:text-lg text-base">Email :</h2>
                </div>
                <div className="basis-2/4">
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={validateField} // Validate on blur (when the user leaves the field)
                    type="text"
                    className={`custom-input w-full h-[45px] text-base rounded-xl pl-4 outline-none focus:ring-1 ${
                      errors.email ? "ring-red-500" : "focus:ring-[#996833]"
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
              </div>
              <div className="flex md:flex-row flex-col gap-3 md:gap-0 align-middle md:text-lg text-base">
                <div className="basis-1/4 flex items-center">
                  <h2 className="secondary-txt flex align-middle md:text-lg text-base">Phone Number :</h2>
                </div>
                <div className="basis-2/4">
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onBlur={validateField}
                    type="text"
                    className={`custom-input w-full h-[45px] text-base rounded-xl pl-4 outline-none focus:ring-1 ${
                      errors.phone ? "ring-red-500" : "focus:ring-[#996833]"
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                </div>
              </div>
              <div className="flex md:flex-row flex-col gap-3 md:gap-0 align-middle ">
                <div className="basis-1/4 flex items-center ">
                  <h2 className="secondary-txt flex items-center md:text-lg text-base">Assign Architect :</h2>
                </div>
                <div className="basis-2/4">
                  <select
                    name="assignedArchitect"
                    value={formData.assignedArchitect}
                    onChange={handleInputChange}
                    className="custome-select w-full h-[45px] px-5 py-1.5 md:text-md text-base"
                    disabled={user && user.role === "architect"}
                  >
                    {" "}
                    <option value="">Select Architect</option>
                    {architectData.map((data, index) => (
                      <option value={`${data.id}`} key={index}>
                        {data?.name}
                      </option>
                    ))}
                  </select>
                  {/* <select
                    name="assignedArchitect"
                    value={
                      user && user.role === "architect"
                        ? user.id // Automatically select the current architect's ID
                        : formData.assignedArchitect
                    }
                    disabled={user && user.role === "architect"}
                    onChange={handleInputChange}
                    className="custome-select w-full h-[45px] px-5 py-1.5"
                  >
                    {user && user.role === "architect" ? (
                      <option value={user.id}>{user.name}</option>
                    ) : (
                      <option value="">Select Architect</option>
                    )}
                    {architectData.map((data, index) => (
                      <option value={`${data.id}`}>{data?.name}</option>
                    ))}
                  </select> */}
                </div>
              </div>
            </div>
            <div className="basis-4/12 flex flex-col justify-end items-center mt-8">
              <div className="flex flex-col gap-4">
                <button
                  className="custome-select px-5 py-2 text-l bg-gray-200 inline-flex gap-2 items-center justify-center md:text-md text-base"
                  onClick={() => setIsModalOpen(true)}
                  disabled={
                    mode === "design"
                      ? selectedStatus === "Estimation Confirmed"
                      : selectedStatus === "Ready to Deliver"
                  }
                >
                  {formData.selectedStatus} <IoMdArrowDropdown className="text-xl" />
                </button>
                <button className="primary-btn-active p-2  font-bold text-base md:text-lg" onClick={handleAddImage}>
                  Add Images
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="basis-12/12 p-3">
              {/* <textarea className="custom-textarea" rows="5" cols="20" name="blog">
              Share your knowledge by writing your own blog!
            </textarea> */}
              {fileList.length <= 0 && "No images Added"}
              <Upload
                action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                beforeUpload={() => false}
                multiple
              >
                {fileList.length >= 8 && null}
              </Upload>
              {previewImage && (
                <Image
                  wrapperStyle={{
                    display: "none",
                  }}
                  className="custom-img-wrapper"
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) => !visible && setPreviewImage(""),
                  }}
                  src={previewImage}
                />
              )}
            </div>
          </div>
        </div>
        <div className=" flex justify-center items-center mb-5 md:text-lg text-base">
          {id ? (
            <button onClick={handleUpdate} className="bg-[#996830] text-white p-3 px-16 font-semibold rounded-lg">
               {loading ? <Spin size="small" /> : "Update"}
            </button>
          ) : (
            <button onClick={handleSubmit} className="bg-[#996830] text-white p-3 px-16 font-semibold rounded-lg">
              {loading ? <Spin size="small" /> : "Save"}
            </button>
          )}
        </div>
        {/* Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-gray-950 bg-opacity-50 flex items-center justify-center"
            onClick={() => setIsModalOpen(false)}
          >
            <div className="bg-white rounded-2xl shadow-lg w-48 overflow-hidden p-1">
              <ul>
                {mode === "design" &&
                  designStatuses.map((status) => (
                    <li key={status}>
                      <button
                        className={`w-full text-left bg-white text-[#996830] px-5 py-2  font-medium ${
                          selectedStatus === status ? "cursor-not-allowed bg-gray-100 " : "bg-white hover:bg-gray-100"
                        }`}
                        onClick={() => handleStatusChange(status)}
                        disabled={selectedStatus === status}
                      >
                        {status}
                      </button>
                    </li>
                  ))}
                {mode === "work" &&
                  workStatuses.map((status) => (
                    <li key={status}>
                      <button
                        className={`w-full text-left bg-white text-[#996830] px-5 py-2  font-medium ${
                          selectedStatus === status ? "cursor-not-allowed bg-gray-100 " : "bg-white hover:bg-gray-100"
                        }`}
                        onClick={() => handleStatusChange(status)}
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

export default FormComponent;
