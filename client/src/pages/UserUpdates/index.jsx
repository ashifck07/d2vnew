import React, {useEffect, useState} from "react";
import ImageView from "../../components/ImageView";
import {useUserContext} from "../../context/UserContext";
import apiClient from "../../Utiils/axiosInstance ";
import {useNavigate, useParams} from "react-router-dom";
import {RiUserLine} from "react-icons/ri";
import {Header} from "antd/es/layout/layout";
import {Col, Spin, Steps,Drawer} from "antd";
import {Logo} from "../../assets/constant";
import {AiOutlineClose} from "react-icons/ai";
import {FaBars} from "react-icons/fa6";
import {DesignApproval, DesignStages, EstimateSelection, FInalEstimation, WorkProgress} from "../../components";
const UserUpdates = () => {
  const {user, logout} = useUserContext();
  const {id} = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [clientData, setClientData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [currentDescription, setCurrentDescription] = useState("");
  const [currentImages, setCurrentImages] = useState([]); // Store images for the selected step

  const fetchCustomerProject = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/customer/${id}`);
      const result = response.data;
      setClientData(result.project);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCustomerProject();
    }
  }, []);
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (clientData) {
      const stagesArray = Object.keys(clientData.stages)
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
      <Spin className="custom-spinner" spinning={loading} tip="Loading...">
      <Header className="ant-header flex items-center justify-between px-2 md:px-12">
      <Col span={10} className="py-3">
        <Logo className="w-28 h-auto sm:w-24 md:w-28 lg:w-32"/>
      </Col>
      <Col className="md:hidden flex items-center">
        <button className="text-2xl focus:outline-none" onClick={toggleMenu}>
          {isMenuOpen ? (
            <AiOutlineClose className="text-[#996830] font-medium" />
          ) : (
            <FaBars className="text-[#996830] font-medium" />
          )}
        </button>
      </Col>
      <Drawer
        placement="right"
        closable={false}
        onClose={toggleMenu}
        visible={isMenuOpen}
        width={260}
      >
        <div className="flex justify-between items-center p-2">
          <button onClick={toggleMenu} className="focus:outline-none">
            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-[#996833]">
              <AiOutlineClose className="text-[#996833] text-xl" />
            </div>
          </button>
          <div></div>
        </div>
        <ul className="flex flex-col p-4 h-60">
          <li className="hover:bg-gray-200 p-2 cursor-pointer flex items-center justify-center">
            <button className="flex items-center justify-center bg-[#996830] text-[#fff] font-bold text-sm md:px-6 md:py-3 px-6 py-3 rounded-lg">
              <RiUserLine className="text-xl mr-1" />
              Logout
            </button>
          </li>
        </ul>
      </Drawer>
      <Col className="hidden md:flex items-center">
        <button className="flex items-center justify-center bg-[#996830] text-[#fff] font-bold text-sm md:px-6 md:py-3 rounded-lg">
          <RiUserLine className="text-xl mr-1" />
          Logout
        </button>
      </Col>
    </Header>
        {clientData && clientData?.type === "work" && <WorkProgress data={clientData} />}
        {clientData && clientData?.type === "design" && <DesignStages data={clientData} />}


      </Spin>
    </>
  );
};

export default UserUpdates;
