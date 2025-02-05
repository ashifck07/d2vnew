import {message, Spin, Steps, Image, Upload} from "antd";
import React, {useEffect, useState} from "react";
import {FaArrowLeft} from "react-icons/fa6";
import {IoMdArrowDropdown} from "react-icons/io";
import {Link, useNavigate} from "react-router-dom";
import API_BASE_URL from "../../../config/config";
import {FaRegEdit} from "react-icons/fa";
import {IoCloseCircleOutline} from "react-icons/io5";
import {useParams} from "react-router-dom";
import "./style.css";
import apiClient from "../../../Utiils/axiosInstance ";
import {useUserContext} from "../../../context/UserContext";

const WorkContent = () => {
  const navigate = useNavigate();
  const {id} = useParams();
  const {user} = useUserContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [workData, setWorkData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Work Started");
  const [architectData, setArchitectData] = useState([]);
  const [current, setCurrent] = useState(0);
  const [successModal, setSuccessModal] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [newImages, setNewImages] = useState([]); // Store new images
  const [currentDescription, setCurrentDescription] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [selectedArchitectId, setSelectedArchitectId] = useState("");

  const statuses = ["Work Started", "Materials Arrived", "Assembly Finished", "Ready to Deliver"];

  const fetchWorkProgress = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/workProgress/${id}`);
      const data = response.data;
      if (data.success) {
        console.log("data", data.project);
        setWorkData(data.project);
        setSelectedStatus(data.project.status);
        setSelectedArchitectId(data.project.assignedArchitect);
      } else {
        console.error("Error:", data.message || "Failed to fetch work progress");
      }
    } catch (error) {
      console.error("Error fetching work progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (type, status) => {
    const formData = new FormData();
    if (type === "status") {
      formData.append("status", status);
    } else if (type === "architect") {
      formData.append("assignedArchitect", status);
    } else {
      if (!currentDescription && newImages.length === 0) {
        message.warning("No changes made to save");
        return;
      }

      if (currentDescription) {
        formData.append("description", currentDescription);
      }

      // Add new images to form data
      newImages.forEach((image) => {
        formData.append("img", image);
      });
      formData.append("stageName", stagesArray[current].name);
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });
    }
    try {
      setLoading(true);
      const response = await apiClient.patch(`/workProgress/${id}`, formData);

      const data = response.data;
      if (data.success) {
        message.success("Changes saved successfully");
        setSuccessModal(true);
        // Update local state with the new description and uploaded images
        // const updatedStages = [...stagesArray];
        // updatedStages[current].description = currentDescription; // Update description in the stage
        // updatedStages[current].images.push(...data.uploadedImages); // Add newly uploaded images to the stage
        // Update the work data state
        // setWorkData({...workData, stages: updatedStages});
        setNewImages([]);
        fetchWorkProgress();
      } else {
        message.error("Failed to save changes");
      }
    } catch (error) {
      message.error("Error saving changes");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      const response = apiClient(`/images/${selectedImage.uid}`, {
        method: "DELETE",
      });
      const data = response.data;
      if (data.success) {
        message.success("Image deleted successfully");
        const updatedStages = [...stagesArray];
        updatedStages[current].images = updatedStages[current].images.filter((img) => img.id !== selectedImage.uid);
        setWorkData({...workData, stages: updatedStages});
      } else {
        message.error("Failed to delete image");
      }
    } catch (error) {
      message.error("Error deleting image");
      console.error("Error:", error);
    } finally {
      setDeleteModalOpen(false);
      setLoading(false);
    }
  };
  const fetchAllArchitect = async () => {
    try {
      setLoading(true);
      const response = await apiClient(`/architect`);
      const result = await response.data;
      setArchitectData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllArchitect();
    fetchWorkProgress();
  }, []);

  useEffect(() => {
    if (workData) {
      const stagesArray = Object.keys(workData.stages)
        .sort()
        .map((key) => workData.stages[key]);

      // Find the last enabled stage index
      const lastEnabledIndex = stagesArray.reduce((lastIndex, stage, index) => {
        return stage.enabled ? index : lastIndex;
      }, 0);
      setCurrentDescription(stagesArray[lastEnabledIndex]?.description);
      setCurrent(lastEnabledIndex);
    }
  }, [workData]);
  const stagesArray = workData?.stages
    ? Object.keys(workData.stages)
        .sort()
        .map((key) => workData.stages[key])
    : [];
  const onStepChange = (step) => {
    //logic for customer login

    // if (stagesArray[step]?.enabled) {
    //   setCurrent(step);
    // }
    setCurrent(step);
    setCurrentDescription(stagesArray[step]?.description || "");
  };

  const handleDescriptionChange = (e) => {
    setCurrentDescription(e.target.value);
  };
  const handlePreview = async (file) => {
    setPreviewImage(file.url || file.thumbUrl);
    setPreviewOpen(true);
  };

  const handleRemove = (file) => {
    setSelectedImage(file);
    setDeleteModalOpen(true);
  };
  const handleRemoveNewImage = (index) => {
    setNewImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };
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
      <div className="flex flex-col gap-2 pt-6">
        <div className="md:my-0 my-5">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex primary-btn-boarded rounded-2 gap-1 px-2 py-2 items-center md:my-0 my-3"
          >
            <FaArrowLeft className="text-2xl" />
            Go back
          </button>
        </div>
        {workData ? (
          <>
            <div className="bg-[#99683033] min-w-full border flex flex-col lg:gap-0 gap-6 border-[#996830] rounded-lg md:p-8 p-4 ">
              <div className="flex justify-end gap-4 items-center">
                <Link to={`/pannel/editwork/${id}`}>
                  <button onClick={() => console.log("ldskf")}>
                    <FaRegEdit className="text-xl text-[#996830]" />
                  </button>
                </Link>
              </div>
              <div className="flex md:flex-row flex-col">
                <div className="basis-8/12 flex flex-col gap-4">
                  <div className="flex flex-row align-middle ">
                    <div className="lg:basis-1/4 md:basis-36 basis-20  flex ">
                      <h2 className="secondary-txt flex align-middle md:text-lg text-base">Name :</h2>
                    </div>
                    <div className="lg:basis-1/4 md:basis-36 basis-52">
                      <h2 className="secondary-txt md:text-lg text-base">{workData?.name}</h2>
                    </div>
                  </div>
                  <div className="flex flex-row align-middle ">
                    <div className="lg:basis-1/4 md:basis-36 basis-20  flex ">
                      <h2 className="secondary-txt flex align-middle md:text-lg text-base">Email :</h2>
                    </div>
                    <div className="lg:basis-1/4 md:basis-36 basis-52">
                      <h2 className="secondary-txt md:text-lg text-base">{workData?.email}</h2>
                    </div>
                  </div>
                  <div className="flex flex-row align-middle ">
                    <div className="lg:basis-1/4 basis-36  flex ">
                      <h2 className="secondary-txt flex align-middle md:text-lg text-base">Phone Number :</h2>
                    </div>
                    <div className="basis-1/4">
                      <h2 className="secondary-txt md:text-lg text-base">{workData?.phone}</h2>
                    </div>
                  </div>
                  <div className="flex flex-row align-middle mb-5 md:gap-0 gap-2">
                    <div className="lg:basis-1/4 basis-44  flex ">
                      <h2 className="secondary-txt flex items-center md:text-lg text-base">Assign Architect :</h2>
                    </div>
                    <div className="basis-1/4">
                      <select
                        className="custome-select   px-5 py-1.5"
                        value={selectedArchitectId}
                        onChange={(e) => handleUpdate("architect", e.target.value)}
                        name="assignedArchitect"
                        id="assignedArchitect"
                        // value={selectedArchitectId}
                        disabled={user.role === "architect"}
                        // disabled
                      >
                        {" "}
                        <option value="" disabled>
                          Select Architect
                        </option>
                        {architectData?.map((data, index) => (
                          <option value={`${data.id}`} key={index}>
                            {data?.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="basis-4/12 flex flex-col justify-center items-center">
                  <div className="flex flex-col gap-4">
                    <button
                      className="custome-select px-5 py-1.5 bg-gray-200 inline-flex gap-2 items-center justify-center"
                      onClick={() => setIsModalOpen(true)}
                      // disabled={selectedStatus === "CLOSED"}
                    >
                      {selectedStatus}
                      <IoMdArrowDropdown className="text-2xl" />
                    </button>
                    <p className="text-m">Last updated on : {formatDate(workData?.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-10 md:p-20 ">
              {/* Stepper Component */}
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
                <div className="py-4">
                  <textarea
                    className="w-full border border-[#996830] outline-none rounded-lg p-6"
                    value={currentDescription} // Bind to local state
                    rows="5"
                    cols="20"
                    onChange={handleDescriptionChange}
                    name="blog"
                  >
                    Share your knowledge by writing your own blog!
                  </textarea>
                </div>
                <p className="text-lg text-[#444444] font-medium py-4">Add/Edit Images</p>

                <div className="lg:flex gap-2 mt-4 border border-[#996830] rounded-lg p-8 grid md:grid-cols-3 grid-cols-2 ">
                  {stagesArray[current].images?.map((img, index) => {
                    const file = {
                      uid: img.id,
                      name: `image-${index + 1}.jpg`,
                      status: "done",
                      url: img.path,
                    };

                    const fileList = [file];

                    return (
                      <Upload
                        key={index}
                        listType="picture-card"
                        fileList={fileList}
                        beforeUpload={() => false}
                        onPreview={handlePreview}
                        onRemove={() => handleRemove(file)}
                        multiple
                      />
                    );
                  })}
                  {newImages.map((image, index) => {
                    const file = {
                      uid: image.uid || index,
                      name: image.name,
                      status: "done",
                      url: URL.createObjectURL(image),
                    };

                    const fileList = [file];

                    return (
                      <Upload
                        key={`new-${index}`}
                        listType="picture-card"
                        fileList={fileList}
                        beforeUpload={() => false}
                        onPreview={handlePreview}
                        onRemove={() => handleRemoveNewImage(index)}
                        multiple
                      />
                    );
                  })}
                  <Upload
                    listType="picture-card"
                    beforeUpload={(file) => {
                      setNewImages((prevImages) => [...prevImages, file]); // Add new images to the state
                      return false; // Prevent default upload behavior
                    }}
                    multiple
                    showUploadList={false}
                  >
                    <button
                      style={{
                        border: 0,
                        background: "none",
                      }}
                      type="button"
                    >
                      +
                      <div
                        style={{
                          marginTop: 8,
                        }}
                      >
                        Upload
                      </div>
                    </button>
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
                <div className="text-center ">
                  <button
                    onClick={handleUpdate}
                    className="my-10 bg-[#996833] hover:bg-[#854e1f] text-white md:text-lg text-base font-semibold py-2 md:px-4  px-3 rounded-xl w-[170px] "
                  >
                    SAVE
                  </button>
                </div>
              </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
              <div
                className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
                onClick={() => setIsModalOpen(false)}
              >
                <div className="bg-white rounded-2xl shadow-lg w-44 overflow-hidden">
                  <ul className="py-1.5">
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
            {successModal && (
              <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <div className="bg-[#996830]/90 p-6 rounded-xl shadow-lg relative lg:w-[30%] md:w-[60%] w-[90%] pb-12">
                  <button
                    onClick={() => setSuccessModal(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-black"
                  >
                    <IoCloseCircleOutline className="text-white text-xl" />
                  </button>
                  <div className="flex flex-col gap-4 p-10">
                    <p className="md:text-lg text-base text-white text-center">
                      Work Progress details have been updated successfully.
                    </p>
                  </div>
                  <div className="text-center">
                    <button
                      onClick={() => setSuccessModal(false)}
                      className="custom-ok-btn px-14 border border-white text-[#996830] font-semibold py-2 rounded-xl"
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* Custom Delete Confirmation Modal */}
            {isDeleteModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <div className="bg-[#996830]/90 p-6 rounded-xl shadow-lg relative lg:w-[30%] md:w-[60%]  w-[90%] pb-12">
                  <button
                    onClick={() => setDeleteModalOpen(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-black"
                  >
                    <IoCloseCircleOutline className="text-white text-xl" />
                  </button>
                  <div className="flex flex-col gap-4 p-10">
                    <p className="md:text-lg text-base text-white text-center">Are you sure you want to delete this image?</p>
                  </div>
                  <div className="text-center flex gap-4 justify-center">
                    <button
                      onClick={confirmDelete}
                      className=" px-8 bg-[#996830] border text-white font-semibold py-2 rounded-xl"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setDeleteModalOpen(false)}
                      className="custom-ok-btn px-8 border border-white text-[#996830] font-semibold py-2 rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
    </Spin>
  );
};

export default WorkContent;
