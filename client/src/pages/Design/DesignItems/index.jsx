import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {HiPlus} from "react-icons/hi";
import {Pageitems} from "../../../components";
import {Spin} from "antd";
import apiClient from "../../../Utiils/axiosInstance ";

const Design = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [designData, setdesignData] = useState([]);
  const fetchDesignData = async () => {
    setLoading(true);
    try {
      const response = await apiClient(`/designs/`);
      const data = response.data;
      setdesignData(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDesignData();
  }, []);
  return (
    <>
      <Spin className="custom-spinner" spinning={loading} tip="Loading...">
        <div className="flex flex-col gap-4  pt-6">
          <div className="text-right">
            <Link to="/pannel/add/design">
              <button
                // onClick={() => navigate(-1)}
                className="inline-flex primary-btn-active px-8 py-0.5 text-lg font-bold items-center gap-2"
              >
                <HiPlus className="text-xl" />
                Add
              </button>
            </Link>
          </div>
          {designData.map((data, index) => (
            <Link to={`/pannel/designitem/${data.id}`} index={index} >
              <Pageitems
                data={data}
                type="design"
                className="transition duration-500 ease-in-out transform opacity-0 translate-y-10 animate-slide-up"
              />
            </Link>
          ))}
        </div>
      </Spin>
    </>
  );
};

export default Design;
