import React, {useEffect, useState} from "react";
import ImageView from "../ImageView";
import {useUserContext} from "../../context/UserContext";
import apiClient from "../../Utiils/axiosInstance ";
import {useParams} from "react-router-dom";

const UsersideUpdate = () => {
  const {user} = useUserContext();
  const {id} = useParams();
  const [loading, setLoading] = useState(true);
  const [clientData, setClientData] = useState();
  const fetchCustomerProject = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/customer/${id}`);
      const result = response.data;
      setClientData(result.project); // Corrected the data path
      console.log(result, "data"); // Logging the correct response object
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
      console.log(clientData);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCustomerProject();
    }
  }, []);

  return (
    // <>
    //   <ImageView data={clientData} />
    //   <DesignApproval />
    //   <EstimateSelection />
    //   <FinalEstimation />
    //   <WorkPrograss />
    // </>
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ImageView data={clientData} />
          {/* <DesignApproval />
          <EstimateSelection />
          <FinalEstimation />
          <WorkPrograss /> */}
        </>
      )}
    </>
  );
};

export default UsersideUpdate;
