// src/components/Admin.js
import React, { useContext, useEffect, useState, useRef } from "react";
import "./admin.css";
import axios from "axios";
import Modal from "react-modal";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { AuthContext } from "./context/AuthContext";
import Show from "./Show";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-confirm-alert/src/react-confirm-alert.css';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const TodoList = ({ role }) => {
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]); // Replace 'users' with 'tasks'
  const [width, setWidth] = useState(window.innerWidth);
  const [currentPageData, setCurrentPageData] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [totalPagess, setTotalPagess] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1)
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [editingTask, setEditingTask] = useState(null); // Replace 'editingUser' with 'editingTask'
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
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'UTC'
    };

    const localDateTimeString = dateTime.toLocaleString('en-US', options);

    return localDateTimeString;
  };
  const formatDateNew = (dateTimeString) => {
    if (!dateTimeString) {
      return "";
    }

    const dateTime = new Date(dateTimeString);

    const year = dateTime.getFullYear();
    const month = String(dateTime.getMonth() + 1).padStart(2, "0");
    const day = String(dateTime.getDate()).padStart(2, "0");
    const hours = String(dateTime.getHours()).padStart(2, "0");
    const minutes = String(dateTime.getMinutes()).padStart(2, "0");
    const seconds = String(dateTime.getSeconds()).padStart(2, "0");

    return `${month}-${day}`;
  };
  const url = process.env.REACT_APP_API_URL;

  const handleDeleteClick = (propertyId) => {
    confirmAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this task?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => handleDelete(propertyId),
        },
        {
          label: 'No',
          onClick: () => { },
        },
      ],
    });
  };

  const handleDelete = async (propertyId) => {
    await axios.delete(`${url}api/todo/delete/${propertyId}`, { headers });

    toast.success('Todo deleted successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
    setTasks(tasks.filter((p) => p.id !== propertyId));
  };
  const filteredContacts = tasks.filter((contact) => {
    const searchText = searchQuery.toLowerCase();
    return (
      contact?.Followup?.toLowerCase().includes(searchText) ||
      contact?.Comments?.toLowerCase().includes(searchText) ||
      contact?.phone?.toLowerCase().includes(searchText)
    )
  });



  //https://insuranceadmin.nvinfobase.com/api/todo/get?page=1&search=test  
  const getTasks = async () => {
    let currPage
    if(searchRef.current.value){
      currPage =''
    }else{
      currPage = currentPage
    }

    try {
      setLoading(true)
      const response = await axios.get(`${url}api/todos/get?page=${currPage}&&search=${searchRef.current.value}`, { headers });
      const today = new Date();
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      const todayMonthDay = (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');

      const birthdayTodos = response.data.todo.filter((todo) => {
        if (todo.isBirthday || todo.isAnniversary) {
          const todoMonthDay = formatDateNew(todo?.FollowupDate)
          return todoMonthDay === todayMonthDay;
        }
        return todo
      });
      setTasks(birthdayTodos);
      setTotalPagess(response.data.totalPages);
      setCurrentPage(response.data?.currentPage)
      setLoading(false)

    } catch (error) {
      console.error(error)
    }
  };

  useEffect(() => {
    getTasks();
  }, [currentPage]);

  const handleKeyDown = () => {
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

  const changeStatus = async (status, id) => {
    const response = await axios.put(`${url}api/todo/update/${id}`,
      { IsRead: status },
      { headers });

    getTasks()

  }
  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) {
      return ''
    }
    return `+1 (${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
  };

  const clearSearch = () => {
    searchRef.current.value= ""
    getTasks();
  };


  return (
    <div className="add_property_btn">
      <div className="inner-pages-top">
        <h3>To-Do List</h3>

        <div className="add_user_btn">
          <button onClick={() => navigate("/todo-list/add")}>
            <img src="/plus.svg" />
            Create Task
          </button>
        </div>
        <div className="search-group">
          <input type="text"
            //value={searchQuery}
            // onChange={(e) => setSearchQuery(e.target.value)}
            ref={searchRef}
            placeholder="Search here" />
          <img src="/search.svg" onClick={handleKeyDown} />
        </div>
        <span onClick={clearSearch}>X</span>
      </div>


      {/* {loading ? (<Skeleton count={20} />) : (<> */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Phone</th>
              <th>Task Title</th>
              <th>Follow Up Date</th>
            </tr>
          </thead>
          <tbody>

            {tasks && tasks?.map((task, index) => (
              <>
                {!task.IsRead && <tr key={task.id}>
                  <td>
                    {task.phone != undefined || task.phone != "null" ? formatPhoneNumber(task.phone) : ""}
                  </td>
                  <td
                    className="property-link"
                    onClick={() => {
                      setTodo(task)
                      navigate(`/todo-list/edit/${task.id}`);
                    }}
                  >
                    {task.Followup}
                  </td>

                  <td>
                    {formatDate(task.FollowupDate)}
                  </td>


                  {/* <td>
                {task.client?.firstname}
              </td>
            
              <td>
                {task.realtor?.name}
              </td> */}
                  {/* {task.contact? <td   className="property-link"   onClick={() => {
                   
                    navigate(`/contact/edit/${task.contact.id}`);
                  }}>
                { task.contact.firstname}
              </td>:<td></td>} */}

                  <td>
                    <button className="permissions"
                      onClick={() => {
                        changeStatus(!task.IsRead, task.id)
                        setTasklength(tasklength - 1)
                      }}

                    > Mark as {task.IsRead ? "unread" : "read"}</button>
                  </td>
                  <td> <button className="permissions"
                    onClick={() => navigate(`/todo-list/followup/${task.id}`)} >Create Follow-Up</button></td>

                </tr>}
              </>
            ))}
            {/* </>)} */}
          </tbody>

        </table>

        {tasks?.length > 0 && (
          <div className="pagination">
            {renderPageNumbers()}
          </div>
        )}
        {tasks.length == 0 && <p className="no-data">No data Found</p>}

      </div>

    </div>
  );
};

export default TodoList;
