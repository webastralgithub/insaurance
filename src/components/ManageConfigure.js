import React, { useState, useEffect, useContext, useRef } from "react";
import './Upgradeplan.css'
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { useNavigate} from "react-router-dom";

const ManageConfigure = () => {

  const { auth} = useContext(AuthContext);
  const url = process.env.REACT_APP_API_URL;
  const headers = {
    Authorization: auth.token,
  };

  const navigate = useNavigate()

  const [configData, setconfigData] = useState([])




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
    } catch (error) {
      console.error("error", error)
    }
  }
  useEffect(() => {
    getData()
  }, [])

  const handleEdit = (data) => {
    navigate("/features-update", { state: { data: data } });
  }

  return (
    <>

      <div className="add_user_btn-mng-cnfgr-pg">
        <div className="add_user_btn">

          <button onClick={() => navigate("/manage-configure/add-features")}>
            <img src="/plus.svg" />
            Add Plan</button>
        </div>

        <div className="table-container manage-configr-table">
          <table>
            <thead>
              <tr style={{ backgroundColor: "#004787" }}>
                <th>Name</th>
                <th>Description</th>
                <th>Limit</th>
                <th>Page</th>
                <th>Actions</th>
              </tr>
            </thead>


            {configData.length > 0 &&
              configData.map((data) => (<tbody>

                <tr key={data.id}>
                  <td>{data.name}</td>
                  <td className="manage-pg-table-confgr">{data.short_description}</td>
                  <td>{data.set_limit}</td>
                  <td>{data.page}</td>
                  <td className="manage-configr-table-btn">
                  <buttton onClick={() => handleEdit(data)}>Edit Feature</buttton>
                  </td>
                </tr>
              </tbody>))}

          </table>

        </div>
      </div>
    </>
  )
}

export default ManageConfigure
