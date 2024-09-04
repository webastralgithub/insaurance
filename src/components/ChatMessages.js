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
    const navigate = useNavigate()
    const { auth, roleId, userID, professionId } = useContext(AuthContext);
    const headers = { Authorization: auth.token };
    const url = process.env.REACT_APP_API_URL;

    const [queryIdForMessage, setQueryIdForMessage] = useState()
    const [dataLoader, setDataLoader] = useState(false)
    const [messageText, setMessageText] = useState("")
    const [messages, setMessages] = useState([]);
    const [totalPages, setTotalPages] = useState("");
    const [currentPage, setCurrentPage] = useState(1);



    const getChat = async () => {
        setDataLoader(true)
        try {
            const response = await axios.get(`${url}api/get_full_chat?page=${currentPage}/${id}`, { headers, })
            let data = response.data;
            // console.log("response", data.messages)
            setMessages(data.messages)
            setTotalPages(data.total_pages)
            setDataLoader(false)
        } catch (error) {
            setDataLoader(false)
            toast.error("Server is Busy");
            console.log(error)
        }
    }


    // useEffect(() => {
    //     if (id)
    //         getChat()
    // }, [id])


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
            //const response = await axios.post(`${url}api/create_notification`, dataSend, { headers, })

            const response = await axios.post(`${url}api/create_notification`, dataSend, { headers, })

            if (response.status === 200) {
                toast.success("Message Send Successfully")
            }
            setMessageText("")
            setQueryIdForMessage()
            getChat()
            setDataLoader(false)
        } catch (error) {
            setDataLoader(false)
            console.error(error);
            toast.error("Server is Busy")
        }

    }




    // console.log(messages)
    return (
        <div className="add_property_btn">
            <div className="property_header header-with-back-btn">
                <h3>
                    <button type="button"
                        className="back-only-btn" onClick={() => navigate(-1)}>
                        <img src="/back.svg" />
                    </button>
                    Messages
                </h3>


            </div>




            <div className="main-chat-div">
                <div className="user-detail-title-info">
                    <label>Ajay kumar</label>
                    <label>I need designer help</label>
                </div>

                {dataLoader ?
                    (<div className="sekelton-class" style={{ backgroundColor: 'white' }} >
                        <Skeleton height={50} count={10} style={{ margin: '5px 0' }} />
                    </div>)

                    : (
                        <div className="messages-div">
                            {messages.length > 0 && messages.map((msg, index) => (
                                <div key={index} className={`message-div  ${msg.reciever_id == 80 ? "receiver-div" : "sender-div"}`}>
                                    <p >{msg.message}</p>
                                    <small>{msg.created_at}</small> {/* Display date here */}
                                </div>))}

                        </div>)}

                <div className="message-box">
                    <textarea
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Type your message here..."
                    />
                    <button onClick={handleSendMessage}>Send</button>
                </div>
            </div>

            {messages.length == 0 && <p className="no-data">No data Found</p>}
        </div>
    )
}



export default ChatMessages
