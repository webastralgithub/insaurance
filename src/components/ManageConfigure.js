import React, { useState, useEffect, useContext, useRef } from "react";
import './Upgradeplan.css'
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";

const ManageConfigure = () => {

  const { auth, property, setProperty, setAuth } = useContext(AuthContext);
  const url = process.env.REACT_APP_API_URL;
  const headers = {
    Authorization: auth.token,
  };

  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("");
  const [limit, setLimit] = useState("")
  const [description, setDescription] = useState("")
  const [configData, setconfigData] = useState([])

  const [page, setPage] = useState("")
  const [errors, setErrors] = useState({});

  // Create : https://insuranceadmin.nvinfobase.com/api/limit
  // method :post 
  // payload {
  // name : 
  // set_limit:
  // }

  // Update : https://insuranceadmin.nvinfobase.com/api/update-limit
  // method :patch 
  // payload {
  // name : 
  // set_limit:
  // }
  // get : https://insuranceadmin.nvinfobase.com/api/list-limits

  const getData = async () => {
    try {
      const response = await axios.get(`${url}api/list-limits`, { headers });
      const responseData = response.data.limits
      setconfigData(responseData);
      console.log("data", responseData);
    } catch (error) {
      console.error("error", error)
    }
  }
  useEffect(() => {
    getData()
  }, [])

  const createPlan = async (e) => {
    e.preventDefault()
    const errors = {};


    
    let postData = {
      name: name,
      set_limit: limit,
      short_description: description,
      page : page
    }
    console.log("posted data" , postData)
    try {
      const response = await axios.post(`${url}api/limit`, postData, { headers });
      const responseData = response.data;
      setLimit('')
      setName('')
      setPage('')
      setDescription('')
      setIsOpen(false)
      navigate("/upgrade-plan")
    } catch (error) {
      console.error(error);
    }
  }

  const updatePlanData = async (e) => {

    let updatedData = {
      name: name,
      set_limit: limit,
      short_description: description,
      page: page

    }
    try {
      const response = await axios.patch(`${url}update-limit`, updatedData, { headers });
      const responseData = response.data;

    } catch (error) {
      console.error(error);
    }
  }

  const closeModal = () => {
    setLimit('')
      setName('')
      setPage('')
      setDescription('')
      setErrors('')
    setIsOpen(false);
  };
  return (
<>

    <div>
    {isOpen != true && <div className="add_user_btn">
   
        <button onClick={() => setIsOpen(true)}>
          <img src="/plus.svg" />
          Add Plan</button>
      </div>}

      {isOpen == true ?
        <div>
          <h3 className="heading-category-group-contacts">Add Config
              <img
                className="close-modal-share"
                onClick={closeModal}
                src="/plus.svg"
              /></h3> 
          <span onClick={closeModal}>X</span>
          <form onSubmit={createPlan} className="form-user-add form-add-lead">
            <div className="property_header header-with-back-btn">
              <div className="top-bar-action-btns">

              </div>
            </div>
            <div className="form-user-add-wrapper">

              <div className="form-user-add-inner-wrap">
                <label>Title <span className="required-star">*</span></label>
                <input
                  type="text"

                  value={name}
                  onChange={(e => setName(e.target.value))}
                />
                {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
              </div>


              <div className="form-user-add-inner-wrap">
                <label>Limit</label>
                <input

                  value={limit}
                  onChange={(e => setLimit(e.target.value))}
                />{errors.limit && <p style={{ color: "red" }}>{errors.limit}</p>}
              </div>

              <div className="form-user-add-inner-wrap">
                <label>Description</label>
                <input
                  value={description}
                  onChange={(e => setDescription(e.target.value))}
                />{errors.description && <p style={{ color: "red" }}>{errors.description}</p>}
              </div>
              <div className="form-user-add-inner-wrap">
                <label>Page</label>
                <select value={page} onChange={(e) => setPage(e.target.value)}>
                  <option value=''>Select Option</option>
                  <option value='todo'>To-Do</option>
                  <option value='leads<'>Leads</option>
                  <option value='contacts'>Contacts</option>
                  <option value='referrals'>Referrals</option>
                </select>
              </div>{errors.page && <p style={{ color: "red" }}>{errors.page}</p>}

            </div>
            <div className="form-user-add-inner-btm-btn-wrap">

              <button type="submit" >Save</button>
            </div>
          </form>
        </div>
        : ""} 
      
      {!isOpen &&<div className="table-container">
        <table>
          <thead>
            <tr style={{backgroundColor :"#004787"}}>
              <th>Name</th>
              <th>Description</th>
              <th>Limit</th>
              <th>Page</th>
            </tr>
          </thead>
   

        {configData.length>0 &&
              configData.map((data) => ( <tbody>
          
                <tr key={data.id}>  
                <td>{data.name}</td>               
                  <td>{data.short_description}</td>
                  <td>{data.set_limit}</td>
                  <td>{data.page}</td>
       
              </tr>
          </tbody> ))}
        
        </table>
    
      </div>}
      
      
      </div>
      </>
  )
}

export default ManageConfigure
