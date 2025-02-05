
import React, {useEffect, useState} from "react";
import "./style.css";
import {Pageitems} from "../../../components";
import {Link} from "react-router-dom";
import {Spin} from "antd";
import apiClient from "../../../Utiils/axiosInstance ";
import {useUserContext} from "../../../context/UserContext";
 import ReactPaginate from "react-paginate";
 import { MdArrowForwardIos } from "react-icons/md";
 import { MdArrowBackIos } from "react-icons/md";
const Leads = () => {
  const [leadsData, setLeadsData] = useState([]); 
  const [currentPageData, setCurrentPageData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageCount, setPageCount] = useState(0); 
  const [currentPage, setCurrentPage] = useState(0); // Current page number
  const itemsPerPage = 10; // Number of items per page
  const { user } = useUserContext(); // User context for authentication

  // Fetch leads data from the API
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/leads");
      if (response.status !== 200) {
        throw new Error(`Failed to fetch data: Status ${response.status}`);
      }
      setLeadsData(response.data || []);
      setPageCount(Math.ceil(response.data.length / itemsPerPage));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageClick = (event) => {
    const newPage = event.selected;
    const offset = newPage * itemsPerPage;
    setCurrentPageData(leadsData.slice(offset, offset + itemsPerPage));
    setCurrentPage(newPage);
  };

  // Initial data fetch and set up first page
  useEffect(() => {
    fetchLeads();
  }, [user]);

  // Update current page data when leadsData changes
  useEffect(() => {
    if (leadsData.length > 0) {
      const offset = currentPage * itemsPerPage;
      setCurrentPageData(leadsData.slice(offset, offset + itemsPerPage));
    }
  }, [leadsData, currentPage]);

  return (
    <>
      <Spin className="custom-spinner" spinning={loading} tip="Loading...">
        <div className="flex flex-col pt-6 gap-4">
          {/* Map current page data */}
          {currentPageData.length > 0 ? (
            currentPageData.map((data, index) => (
              <Link to={`/pannel/leaditem/${data.id}`} key={index}>
                <Pageitems
                  data={data}
                  type="leads"
                  className="transition duration-500 ease-in-out transform opacity-0 translate-y-10 animate-slide-up"
                />
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500">No leads available.</p>
          )}
        </div>
      </Spin>

      {/* Render pagination */}
      {!loading && (
        <ReactPaginate
          previousLabel={<MdArrowBackIos  /> }
          nextLabel={<MdArrowForwardIos />}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
          previousClassName={"previous"}
          nextClassName={"next"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
        />
      )}

      {/* Render error message */}
      {error && <p className="text-red-500 text-center">{error}</p>}
    </>
  );
};

export default Leads;
