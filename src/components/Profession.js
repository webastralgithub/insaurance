import React, { useContext, useEffect, useState } from "react";
import "./admin.css"
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";

const Profession = () => {
  const { auth, roleId } = useContext(AuthContext)
  const headers = {
    Authorization: auth.token
  }

  const [users, setUsers] = useState([])
  const [totalPagess, setTotalPages] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [width, setWidth] = useState(window.innerWidth);

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
  useEffect(() => {
    getUsers()
  }, [currentPage])


  const handleDelete = async (propertyId) => {
    try {
      await axios.delete(`${url}api/profession/${propertyId}`, { headers });
      toast.success('Profession deleted successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
      setUsers(users.filter((p) => p.id !== propertyId));
    } catch (error) {
      console.error("error in server")
    }
  };


  const handleDeleteClick = (propertyId) => {
    confirmAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this Profession?',
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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };



  const getUsers = async () => {
    try {

      const res = await axios.get(`${process.env.REACT_APP_API_URL}api/profession-list?page=${currentPage}`, { headers });
      setUsers(res.data.profession)
      setTotalPages(res?.data?.totalPages)
    } catch (error) {
      console.error("User creation failed:", error);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPagess; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers.map((number) => (
      <button className={currentPage === number ? "active" : ""}
        key={number} onClick={() => handlePageChange(number)}>{number}</button>
    ));
  };

  const handleClick = (userId) => {
    navigate(`/profession/${userId}`)
  }
  return (
    <div className="add_property_btn">
      <div className="inner-pages-top">
        <h3>Profession</h3>
        {roleId == 1 &&
          <div className="add_user_btn">
            <button onClick={() => navigate("/profession/add")}>
              <img src="/plus.svg" />
              Add Profession</button>
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
            {users?.map((user) => (
              <>
                <tr key={user.id}>
                  <td className="property-link" onClick={()=>roleId == 1 ? handleClick(user.id) : null} >{user?.name}</td>
                  <td >{user?.notes?.replace(/(<([^>]+)>)/gi, '').slice(0, 100).replace(/(?<=\s)\S*$/i, '')}</td>
                  {roleId == 1 &&
                    <td>
                      <img className="delete-btn-ico" src="/delete.svg"
                        onClick={() => handleDeleteClick(user.id)}>
                      </img>
                    </td>}
                  {/* <td><button className="permissions"
        onClick={()=>activate(!user.isActivate,user.id)
        }       > {user.isActivate?"Deactivate":"Activate"}</button>  </td> */}
                </tr>
              </>
            ))}
          </tbody>
        </table>
        {users?.length > 0 && (
          <div className="pagination">
            {renderPageNumbers()}
          </div>
        )}
      </div>
      {users.length == 0 && <p className="no-data">No data Found</p>}
    </div>
  )
}

export default Profession
