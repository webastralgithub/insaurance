// src/components/Admin.js
import React, { useContext, useEffect, useState } from "react";
import "./admin.css"
import axios from "axios";

import { AuthContext } from "./context/AuthContext";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";

const Category = () => {
  const { auth, roleId } = useContext(AuthContext)
  const headers = {
    Authorization: auth.token
  }
  const [users, setUsers] = useState([])
  const [width, setWidth] = useState(window.innerWidth);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate()

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);
  const url = process.env.REACT_APP_API_URL
  const [roles, setRoles] = useState([])
  useEffect(() => {
    getUsers()

  }, [])

  const styles = {
    overlay: {
      backgroundColor: "rgb(0 0 0 / 75%)",
      zIndex: "99999",
      overflow: 'scroll',
    },
    content: width > 400 ? {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      border: "none",
      background: "#000",
      border: "1px solid #fff",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",

      width: "60%",
      borderRadius: "24px",
    } : {

      position: "absolute",
      inset: "56% auto auto 50%",
      border: " none",
      background: "#000",
      border: "1px solid #fff",
      overflow: " auto",
      borderRadius: "10px",
      outline: "none",

      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "68%",


    },
  };
  const handleDelete = async (propertyId) => {
    await axios.delete(`${url}api/categories/${propertyId}`, { headers });

    toast.success('Category deleted successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
    setUsers(users.filter((p) => p.id !== propertyId));
  };


  const handleDeleteClick = (propertyId) => {
    confirmAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this category?',
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

  const mediaQuery = window.matchMedia("(max-width: 768px)");
  const mediaQueryMobile = window.matchMedia("(max-width: 480px)");
  const mediaQueryMobileNext = window.matchMedia("(max-width: 600px)");

  const customStyles = {
    overlay: {
      ...styles.overlay,
    },
    content: {
      ...styles.content,

      width: mediaQueryMobileNext.matches ? "80%" : mediaQuery.matches ? "68%" : "60%"


    },
  };
  const filteredUsersNew = users.filter((user) =>

    (user.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const ITEMS_PER_PAGE = 10;
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const totalPages = Math.ceil(filteredUsersNew.length / ITEMS_PER_PAGE);

  // Calculate the start and end indices for the current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const filteredUsers = filteredUsersNew.slice(startIndex, endIndex);

  const getUsers = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}api/categories`, { headers });
      setUsers(res.data)

    } catch (error) {
      console.error("User creation failed:", error);
    }
  };

  return (
    <div className="add_property_btn">
      <div className="inner-pages-top">
        <h3>Categories</h3>
        {roleId == 1 &&
          <div className="add_user_btn">
            <button onClick={() => navigate("/categories/add")}>
              <img src="/plus.svg" />
              Add Category</button>
          </div>
        }

        <div className="search-group">
          <input type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}

            placeholder="Search here" />
          <img src="/search.svg" />
        </div>

      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers?.map((user) => (
              <>
                <tr key={user.id}>
                  <td className="property-link" onClick={() => {
                    navigate(`/categories/${user.id}`)
                  }}>{user?.name}</td>
                  <td >{user?.notes?.replace(/(<([^>]+)>)/gi, '').slice(0, 100).replace(/(?<=\s)\S*$/i, '')}</td>
                  {roleId == 1 &&
                    <td>
                      <img className="delete-btn-ico" src="/delete.svg"
                        onClick={() => handleDeleteClick(user.id)}>
                      </img>
                    </td>
                  }
                  {/* <td><button className="permissions"
          onClick={()=>activate(!user.isActivate,user.id)
          }       > {user.isActivate?"Deactivate":"Activate"}</button>  </td> */}
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
                className={currentPage === index + 1 ? 'active' : ''}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
      {filteredUsers.length == 0 && <p className="no-data">No data Found</p>}
    </div>
  );
};




export default Category;
