import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { toast } from "react-toastify";

import { useParams } from "react-router-dom";


const ChildNotes = (props) => {
  const { nameofuser } = props;
  const { id } = useParams()
  const [showContent, setShowContent] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [notesErr, setNotesErr] = useState([])
  const { auth } = useContext(AuthContext);
  const headers = {
    Authorization: auth.token,
  };
  const url = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (id) {
      getContacts();

    }
  }, [id]);



  const getContacts = async () => {
    try {
      if (id) {
        const response = await axios.get(`${url}api/contacts/${id}/notes`, { headers });
        const newData = response.data.filter(res => res.isNote == 1)
        setContacts(newData);
      }
    } catch (error) {
    console.error(error)
    }
  };



  const handleInputChange = (event, contactIndex, fieldName) => {
    setNotesErr()
    const updatedContacts = [...contacts];
    updatedContacts[contactIndex][fieldName] = event.target.value;
    setContacts(updatedContacts);
  };



  const saveContactChanges = async (contact) => {
    try {
      if (!contact.notenew) {
        setNotesErr(
          "Note is Required"
        )
        return
      }
      if (contact.id) {


        // If the contact has an id, send a PUT request to update the contact
        await axios.put(`${url}api/contacts/${contact.id}`, contact, { headers });
        toast.success('Notes updated successfully');
      } else {
        // If the contact doesn't have an id, send a POST request to add a new contact
        const response = await axios.post(`${url}api/add-notes`, contact, { headers });
        // Add the new contact to the contacts list
        getContacts()
        toast.success('Notes added successfully');
      }
    } catch (error) {
      toast.error('Error saving contact');
    }
  };



  
  const formatDate = (dateString) => {
    if (!dateString) {
      return ""; // Handle cases where the date string is empty or undefined
    }

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  function getInitials(name) {
    // Split the name into words
    const words = name.split(" ");

    // Initialize an empty string to store the initials
    let initials = "";

    // Iterate through the words and append the first letter of each word to the initials
    for (const word of words) {
      if (word.length > 0) {
        initials += word[0].toUpperCase() + ".";
      }
    }

    // Remove the trailing period and return the initials
    return initials.slice(0, -1);
  }

  const handleAddFamilyMember = () => {
    // Add an empty family member to the contacts list
    const updatedContacts = [...contacts];
    updatedContacts.push({
      firstname: "",
      lastname: "",
      source: "",
      phone: "",
      addedBy: getInitials(nameofuser),
      datenew: new Date(),
      parentId: id,
      isNote: 1,
      realtorId: null,
      propertyId: null,
    
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

          Notes ({contacts.length})

        </h4>
        {contacts.length == 0 &&
          <button
            title="Add Notes"
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
              <th>Notes</th>
              <th>Date</th>
              <th>Initials (Note added by)</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length > 0 &&
              contacts.map((contact, index) => (
                <tr key={contact.id}>
                  <td >
                    <input
                      name="notenew"
                      readOnly={contact.id ? true : false}
                      style={{
                        borderBottom: contact.id ? "none" : "0.5px solid #59555587"
                      }}
                      type="text"
                      defaultValue={contact?.notenew}
                      onChange={(e) => handleInputChange(e, index, 'notenew')}
                    />
                    {notesErr && !contact.id && <span className="error-message">{notesErr}</span>}
                  </td><td>
                    <input
                      name="datenew"
                      readOnly={contact.id ? true : false}
                      type="text"
                      style={{
                        borderBottom: contact.id ? "none" : "0.5px solid #59555587"
                      }}
                      defaultValue={formatDate(contact?.datenew)}
                      onChange={(e) => handleInputChange(e, index, 'datenew')}
                    />
                  </td>


                  <td>
                    <input
                      name="addedBy"
                      readOnly
                      type="text"
                      style={{
                        borderBottom: contact.id ? "none" : "0.5px solid #59555587"
                      }}
                      value={contact.addedBy}

                    />

                  </td>
                  <td>
                    {!contact.id && <button type="button" className="permissions" onClick={() => saveContactChanges(contact)}>Save</button>}

                  </td>
                  <td> {index == contacts.length - 1 && contact.id && <button className="permissions" onClick={handleAddFamilyMember}>Add More</button>}</td>
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

export default ChildNotes;
