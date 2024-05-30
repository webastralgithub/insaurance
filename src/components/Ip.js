// src/components/Admin.js
import React, { useContext, useEffect, useState, useRef } from "react";
import "./admin.css";
import axios from "axios";
import "react-confirm-alert/src/react-confirm-alert.css";
import { AuthContext } from "./context/AuthContext";
import { Circles } from 'react-loader-spinner'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faXmark } from "@fortawesome/free-solid-svg-icons";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const Ip = ({ role }) => {
  const [dataLoader, setDataLoader] = useState(false)
  const [buttonActive, setButtonActive] = useState(1)
  const { auth } = useContext(AuthContext);
  const headers = {
    Authorization: auth.token,
  };
  const url = process.env.REACT_APP_API_URL;

  let searchRef = useRef()
  const [userIps, setuserIps] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState("");
  const [uniqueIpCount, setuniqueIpCount] = useState()

  const getTasks = async () => {
    setDataLoader(true)
    let currPage
    if (searchRef.current.value) {
      currPage = ''
    } else {
      currPage = currentPage
    }
    try {
      const response = await axios.get(`${url}api/admin/getip?page=${currPage}&search=${searchRef.current.value}`, { headers });
      setuserIps(response?.data?.userIps)
      setTotalPages(response?.data?.totalPages)
      setuniqueIpCount(response?.data?.uniqueIpCount)
      setDataLoader(false)
    } catch (error) {
      setDataLoader(false)
      console.error("Server is busy");
    }
  };
  useEffect(() => {
    getTasks();
  }, [currentPage]);


  const clearSearch = () => {
    setButtonActive(1)
    searchRef.current.value = ""
    getTasks();
  };
  const handleKeyDown = () => {
    setButtonActive(2)
    getTasks();
  };

  const handleKeyDownEnter = (event) => {
    if (event.key === 'Enter') {
        setButtonActive(2)
        getTasks()
    }
};

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers.map((number) => (
      <button className={currentPage === number ? "active" : ""}
        key={number} onClick={() => handlePageChange(number)}>{number}</button>
    ));
  };



  // const getTasks = async () => {
  //   try {
  //     const response = await axios.get(`${url}api/admin/getips`, { headers });
  //     const today = new Date();
  //     const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  //     setTasks(response?.data?.userIps);
  //     setLengthOfIp(response?.data.userIps?.length);
  //   } catch (error) {
  //     console.error("error", error)

  //   }
  // };

  const formatDate = (dateTimeString) => {
    if (!dateTimeString) {
      return ""; // Handle cases where the date-time string is empty or undefined
    }

    const dateTime = new Date(dateTimeString);
    const year = dateTime?.getFullYear();
    const month = String(dateTime?.getMonth() + 1).padStart(2, "0");
    const day = String(dateTime?.getDate()).padStart(2, "0");
    const hours = String(dateTime?.getHours()).padStart(2, "0");
    const minutes = String(dateTime?.getMinutes()).padStart(2, "0");

    // Return date in "YYYY-MM-DDTHH:MM" format
    return dateTimeString
      .replace("T", " ")
      .replace(/\.\d+/, "")
      .replace("Z", "");
  };


  return (
    <div className="add_property_btn">
      <div className="inner-pages-top">
        <h3>Website Visitors ({uniqueIpCount})</h3>
        <div className="add_user_btn"></div>
        <div className="search-group">
          <input
            type="text"
            onKeyDown={handleKeyDownEnter}
            ref={searchRef}
            placeholder="Search here"
          />
          {/* {buttonActive == 1 && <img src="/search.svg" onClick={handleKeyDown} />}
          {buttonActive == 2 && <FontAwesomeIcon icon={faXmark} onClick={clearSearch}/>} */}

        </div>
        <div className="add_user_btn">
          <button onClick={handleKeyDown}>Search</button>
        </div>
      </div>
      <div className="table-container">
      {dataLoader ?  
       ( <div className="sekelton-class" style={{ backgroundColor: 'white' }} >
          <Skeleton height={50} count={10} style={{ margin: '5px 0' }} />
        </div>)

        :(
        <table>
          <thead>
            <tr>
              <th>IP Address</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <Circles

              height="100"
              width="100%"
              color="#004382"
              ariaLabel="circles-loading"
              wrapperStyle={{
                height: "100%",
                width: "100%",
                position: "absolute",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9,
                background: "#00000082"
              }}
              wrapperClass=""
              visible={dataLoader}
            />
            {userIps && userIps?.map((task, index) => (
              <>
                <tr key={task?.id}>
                  <td>{task?.ipAddress}</td>
                  <td>{formatDate(task?.time)}</td>
                </tr>
              </>
            ))}
          </tbody>
        </table>)}
        {userIps?.length > 0 && (
          <div className="pagination">
            {renderPageNumbers()}
          </div>
        )}

      </div>
      {userIps.length == 0 && !dataLoader && <p className="no-data">No data Found</p>}
    </div>
  );
};

export default Ip;
