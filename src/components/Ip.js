// src/components/Admin.js
import React, { useContext, useEffect, useState } from "react";
import "./admin.css";
import axios from "axios";
import Modal from "react-modal";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { AuthContext } from "./context/AuthContext";
import Show from "./Show";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-confirm-alert/src/react-confirm-alert.css";
import PerPageDropdown from "./PerPageDropDown";

const Ip = ({ role }) => {
  const [tasks, setTasks] = useState([]); // Replace 'users' with 'tasks'
  const [lengthofIp, setLengthOfIp] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage, setContactsPerPage] = useState(50);

  const navigate = useNavigate();
  const { auth, setAuth, todo, setTodo, tasklength, setTasklength } =
    useContext(AuthContext);


  const headers = {
    Authorization: auth.token,
  };

  // Example usage:
  // Outputs: "2023-09-26 14:30:00"

  const url = process.env.REACT_APP_API_URL;
  // Rest of your code...

  const filteredContacts = tasks.filter((contact) => {
    const searchText = searchQuery.toLowerCase();

    return contact?.ipAddress?.toLowerCase().includes(searchText);
  });

  const getTasks = async () => {
    try {
      const response = await axios.get(`${url}api/admin/getips`, { headers });
      const today = new Date();
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

      setTasks(response.data.userIps);
      setLengthOfIp(response.data.userIps.length);
    } catch (error) {
      
      // localStorage.removeItem('token');
      // setAuth(null);
      // navigate('/');
    }
  };

  const handleItemsPerPageChange = (e) => {
    setContactsPerPage(parseInt(e.target.value, 10));
    // You can also update your data fetching or rendering logic here
  };

  useEffect(() => {
    getTasks(); // Replace 'getUsers' with 'getTasks'
    // Rest of your code...
  }, []);

  const formatDate = (dateTimeString) => {
    if (!dateTimeString) {
      return ""; // Handle cases where the date-time string is empty or undefined
    }

    const dateTime = new Date(dateTimeString);
    const year = dateTime.getFullYear();
    const month = String(dateTime.getMonth() + 1).padStart(2, "0");
    const day = String(dateTime.getDate()).padStart(2, "0");
    const hours = String(dateTime.getHours()).padStart(2, "0");
    const minutes = String(dateTime.getMinutes()).padStart(2, "0");

    // Return date in "YYYY-MM-DDTHH:MM" format
    return dateTimeString
      .replace("T", " ")
      .replace(/\.\d+/, "")
      .replace("Z", "");
  };

  // Rest of your code...
  // Adjust the number of contacts per page as needed
  const contactsToDisplay = filteredContacts.slice(
    (currentPage - 1) * contactsPerPage,
    currentPage * contactsPerPage
  );
  // Adjust the number of contacts per page as needed
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  return (
    <div className="add_property_btn">
      <div className="inner-pages-top">
        <h3>Website Visitors ({lengthofIp})</h3>
        <div className="add_user_btn"></div>
        <div className="search-group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search here"
          />
          <img src="/search.svg" />
        </div>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>IP Address</th>
              <th>Date</th>

              {/* <th>Contact</th> */}
              {/* <th>Family Member</th> */}
              {/* <th>Owner</th>
<th>Active Agent</th> */}

              {/* Include other fields as needed */}
            </tr>
          </thead>
          <tbody>
            {contactsToDisplay?.map((task, index) => (
              <>
                <tr key={task.id}>
                  <td>{task.ipAddress}</td>
                  <td>{formatDate(task.time)}</td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={currentPage === index + 1 ? "active" : ""}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
      {contactsToDisplay.length == 0 && (
        <p className="no-data">No data Found</p>
      )}
    </div>
  );
};

export default Ip;
