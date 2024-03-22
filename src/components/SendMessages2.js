import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Modal as BootstrapModal, Button } from 'react-bootstrap';
import './admin.css'

const SendMessages2 = () => {
    const { auth } = useContext(AuthContext);
    const url = process.env.REACT_APP_API_URL;
    const headers = {
        Authorization: auth.token,
    };

    const [error, setError] = useState("");
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [selectSearchGroup, setSelectSearchGroup] = useState('');
    const [groupNames, setGroupNames] = useState([]);
    const [groupContacts, setGroupContact] = useState([])
    const [showGroupContacts, setShowGroupContacts] = useState(false);
    const handleClose = () => setShowGroupContacts(false);
    const handleshow = () => setShowGroupContacts(true);


    const handleCheckboxChange = (group) => {
        const isSelected = selectedGroups.find(selectedGroup => selectedGroup.id === group.id);
        let updatedSelectedGroups;

        if (isSelected) {
            updatedSelectedGroups = selectedGroups.filter(selectedGroup => selectedGroup.id !== group.id);
   
        } else {
            updatedSelectedGroups = [...selectedGroups, group];
            //fetchGroupNames();
        }

        setSelectedGroups(updatedSelectedGroups);
        const selectedGroupNames = updatedSelectedGroups.map(selectedGroup => selectedGroup.group_name);
        setSelectSearchGroup(selectedGroupNames.join(', '));
        fetchGroupNames();

        if (updatedSelectedGroups.length === 0) {
            fetchGroupNames(); 
        }
    };

    const [searchInput, setSearchInput] = useState('');

    
    const handleSearchInputChange = (e) => {
        let searchString = e.target.value.toLowerCase();
        setSelectSearchGroup(searchString);

        if (searchString === '') {
           // setSelectedGroups([]);
            fetchGroupNames(); 
        } else {
            const filteredGroups = groupNames.filter(group => group.group_name.toLowerCase().includes(searchString));
            setGroupNames(filteredGroups);
      
        }

    };
    const getSingleContacts = (id) => {
        console.log("id", id)
    }
    const fetchGroupNames = async () => {
        try {
            const response = await fetch(`${url}api/group-names`, { headers });
            if (!response.ok) {
                throw new Error("Failed to fetch group names");
            }
            const data = await response.json();
            setGroupNames(data);
        } catch (error) {
            setError("Failed to fetch group names");
        }
    };
    const getGroupContacts = async (id) => {
        console.log(id)
        try {
            const response = await axios.get(`${url}api/group-contacts/${id}`, { headers });
            const res = await response.data;
            setGroupContact(res);
            handleshow();
            console.log("hello")
        } catch (error) {
            console.log("id data fetching error", error);
        }
    }
    useEffect(() => {
        fetchGroupNames();
    }, []);

    return (
        <div>
            {/* custom group form modification */}
            <form>
                <h3 class="heading-category">Select Group(s)</h3>
                <div className="searchbar-grd">


                    <input type="text" placeholder="Search Group" value={selectSearchGroup} onChange={handleSearchInputChange} />

                    {selectedGroups.length > 0 || selectSearchGroup.length > 0 ? (
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedGroups([]);
                                setSelectSearchGroup('');
                                fetchGroupNames();
                            }}
                        >
                            ×
                        </button>
                    ) : null}
                </div>

                {error && <p className="error-category">{error}</p>}
                <ul class="custom-dropdown" style={{ "overflowY": 'auto', "overflowX": 'hidden', "background": 'rgb(255, 255, 255)', "boxShadow": 'none' }}>
                    {groupNames.map((group, index) => (
                        <li key={index}>
                            <label onClick={() => getGroupContacts(group.id)}>
                                {group.group_name}
                            </label>
                            <input
                                type="checkbox"
                                id={`group-${index}`}
                                value={group.id}
                                checked={selectedGroups.some(selectedGroup => selectedGroup.id === group.id)}
                                onChange={() => handleCheckboxChange(group)}
                            />
                        </li>

                    ))}
                </ul>
            </form>
            <div>
        <BootstrapModal show={showGroupContacts} onHide={handleClose}>
          <BootstrapModal.Header closeButton>
            <BootstrapModal.Title>User Data</BootstrapModal.Title>
          </BootstrapModal.Header>
          <BootstrapModal.Body>
            <ul>
              {groupContacts.map((user) => (
                <li key={user.id} onClick={() => getSingleContacts(user.id)}>
                  {user.firstname} {user.lastname}
                </li>
              ))}
            </ul>
          </BootstrapModal.Body>
          <BootstrapModal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </BootstrapModal.Footer>
        </BootstrapModal>
      </div>
        </div>
    );
};

export default SendMessages2
