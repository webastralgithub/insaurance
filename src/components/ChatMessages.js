import React, { useState, useEffect, useContext, useRef } from "react";
import "./admin.css"
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPencil, faTimes } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useNavigate, useParams } from "react-router-dom";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Modal from "react-modal";


const ChatMessages = () => {
    const { id } = useParams()

    const { auth, roleId, userID, professionId } = useContext(AuthContext);
    const headers = { Authorization: auth.token };
    const url = process.env.REACT_APP_API_URL;

    const [queryIdForMessage, setQueryIdForMessage] = useState()
    const [dataLoader, setDataLoader] = useState(false)
    const [messageText, setMessageText] = useState("")
    const [messages, setMessages] = useState([])
    const [totalPages, setTotalPages] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // https://insuranceadmin.nvinfobase.com/api/get-message/69?page=1
    const getChat = async () => {
        setDataLoader(true)
        try {
            const response = await axios.get(`${url}api/get-message/34232?page=${currentPage}`, { headers, })
            let data = response.data;
            // console.log("response", data.messages)
            setMessages(data.messages)
            setTotalPages(data.total_pages)
            setDataLoader(false)
        } catch (error) {
            setDataLoader(false)
        }
    }


    useEffect(() => {
        if (id)
            getChat()
    }, [id])


    const handleSendMessage = async (e) => {
        e.preventDefault()

        if (!messageText) {
            toast.error("Please Enter Message to Send")
            return
        }
        setDataLoader(true)
        let dataSend = {
            inquiry_id: queryIdForMessage,
            message: messageText,
            // email:  user email to whom send email
        }
        try {
            const response = await axios.post(`${url}api/create_notification`, dataSend, { headers, })

            if (response.status === 200) {
                toast.success("Message Send Successfully")
            }
            setMessageText("")
            setQueryIdForMessage()
            setDataLoader(false)
        } catch (error) {
            setDataLoader(false)
            console.error(error);
            toast.error("Server is Busy")
        }

    }

    return (
        <div className="add_property_btn">
            <div className="inner-pages-top">
                <h3>Messages</h3>

                {/* <div className="search-group">
                    <input type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}

                        placeholder="Search here" />
                    <img src="/search.svg" />
                </div> */}

            </div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>From</th>
                            <th>Messages</th>
                            <th>To</th>
                        </tr>
                    </thead>
                    <tbody>
                        {messages && messages?.map((user, index) => (
                                <tr key={index}>
                                    <td className="property-link" >{user?.sender_name}</td>
                                    <td >{user?.message?.replace(/(<([^>]+)>)/gi, '').slice(0, 100).replace(/(?<=\s)\S*$/i, '')}</td>
                                    <td>{user.reciever_name}</td>
                                </tr>
            
                        ))}
                    </tbody>
                </table>
                {/* {messages?.length > 0 && (
            <div className="pagination">
              {renderPageNumbers()}
            </div>
          )} */}
            </div>
            {messages.length == 0 && <p className="no-data">No data Found</p>}
        </div>
    )
}

export default ChatMessages
