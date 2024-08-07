import React, { useState, useEffect, useContext } from "react";
import InputMask from "react-input-mask";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { toast } from "react-toastify";
import Places from "./Places";
import { useNavigate, useParams } from "react-router-dom";
import PlacesNew from "./PlacesNew";

const ChildContact = (props) => {
  const { id } = useParams();
  const parentNameNew = localStorage.getItem("parent");

  const [notesErr, setNotesErr] = useState([])
  const [phoneerr, setPhoneErr] = useState([])
  const [errCont, setErrCont] = useState()
  const [emailError, setEmailError] = useState()
  const [showContent, setShowContent] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [useGoogleAddress, setUseGoogleAddress] = useState(true);
  const [contactCount, setContactCount] = useState([])

  const navigate = useNavigate();
  const [newContact, setNewContact] = useState({
    firstname: "",
    lastname: "",

    address1: "",

    phone: "",
    parentId: "",
    //createdAt: "",
    //updatedAt: "",
    realtorId: null,
    propertyId: null,
    // children: [],
  });

  const [users, setUsers] = useState([]);

  const { auth, setAuth } = useContext(AuthContext);
  const headers = {
    Authorization: auth.token,
  };
  const url = process.env.REACT_APP_API_URL;

  useEffect(() => {
    getContacts();
    // getUsers();
  }, [props]);

  const getUsers = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}api/admin/get-users`, { headers });
      setUsers(res.data);
    } catch (error) {
      // Handle error
      console.error(error);
    }
  };

  const getContacts = async () => {
    try {
      if (id) {
        const response = await axios.get(`${url}api/contacts/${id}/children`, { headers });
        const newData = response.data.filter(res => res.isNote == 0)
        setContacts(newData);
        setContactCount(newData);
      }
    } catch (error) {
      // localStorage.removeItem('token');
      // setAuth(null);
      // navigate('/');
    }
  };

  const handlePhoneNumberChange = (event, contactIndex) => {
    // Extract the raw phone number from the input
    const rawPhoneNumber = event.target.value.replace(/\D/g, "");
    const updatedContacts = [...contacts];
    setPhoneErr("")
    setErrCont(0)
    updatedContacts[contactIndex]['phone'] = rawPhoneNumber.slice(1, 11)
    setContacts(updatedContacts);
  };

  const handleInputChange = (event, contactIndex, fieldName) => {
    setEmailError("")
    setNotesErr("")
    setErrCont(0)
    const updatedContacts = [...contacts];
    updatedContacts[contactIndex][fieldName] = event.target.value;
    setContacts(updatedContacts);
  };

  const handleAddressChange = (newAddress, contactIndex) => {
    const updatedContacts = [...contacts];
    updatedContacts[contactIndex].address1 = newAddress;
    setContacts(updatedContacts);
  };



  const saveContactChanges = async (contact) => {

    let isValid = true;
    if (!contact.firstname) {
      setNotesErr("Name is Required")
      setErrCont(contact.id)
      isValid = false;
    }

    if (!contact.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      setEmailError("Invalid email");
      setErrCont(contact.id)
      isValid = false;
    }
    if (!contact.phone || contact.phone.length != 10) {
      setPhoneErr("Invalid phone number")
      setErrCont(contact.id)
      isValid = false;
    }

    if (isValid == false) {
      return
    }

    try {
      if (contact.id) {
        // If the contact has an id, send a PUT request to update the contact
        await axios.put(`${url}api/contacts/${contact.id}`, contact, { headers });
        toast.success('Contact updated successfully');
      } else {

        // If the contact doesn't have an id, send a POST request to add a new contact
        const response = await axios.post(`${url}api/contacts`, { ...contact, createdBy: id }, { headers });
        // Add the new contact to the contacts list
        getContacts()
        toast.success('Family Member added successfully');
      }
    } catch (error) {
      toast.error('Error saving contact');
    }
  };

  const handleAddFamilyMember = () => {
    // Add an empty family member to the contacts list
    const updatedContacts = [...contacts];
    updatedContacts.push({
      firstname: "",
      lastname: "",
      address1: "",
      phone: "",
      parentId: id,
      //createdAt: "",
      //updatedAt: "",
      realtorId: null,
      propertyId: null,
      // children: [],
    });

    setContacts(updatedContacts);
  };
  const removefamily = (index) => {
    const newContacts = [...contacts]
    newContacts.splice(index, 1);
    setContacts(newContacts)
  }

  const handleDeleteClick = async (contactid) => {
    try {
      const res = await axios.delete(`${url}api/contacts/${contactid}`, { headers });
      toast.success("Family Member Deleted Succesfully")
      getContacts()
    } catch (error) {
      toast.error("Server is Busy")
    }
  }

  return (
    <div className="add_property_btn">

      <div className="add_user_btn family_meber" onClick={() => {
        setShowContent(!showContent)
      }} >

        <h4>
          Family Members ({contactCount.length})
        </h4>

        {contacts.length == 0 &&


          <button
            title="Add Family Member"

            className="active"
            onClick={(e) => {
              e.stopPropagation();
              setShowContent(true)
              handleAddFamilyMember()
            }}
          >
            +
          </button>
        }
      </div>
      <div className="inner-pages-top">


      </div>

      {showContent && contacts.length != 0 && <div className="table-container family_meber_contact">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email Id</th>
              <th style={{ width: "200px" }}>Address
                <div className='address-toggle' key={"inner"}>


                  <input
                    type="radio"
                    name="addressTypeinner"
                    value="google"
                    checked={useGoogleAddress}
                    onChange={() => {

                      setUseGoogleAddress(true)
                    }}
                  />
                  <label>
                    Google
                  </label>


                  <input
                    type="radio"
                    name="addressTypeinner"
                    value="manual"
                    checked={!useGoogleAddress}
                    onChange={() => {

                      setUseGoogleAddress(false)
                    }
                    }
                  />
                  <label>
                    Manual
                  </label>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {contacts.length > 0 &&
              contacts.map((contact, index) => (
                <tr key={contact.id}>
                  <td >
                    <input
                      name="firstname"
                      value={contact.firstname}
                      onChange={(e) => handleInputChange(e, index, 'firstname')}
                    />
                    {errCont == contact.id && notesErr && <span className="error-message">{notesErr}</span>}
                    {errCont == 0 && notesErr && !contact.id && <span className="error-message">{notesErr}</span>}
                  </td>
                  <td>
                    <InputMask
                      mask="+1 (999) 999-9999"
                      type="text"
                      name="phone"
                      value={contact.phone}
                      onChange={(e) => handlePhoneNumberChange(e, index)}
                      placeholder="+1 (___) ___-____"
                    />

                    {errCont == contact.id && phoneerr && <span className="error-message">{phoneerr}</span>}
                    {errCont == 0 && !phoneerr && contact.id && <span className="error-message">{phoneerr}</span>}
                  </td>
                  <td>
                    <input
                      name="email"
                      value={contact.email}
                      onChange={(e) => handleInputChange(e, index, 'email')}
                    />
                    {errCont == contact.id && emailError && <span className="error-message">{emailError}</span>}
                    {errCont == 0 && emailError && !contact.id && <span className="error-message">{emailError}</span>}

                  </td>
                  <td>
                    <PlacesNew
                      value={contact.address1}
                      useGoogleAddresss={useGoogleAddress}
                      onChange={(newAddress) => handleAddressChange(newAddress, index)}
                    />
                  </td>
                  <td className="family-add-btn">
                    <button className="permissions" onClick={() => saveContactChanges(contact)}>{contact.id ? "Update" : "Save"}</button>

                  </td>
                  <td className="family-add-btn"> {index == contacts.length - 1 && contact.id && <button className="permissions" onClick={handleAddFamilyMember}>Add More</button>}</td>
                  <td> {!contact.id && <button className="permissions" onClick={() => removefamily(index)}>Remove</button>}</td>
                  {contact.id &&
                    <td>
                      <img className="delete-btn-ico" src="/delete.svg"
                        onClick={() => {

                          handleDeleteClick(contact.id)

                        }
                        } alt="" ></img>
                    </td>}
                </tr>

              ))}
          </tbody>
        </table>

      </div>}

      {/* {contacts.length === 0 && <p className="no-data">No data Found</p>} */}



    </div>
  );
};

export default ChildContact;