import {Button, Image, message, Modal, Spin, Steps, Upload} from "antd";
import React, {useEffect, useState} from "react";
import {FaArrowLeft} from "react-icons/fa6";
import {IoMdArrowDropdown, IoMdCloudDownload} from "react-icons/io";
import {Link, useNavigate, useParams} from "react-router-dom";
import API_BASE_URL from "../../../config/config";
import {FaCloudUploadAlt, FaRegEdit} from "react-icons/fa";
import {IoCloseCircleOutline} from "react-icons/io5";
import apiClient from "../../../Utiils/axiosInstance ";
import {useUserContext} from "../../../context/UserContext";
import {QuillEditor} from "../../../components";
import {AiOutlinePlus} from "react-icons/ai";

// Convert file to Base64 for preview
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const DesignContent = () => {
  const {id} = useParams();
  const {user} = useUserContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Mood Board");
  const [architectData, setArchitectData] = useState([]);
  const [current, setCurrent] = useState(0);
  const [currentStage, setCurrentStage] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [projectData, setProjectData] = useState(null);
  const [selectedArchitectId, setSelectedArchitectId] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newImages, setNewImages] = useState([]);
  const [premiumText, setPremiumText] = useState("");
  const [luxuryText, setLuxuryText] = useState("");
  const [amount, setAmount] = useState("");
  const [premiumFileList, setPremiumFileList] = useState([]);
  const [luxuryFileList, setLuxuryFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const statuses = [
    "Mood Board",
    "Basic Design",
    "Final Design",
    "Premium/Luxury",
    "Final Estimation",
    "Estimation Confirmed",
  ];
  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/designs/${id}`);
      setProjectData(response.data);
      setSelectedArchitectId(response.data.assignedArchitect);
      setSelectedStatus(response.data.status);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchArchitectData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/architect`);
      if (!response.ok) {
        throw new Error("Failed to fetch architect data");
      }
      const result = await response.json();
      setArchitectData(result);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchProjectData();
    fetchArchitectData();
  }, []);
  useEffect(() => {
    if (projectData) {
      const stagesArray = Object.keys(projectData?.stages)
        .sort()
        .map((key) => projectData.stages[key]);

      // Find the last enabled stage index
      const lastEnabledIndex = stagesArray.reduce((lastIndex, stage, index) => {
        return stage.enabled ? index : lastIndex;
      }, 0);
      setCurrent(lastEnabledIndex);
      setLuxuryText(stagesArray[lastEnabledIndex]?.luxury?.data);
      setPremiumText(stagesArray[lastEnabledIndex]?.premium?.data);
      setAmount(stagesArray[lastEnabledIndex]?.amount);
    }
    const stageData = stagesArray.find((stage) => stage.name === "Premium/Luxury");

    // if (stageData?.premium?.file) {
    //   setPremiumFileList(
    //     stageData.premium.file.map((doc) => ({
    //       uid: doc.id,
    //       name: "premium-estimate.pdf",
    //       status: "done",
    //       url: doc.path,
    //     }))
    //   );
    // }
    if (stageData?.premium?.file?.id) {
      setPremiumFileList([
        {
          uid: stageData?.premium?.file?.id,
          name: "premium-estimate.pdf",
          status: "done",
          url: stageData?.premium?.file?.path,
        },
      ]);
    }

    // if (stageData?.luxury?.file) {
    //   setLuxuryFileList(
    //     stageData.luxury.file.map((doc) => ({
    //       uid: doc.id,
    //       name: "luxury-estimate.pdf",
    //       status: "done",
    //       url: doc.path,
    //     }))
    //   );
    // }
    if (stageData?.luxury?.file?.id) {
      setLuxuryFileList([
        {
          uid: stageData?.luxury?.file?.id,
          name: "luxury-estimate.pdf",
          status: "done",
          url: stageData?.premium?.file?.path,
        },
      ]);
    }
  }, [projectData]);

  const stagesArray = projectData?.stages
    ? Object.keys(projectData?.stages)
        .sort()
        .map((key) => projectData?.stages[key])
    : [];
  const onStepChange = (step) => {
    if (stagesArray[step].enabled) {
      setCurrent(step);
      setLuxuryText(stagesArray[step]?.luxury?.data);
      setPremiumText(stagesArray[step]?.premium?.data);
      // setAmount(stagesArray[step]?.amount);
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    // Ensure file.url is a string before using it
    if (typeof file.url === "string") {
      setPreviewImage(file.url || file.preview);
      setPreviewOpen(true);
    } else {
      console.error("Invalid file URL:", file.url);
      message.error("Unable to preview image");
    }
  };

  const handleUpdate = async (type, status) => {
    const currentStage = stagesArray[current];
    let updatedData = {};
    const formData = new FormData();
    if (type) {
      if (type === "status") {
        formData.append("status", status);
      } else if (type === "architect") {
        formData.append("assignedArchitect", status);
      }
    } else if (["Basic Design", "Mood Board", "Final Design"].includes(currentStage.name)) {
      if (newImages.length === 0) {
        return message.error("No changes made");
      } else {
        newImages.forEach((image) => {
          formData.append("img", image);
        });
      }
      formData.append("stageName", stagesArray[current].name);
    } else {
      if (currentStage.name === "Premium/Luxury") {
        // Append each file in premiumFileList
        premiumFileList.forEach((file) => {
          // Here, we make sure to append the file object correctly
          formData.append("premiumdoc", file);
        });

        // Append each file in luxuryFileList
        luxuryFileList.forEach((file) => {
          formData.append("luxurydoc", file);
        });

        // Append text fields (premium, luxury, stageName) as string values
        formData.append("premium", premiumText);
        formData.append("luxury", luxuryText);
        formData.append("stageName", stagesArray[current].name);
      } else if (currentStage.name === "Final Estimation") {
        formData.append("amount", amount);
        formData.append("stageName", stagesArray[current].name);
      }
    }

    try {
      setLoading(true);

      const response = await apiClient.patch(`/designs/${id}`, formData);
      if (response.status == 200) {
        message.success("Changes saved successfully");
        setSuccessModal(true);

        setNewImages([]);
        fetchProjectData();
      } else {
        throw new Error("Failed to update project");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleRemove = (file) => {
    setSelectedImage(file);
    setDeleteModalOpen(true);
  };
  const handleRemoveNewImage = (index) => {
    setNewImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };
  const confirmDelete = async () => {
    try {
      setLoading(true);
      const response = apiClient(`/images/${selectedImage.uid}`, {
        method: "DELETE",
      });
      const data = response.data;
      if ((await response).status == 200) {
        message.success("Image deleted successfully");
        const updatedStages = [...stagesArray];
        updatedStages[current].images = updatedStages[current].images.filter((img) => img.id !== selectedImage.uid);
        setProjectData({...projectData, stages: updatedStages});
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

  const renderStepContent = (currentStage) => {
    switch (currentStage?.name) {
      case "Mood Board":
      case "Basic Design":
      case "Final Design":
        return (
          <div className="py-4">
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
              {newImages?.map((image, index) => {
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
          </div>
        );
      case "Premium/Luxury":
        return (
          <div className="flex flex-col gap-4 border border-[#996830] rounded-lg p-8">
            <h3 className="md:text-xl text-lg  font-medium"> Premium Estimate :</h3>

            {currentStage?.name === "Premium/Luxury" && <QuillEditor value={premiumText} setValue={setPremiumText} />}
            <div className="flex md:flex-row flex-col md:gap-5 justify-center items-center rounded-lg bg-[#99683033]">
              <h3 className="text-base "> Upload Premium Estimate :</h3>
              <Upload
                listType="text"
                fileList={premiumFileList}
                beforeUpload={(file) => {
                  setPremiumFileList((prevFile) => [...prevFile, file]); // Add new images to the state
                  return false; // Prevent default upload behavior
                }}
                onRemove={(file) => handleRemove(file)}
                accept=".pdf"
              >
                {premiumFileList.length >= 1 ? null : <Button icon={<FaCloudUploadAlt />}>Browse</Button>}
              </Upload>
            </div>

            {/* LUXURY Section */}
            <h3 className="md:text-xl text-lg font-medium"> Luxury Estimate :</h3>

            {currentStage?.name === "Premium/Luxury" && <QuillEditor value={luxuryText} setValue={setLuxuryText} />}
            <div className="flex md:flex-row flex-col md:gap-5 justify-center items-center rounded-lg bg-[#99683033]">
              <h3 className="text-base "> Upload Luxury Estimate :</h3>
              <Upload
                listType="text"
                fileList={luxuryFileList}
                beforeUpload={(file) => {
                  setLuxuryFileList((prevFile) => [...prevFile, file]); // Add new images to the state
                  return false; // Prevent default upload behavior
                }}
                onRemove={(file) => handleRemove(file, "doc")}
                accept=".pdf"
              >
                {luxuryFileList.length >= 1 ? null : <Button icon={<FaCloudUploadAlt />}>Browse</Button>}
              </Upload>
            </div>
          </div>
        );
      case "Final Estimation":
        return (
          <div className="flex flex-col gap-5">
            <h3 className="md:text-xl text-base flex md:flex-row flex-col  gap-3 justify-center items-center">
              Selected Design Model :{" "}
              <span className="font-semibold md:text-xl text-lg">{currentStage?.selectedDesign?.name.toUpperCase()}</span>{" "}
              <a
                href={currentStage?.selectedDesign?.file?.path}
                className="md:text-lg text-base flex items-center gap-2 text-[#996830]"
              >
                Download Estimate <IoMdCloudDownload />
              </a>
            </h3>
            {user.role === "master" && (
              <div className="flex justify-center gap-3 items-center">
                <h2 className="md:text-lg text-base">Enter Final Estimate</h2>
                <input
                  type="number"
                  placeholder="Enter amount"
                  name="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className=" border border-[#996830] rounded-xl p-3 outline-none w-24 md:w-48 md:placeholder:text-lg placeholder:text-base"
                />
              </div>
            )}
          </div>
        );
      case "Estimation Confirmed":
        return (
          <div className="flex flex-col gap-5">
            <h3 className="md:text-xl text-base flex md:flex-row flex-col  gap-3 justify-center items-center">
              Selected Design Model :{" "}
              <span className="font-semibold md:text-xl text-lg ">{currentStage?.selectedDesign?.name.toUpperCase()}</span>{" "}
              <a
                href={currentStage?.selectedDesign?.file?.path}
                className="md:text-lg text-base flex items-center gap-2 text-[#996830] "
              >
                Download Estimate <IoMdCloudDownload />
              </a>
            </h3>
            {user.role === "master" && (
              <div className="flex justify-center gap-3 items-center">
                <h2 className="md:text-lg text-base">Final Estimate</h2>
                <h2 className="md:text-xl text-base font-semibold">{currentStage?.amount}</h2>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
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
      {projectData && (
        <div className="flex flex-col gap-2 lg:pt-6 pt-0">
          <div className="md:my-0 my-5">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex primary-btn-boarded rounded-2 gap-1 px-2 py-2 items-center lg:my-0 my-4"
            >
              <FaArrowLeft className="text-2xl" />
              Go back
            </button>
          </div>
          <div className="bg-[#99683033] min-w-full border flex flex-col lg:gap-0 gap-6 border-[#996830] rounded-lg md:p-8 p-4 ">
            <div className="flex justify-end gap-4 items-center">
              <Link to={`/pannel/editdesign/${id}`}>
                <button>
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
                  <div className="lg:basis-1/4 md:basis-36 basis-52 ">
                    <h2 className="secondary-txt md:text-lg text-base">{projectData?.name}</h2>
                  </div>
                </div>
                <div className="flex flex-row align-middle ">
                  <div className="lg:basis-1/4 md:basis-36 basis-20  flex ">
                    <h2 className="secondary-txt flex align-middle md:text-lg text-base">Email :</h2>
                  </div>
                  <div className="lg:basis-1/4 md:basis-36 basis-52">
                    <h2 className="secondary-txt md:text-lg text-base">{projectData?.email}</h2>
                  </div>
                </div>
                <div className="flex flex-row align-middle ">
                  <div className="lg:basis-1/4 basis-36  flex ">
                    <h2 className="secondary-txt flex align-middle md:text-lg text-base">Phone Number :</h2>
                  </div>
                  <div className="basis-1/4">
                    <h2 className="secondary-txt md:text-lg text-base">{projectData?.phone}</h2>
                  </div>
                </div>
                <div className="flex flex-row align-middle mb-5 md:gap-0 gap-2">
                  <div className="lg:basis-1/4 basis-44 flex ">
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
                      disabled={user?.role === "architect"}
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
                  <p className="text-m">Last updated on : {formatDate(projectData?.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
          {/* Stepper */}
          <div className="flex flex-col gap-10 md:p-20">
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
            <div className=" ">
              {renderStepContent(stagesArray[current])}
              <div className="text-center">
                {["Final Estimation", "Estimation Confirmed"].includes(stagesArray[current].name) ? (
                  user.role === "master" ? (
                    stagesArray[current].name === "Final Estimation" ? (
                      <button
                        onClick={() => handleUpdate(null)}
                        className="md:mt-10 mt-5 bg-[#996833] hover:bg-[#854e1f] text-white md:text-lg text-base font-semibold py-2  md:px-14 px-8 rounded-xl"
                      >
                        SAVE
                      </button>
                    ) : null
                  ) : null
                ) : (
                  <button
                    onClick={() => handleUpdate(null)}
                    className="md:mt-10 mt-5  bg-[#996833] hover:bg-[#854e1f] text-white md:text-lg text-base font-semibold  py-2  md:px-14 px-8  rounded-xl "
                  >
                    SAVE
                  </button>
                )}
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
          {/* Success Modal */}
          {successModal && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <div className="bg-[#996830]/90 p-6 rounded-xl shadow-lg relative lg:w-[30%] md:w-[60%] w-[90%] pb-12">
                <button
                  onClick={() => setSuccessModal(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-black"
                >
                  <IoCloseCircleOutline className="text-white text-xl" />
                </button>
                <div className="flex flex-col gap-4 md:p-10 p-5">
                  <p className="md:text-lg text-base text-white text-center">Design details have been updated successfully.</p>
                </div>
                <div className="text-center">
                  <button
                    onClick={() => setSuccessModal(false)}
                    className="custom-ok-btn px-14 border border-white text-[#996830] font-semibold py-2 rounded-full mt-4"
                  >
                    Ok
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Custom Delete Confirmation Modal */}
          {isDeleteModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <div className="bg-[#996830]/90 p-6 rounded-xl shadow-lg relative lg:w-[30%] md:w-[60%] w-[90%] pb-12">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-black"
                >
                  <IoCloseCircleOutline className="text-white text-xl" />
                </button>
                <div className="flex flex-col gap-4 p-10">
                  <p className="text-lg text-white text-center">Are you sure you want to delete this image?</p>
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
        </div>
      )}
    </Spin>
  );
};

export default DesignContent;
