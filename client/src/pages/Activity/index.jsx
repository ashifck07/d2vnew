import {notification, Spin} from "antd";
import React, {useEffect, useState} from "react";
import apiClient from "../../Utiils/axiosInstance ";

const Activity = () => {
  const [notificationData, setNotificationData] = useState([]);
  const [loading, setLoading] = useState(false);

  // const notificationData = [
  //   {
  //     data: "Jeevan changed Project 1432 Design Status from “Basic Design” to “Final Design”.",
  //     updatedat: "09:00 pm, 03 Oct 2024",
  //   },
  //   {
  //     data: "Jeevan changed Project 1432 Design Status from “Basic Design” to “Final Design”.",
  //     updatedat: "09:00 pm, 03 Oct 2024",
  //   },
  //   {
  //     data: "Jeevan changed Project 1432 Design Status from “Basic Design” to “Final Design”.",
  //     updatedat: "09:00 pm, 03 Oct 2024",
  //   },
  // ];
  const fetchnotificationData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/activityLog/notification`);
      const result = await response.data;

      setNotificationData(result.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchnotificationData();
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
      <div className=" flex flex-col gap-4 md:py-6 py-4">
        {notificationData?.map((notification, index) => (
          <div key={index} className="bg-[#99683033] min-w-full border border-[#996830] rounded-lg p-4">
            <div className="md:text-lg text-base">{notification?.message}</div>
            <div className="text-end text-[rgba(68,68,68,1)]">{formatDate(notification?.createdAt)}</div>
          </div>
        ))}
      </div>
    </Spin>
  );
};

export default Activity;
