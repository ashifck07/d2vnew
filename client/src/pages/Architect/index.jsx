import React, {useEffect, useState} from "react";
import {HiPlus} from "react-icons/hi";
import {FaRegEdit} from "react-icons/fa";
import {IoCloseCircleOutline} from "react-icons/io5";
import {MdOutlineDeleteForever} from "react-icons/md";
import {message, Spin} from "antd";
import apiClient from "../../Utiils/axiosInstance ";

const Architect = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [formData, setFormData] = useState({name: "", phone: ""});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [architectToDelete, setArchitectToDelete] = useState(null);
  const [currentArchitect, setCurrentArchitect] = useState(null);

  const fetchArchitects = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/architect`);
      if (response.status !== 200) {
        throw new Error(`Failed to fetch data: Status ${response.status}`);
      }
      const result = response.data;

      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchitects();
  }, []);

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
  };

  const handleSubmit = async () => {
    try {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.phone)) {
        message.error("Please enter a valid 10-digit phone number.");
        return;
      }
      if (currentArchitect) {
        // Editing existing architect
        const response = await apiClient.put(`/architect/${currentArchitect.id}`, formData);
        if (response.status === 200) {
          message.success("Architect updated successfully");
        } else {
          message.error(`Failed to update architect: ${response.statusText}`);
        }
      } else {
        // Adding a new architect

        const response = await apiClient.post(`/architect`, formData);
        if (response.status === 201) {
          message.success("Architect added successfully");
        } else {
          message.error(`${response.statusText}`);
        }
      }
      fetchArchitects();
      setIsModalOpen(false);
      setFormData({name: "", phone: ""});
      setSuccessModal(true);
    } catch (error) {
      console.error("Error during architect submission:", error);
      message.error(`${error.response.data.message}`);
    } finally {
      setCurrentArchitect(null);
    }
  };

  const handleEdit = (architect) => {
    setCurrentArchitect(architect);
    setFormData({name: architect.name, phone: architect.phone});
    setIsModalOpen(true);
  };
  const openDeleteModal = (architect) => {
    setArchitectToDelete(architect);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setArchitectToDelete(null);
  };
  const handleDelete = async () => {
    try {
      const response = await apiClient.delete(`/architect/${architectToDelete.id}`);
      if (response.status === 200) {
        message.success("Architect deleted successfully");
        fetchArchitects();
      } else {
        message.error(`Failed to delete architect: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error during architect deletion:", error);
      message.error("An error occurred while deleting architect details");
    } finally {
      setIsDeleteModalOpen(false);
      setArchitectToDelete(null);
    }
  };

  const ArchiteCard = ({data}) => (
    <div className="basis-6/12 bg-[#99683033] border border-[#996830] rounded-lg p-5 pb-10 flex flex-col gap-3">
      <div className="flex justify-end gap-4 items-center">
        <button onClick={() => handleEdit(data)}>
          <FaRegEdit className="text-lg text-[#996830]" />
        </button>
        <button onClick={() => openDeleteModal(data)}>
          <MdOutlineDeleteForever className="text-xl text-[#996830]" />
        </button>
      </div>
      <div className="flex flex-row align-middle">
        <div className="basis-4/12 flex">
          <h2 className="secondary-txt flex align-middle md:text-lg text-base"> Name :</h2>
        </div>
        <div className="basis-6/12">
          <h2 className="secondary-txt md:text-lg text-base">{data.name}</h2>
        </div>
      </div>
      <div className="flex flex-row align-middle gap-4 md:gap-2">
        <div className="lg:basis-4/12 basis-44 flex">
          <h2 className="secondary-txt flex align-middle md:text-lg text-base">Phone Number :</h2>
        </div>
        <div className="basis-6/12 ">
          <h2 className="secondary-txt md:text-lg text-base">{data.phone}</h2>
        </div>
      </div>
    </div>
  );

  return (
 // <Spin className="custom-spinner" spinning={loading} tip="Loading...">
    <div className="flex flex-col gap-4 lg:pt-6 pt-0">
      <div className="text-right">
        <button
          className="inline-flex add-btn md:px-6 py-1.5 px-3 text-lg items-center gap-2 md:my-0 my-4"
          onClick={() => {
            setCurrentArchitect(null);
            setFormData({name: "", phone: ""});
            setIsModalOpen(true);
          }}
        >
          <HiPlus className="text-base" />
          Add Architect
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.map((data, index) => (
          <ArchiteCard data={data} key={index} />
        ))}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-[#996830]/80 md:p-6 p-3 rounded-xl shadow-lg relative lg:w-2/5 md:pb-12 py-6">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <IoCloseCircleOutline className="text-white text-xl" />
            </button>
            <div className="flex flex-col gap-4 lg:p-10   mt-5 md:mt-0">
              <div className="flex flex-row md:gap-0 gap-5  items-center justify-center align-middle">
                <div className="basis-4/12 flex">
                  <label className="block text-sm text-white mb-1 ">Name :</label>
                </div>
                <div className="basis-6/12">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-[#996830] custom-pannel-input"
                  />
                </div>
              </div>
              <div className="flex flex-row lg:gap-0 gap-4 items-center justify-center align-middle">
                <div className="lg:basis-4/12 flex">
                  <label className="block text-sm text-white mb-1">Phone Number :</label>
                </div>
                <div className="basis-6/12">
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-[#996830] custom-pannel-input"
                  />
                </div>
              </div>
            </div>
            <div className="text-center mt-5 lg:mt-0">
              <button
                onClick={handleSubmit}
                className="bg-[#996830] px-8 border border-white text-white font-semibold py-2 rounded-xl"
              >
                {currentArchitect ? "Update Architect" : "Add Architect"}
              </button>
            </div>
          </div>
        </div>
      )}
      {successModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center px-5">
          <div className="bg-[#996830]/80 md:p-6 p-3 rounded-xl shadow-lg relative lg:w-[30%] md:pb-12 pb-6">
            <button
              onClick={() => setSuccessModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <IoCloseCircleOutline className="text-white text-xl" />
            </button>
            <div className="flex flex-col gap-4 md:p-10 p-5">
              <p className="md:text-lg txt-base text-white text-center">Architect details have been updated successfully.</p>
            </div>
            <div className="text-center">
              <button
                onClick={() => setSuccessModal(false)}
                className="custom-ok-btn md:px-14 px-7 border border-white text-[#996830] font-semibold py-2 rounded-xl"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center px-5">
          <div className="bg-[#996830]/80 md:p-6 p-3 rounded-xl shadow-lg relative lg:w-[30%] md:pb-12 pb-6">
            <button onClick={closeDeleteModal} className="absolute top-3 right-3 text-gray-500 hover:text-black">
              <IoCloseCircleOutline className="text-white text-xl" />
            </button>

            <div className="flex flex-col md:gap-4 md:p-10 p-5">
              <p className="md:text-lg text-base text-white text-center">Are you sure you want to delete this architect?</p>
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="md:px-14 px-7 border border-white text-white font-semibold py-2 rounded-xl bg-[#996830]"
              >
                Yes
              </button>
              <button
                onClick={closeDeleteModal}
                className="md:px-14 px-7 border border-white text-[#996830] font-semibold py-2 rounded-xl bg-white hover:bg-gray-200"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    // </Spin>
  );
};

export default Architect;
