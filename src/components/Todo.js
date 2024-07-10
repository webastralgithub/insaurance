// src/components/Admin.js
import React, { useContext, useEffect, useState, useRef } from "react";
import "./admin.css";
import axios from "axios";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { AuthContext } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-confirm-alert/src/react-confirm-alert.css';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const TodoList = ({ role }) => {
  const url = process.env.REACT_APP_API_URL;
  const [dataLoader, setDataLoader] = useState(false)
  const [buttonActive, setButtonActive] = useState(1)
  const [tasks, setTasks] = useState([]);
  const [taskCount, setTaskCount] = useState()
  const [totalPagess, setTotalPagess] = useState();
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [type, setType] = useState("today")
  let searchRef = useRef()
  const navigate = useNavigate();
  const { auth, setAuth, todo, setTodo, tasklength, setTasklength } = useContext(AuthContext);
  const headers = {
    Authorization: auth.token,
  };



  const formatDate = (dateTimeString) => {
    if (!dateTimeString) {
      return "";
    }
    
    const dateTime = new Date(dateTimeString);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    };
    return dateTime.toLocaleString('en-US', options);
  };

  const getTasks = async () => {
    setDataLoader(true)
    let currPage
    if (searchRef.current.value) {
      currPage = ''
    } else {
      currPage = currentPage
    }

    try {
      const response = await axios.get(`${url}api/todo?page=${currPage}&&search=${searchRef.current.value}&&type=${type}`, { headers });
      setTasks(response.data.todo)
      setTaskCount(response?.data)
      setTotalPagess(response.data.totalPages);
      setCurrentPage(response.data?.currentPage)
      setDataLoader(false)
    } catch (error) {
      setDataLoader(false)
      console.error(error)
    }
  };

  useEffect(() => {
    getTasks();
  }, [currentPage, type, setType]);

  const handleKeyDown = () => {
    setButtonActive(2)
    getTasks()
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPagess; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers.map((number) => (
      <button className={currentPage == number ? "active" : ""}
        key={number} onClick={() => handlePageChange(number)}>{number}</button>
    ));
  };

  const handleMarkAsread = (status, id) => {
    confirmAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to Delete Task?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => changeStatus(status, id),

        },
        {
          label: 'No',
          onClick: () => { },
        },
      ],
    });
  }

  const changeStatus = async (status, id) => {
    try {
      const response = await axios.put(`${url}api/todo/${id}`,
        { IsRead: status },
        { headers });
      getTasks()
      setTasklength(tasklength - 1)
      toast.success("Task Deleted sucessfully")
    } catch (error) {
      console.error("error")
    }

  }

  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) {
      return ''
    }
    return `+1 (${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
  };

  const handleKeyDownEnter = (event) => {
    if (event.key === 'Enter') {
      setButtonActive(2)
      getTasks()
    }
  };


  const clearSearch = () => {
    setButtonActive(1)
    searchRef.current.value = ""
    getTasks();
  };


  return (
    <div className="add_property_btn">
      <div className="inner-pages-top">
        <h3>To-Do List</h3>

        <div className="add_user_btn">
          <button onClick={() => navigate("/todo-list/add-task")}>
            <img src="/plus.svg" />
            Create Task
          </button>
        </div>

        <div className="search-grp-with-btn">
          <div className="search-group">
            <input type="text"
              ref={searchRef}
              onKeyDown={handleKeyDownEnter}
              placeholder="Search here" />
            {/* {buttonActive == 1 && <img src="/search.svg" onClick={handleKeyDown} />}
            {buttonActive == 2 && <FontAwesomeIcon icon={faXmark} onClick={clearSearch} />} */}
          </div>
          <div className="add_user_btn">
            <button onClick={handleKeyDown}>Search</button>
          </div>
        </div>

      </div>
      <div className="inner-pages-top inner-pages-top-share-ref inner-pages-top-share-ref-tab">
        <div className="add_user_btn">
          <button className={type == "previous" ? 'active' : ''} onClick={() => { setCurrentPage(1); setType("previous") }}>
            Previous ({taskCount?.previouscount})</button>

          <button className={type == "today" ? 'active' : ''} onClick={() => { setCurrentPage(1); setType("today") }}>
            Today ({taskCount?.todaycount})</button>
          <button className={type == "future" ? 'active' : ''} onClick={() => { setCurrentPage(1); setType("future") }}>
            Future ({taskCount?.futurecount})</button>
        </div>
      </div>
      <div className="table-container">
        {dataLoader ?
          (<div className="sekelton-class" style={{ backgroundColor: 'white' }} >
            <Skeleton height={50} count={10} style={{ margin: '5px 0' }} />
          </div>)
          : (
            <table>
              <thead>
                <tr>
                  <th>Task Title</th>
                  <th>Follow Up Date</th>
                  <th>Contact Name</th>
                  <th>Business Name</th>
                  <th>Profession</th>
                  <th>Phone</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>

                {tasks && tasks?.map((task, index) => (
                  <>
                    {!task.IsRead && <tr key={task?.id}>

                      <td
                        className="property-link"
                        onClick={() => {
                          setTodo(task)
                          navigate(`/todo-list-todo/edit/${task?.id}` ,  {state: { data: task } });
                        }}
                      >
                        {task?.Followup}
                      </td>

                      <td>
                        {formatDate(task?.FollowupDate)}
                      </td>
                      <td>{task?.contact?.firstname}</td>
                      <td>{task?.contact?.business_name}</td>
                      <td>{task?.contact?.profession_id > 0 ? task?.contact?.profession?.name : ""}</td>
                      <td>{formatPhoneNumber(task?.contact?.phone)}</td>
                      <td>{task?.contact?.email}</td>
                      <td> <button className="permissions"
                        onClick={() => navigate(`/todo-list/followup/${task.id}` ,  { state: { data: task } })} >Create Follow-Up</button>
                      </td>
                      <td>
                        <img className="delete-btn-ico" src="/delete.svg"
                          onClick={() => { handleMarkAsread(!task.IsRead, task.id) }}
                        ></img>

                      </td>
                    </tr>}
                  </>
                ))}
              </tbody>
            </table>)}

        {tasks?.length > 0 && (
          <div className="pagination">
            {renderPageNumbers()}
          </div>
        )}

      </div>
      {type == "previous" && tasks?.length == 0 && !dataLoader && <p className="no-data">No data Found</p>}
      {type == "today" && tasks?.length == 0 && !dataLoader && <p className="no-data">No data Found</p>}
      {type == "future" && tasks?.length == 0 && !dataLoader && <p className="no-data">No data Found</p>}
    </div>
  );
};

export default TodoList;
