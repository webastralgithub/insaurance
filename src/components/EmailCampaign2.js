import React, { useContext, useEffect, useRef, useState, createContext } from "react";
import axios from "axios";
import "./EmailCamp.css";
import { toast } from "react-toastify";
import { AuthContext } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const EmailCampaign2 = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const headers = {
        Authorization: auth.token,
    };
    const url = process.env.REACT_APP_API_URL;
    const navigate = useNavigate()

    let searchRef = useRef()
    const [active, setActive] = useState(0)
    const [dataLoader, setDataLoader] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [userss, setusers] = useState([])
    const [totalPagess, setTotalPages] = useState("");
    const [templates, setTemplates] = useState([]);
    const [content, setContent] = useState({ emailContent: "" });
    const [customEmail, setCustomEmail] = useState(0)
    const [subject, setSubject] = useState("");
    //predefiened templates
    useEffect(() => {
        getEmailTemplates()
    }, [])
    const getEmailTemplates = async () => {
        try {
            const response = await axios.get(`${url}api/get/email`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });
            if (response.data && Array.isArray(response.data)) {
                setTemplates(response.data);
            } else {
                console.error("Invalid response format:", response);
            }
        } catch (error) {
            console.error("Error fetching email templates:", error);
        }
    };

    // contact listing

    useEffect(() => {
        getTasks()
    }, [currentPage])
    const getTasks = async () => {
        setDataLoader(true)
        let currPage
        let seachData
        if (searchRef.current.value) {
            currPage = ''
        } else {
            currPage = currentPage
        }

        try {
            const response = await axios.get(`${url}api/contacts-list?page=${currPage}&search=${searchRef.current.value}`, { headers });
            setusers(response?.data?.contacts)
            setTotalPages(response?.data?.totalPages)
            setDataLoader(false)
        } catch (error) {
            setDataLoader(false)
            console.error("Server is busy");
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const formatPhoneNumber = (phoneNumber) => {
        return `+1 (${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
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



    //global code
    const handleBackIcon = () => {
        setActive(0)
    }

    return (
        <>
            <div className="add_property_btn">

                <div className="inner-pages-top inner-pages-top-flex-direction">
                    <div className="inner-pages-top" style={{ justifyContent: 'flex-start' }}>
                        {active > 0 &&
                            <button className="back-only-btn" onClick={handleBackIcon}>
                                <img src="/back.svg" />
                            </button>
                        }
                        <h3> Email Campaigns</h3 >
                        {active === 0 &&
                            <div className="add_user_btn" onClick={() => { setActive(1) }}>
                                <button >Add Campaigns</button>
                            </div>
                        }
                        <div className="search-grp-with-btn" style={{ marginLeft: '100px' }}>
                            <div className="search-group">
                                <input type="text"
                                    ref={searchRef}
                                    placeholder="Search here" />
                            </div>
                            <div className="add_user_btn">
                                <button >Search</button>
                            </div>
                        </div>

                    </div>
                    {active > 0 &&
                        <div className="add_user_btn buttons-with-returb-btn">
                            <button className={active === 1 ? 'active' : ''} onClick={() => { setActive(1); setCustomEmail(0) }}>
                                Campaign</button>
                            <button className={active === 2 ? 'active' : ''} onClick={() => { setActive(2); setCustomEmail(0) }}>
                                People</button>
                            <button className={active === 3 ? 'active' : ''} onClick={() => { setActive(3); setCustomEmail(0) }}>
                                Templates</button>
                            <div className="add_user_btn buttons-with-returb-btn" style={{ marginLeft: '420px' }} >
                                <button style={{ marginRight: '10px' }}>
                                    Save</button>
                                <button>
                                    Post</button>
                            </div>

                        </div>}


                </div>


                {/* listing templates  */}
                <>
                    {active === 0 && <div className="table-container">
                        {dataLoader ?
                            (<div className="sekelton-class" style={{ backgroundColor: 'white' }} >
                                <Skeleton height={50} count={10} style={{ margin: '5px 0' }} />
                            </div>)
                            : (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Description</th>
                                            <th>Created At</th>

                                        </tr>
                                    </thead>
                                    {userss.length > 0 &&
                                        userss.map((contact) => (<tbody key={contact.id}>
                                            <tr key={contact.id}>
                                                <td>{contact.firstname}</td>
                                                <td>{contact?.business_name}</td>
                                                <td>{contact?.profession?.name ? contact?.profession?.name : ""}</td>
                                                <td>
                                                    <button className="permissions share-ref-button-tb">View</button>
                                                </td>
                                                <td>
                                                    <button className="permissions share-ref-button-tb">Edit</button>
                                                </td>

                                                <td>
                                                    <img className="delete-btn-ico" src="/delete.svg" alt=""></img>
                                                </td>
                                            </tr>
                                        </tbody>))}
                                </table>)}
                        {userss?.length > 0 && (
                            <div className="pagination">
                                {renderPageNumbers()}
                            </div>
                        )}
                    </div>}
                </>

                {/* contacts listing */}
                <>
                    {active === 2 &&
                        <div className="table-container">
                            {dataLoader ?
                                (<div className="sekelton-class" style={{ backgroundColor: 'white' }} >
                                    <Skeleton height={50} count={10} style={{ margin: '5px 0' }} />
                                </div>)

                                : (
                                    <table>
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Name</th>
                                                <th>Business Name</th>
                                                <th>Profession</th>
                                                <th>Phone</th>
                                                <th>Email</th>
                                            </tr>
                                        </thead>
                                        {userss.length > 0 &&
                                            userss.map((contact) => (<tbody key={contact.id}>
                                                <tr key={contact.id}>
                                                    <td><input type='checkbox' /></td>
                                                    <td>{contact.firstname}</td>
                                                    <td>{contact?.business_name}</td>
                                                    <td>{contact?.profession?.name ? contact?.profession?.name : ""}</td>
                                                    <td>{contact?.phone && formatPhoneNumber(contact?.phone)}</td>
                                                    <td>{contact?.email}</td>
                                                </tr>
                                            </tbody>))}
                                    </table>)}
                            {userss?.length > 0 && (
                                <div className="pagination">
                                    {renderPageNumbers()}
                                </div>
                            )}
                        </div>
                    }
                </>

                {/* PreDefiened Templates and custom email form */}
                <>
                    <div className="template-grid">
                        {/* Custom email template */}

                        {active === 1 && <>
                            <div className="custom-text-tab-sec">
                                <input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={content?.emailContent}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        setContent({ ...content, emailContent: data });
                                    }}
                                    config={{
                                        toolbar: [
                                            "heading",
                                            "|",
                                            "bold",
                                            "italic",
                                            "link",
                                            "|",
                                            "bulletedList",
                                            "numberedList",
                                            "|",
                                            "undo",
                                            "redo",
                                        ],
                                    }}
                                    className="custom-ckeditor"
                                    style={{ width: "100%" }}
                                />

                                {subject && content?.emailContent ? <div className="camp-gap camp-gap-button-wrapper-nxt">
                                    <div className="icon-dashboard share-ref-top-wrp">
                                        <button >
                                            <p>Share</p>
                                        </button>
                                    </div>
                                </div> : ""}
                            </div>
                        </>
                        }


                        {/* {active === 4 && customEmail === 1 && <>
                            <div className="custom-text-tab-sec">
                                <input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={content?.emailContent}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        setContent({ ...content, emailContent: data });
                                    }}
                                    config={{
                                        toolbar: [
                                            "heading",
                                            "|",
                                            "bold",
                                            "italic",
                                            "link",
                                            "|",
                                            "bulletedList",
                                            "numberedList",
                                            "|",
                                            "undo",
                                            "redo",
                                        ],
                                    }}
                                    className="custom-ckeditor"
                                    style={{ width: "100%" }}
                                />

                                {subject && content?.emailContent ? <div className="camp-gap camp-gap-button-wrapper-nxt">
                                    <div className="icon-dashboard share-ref-top-wrp">
                                        <button >
                                            <p>Share</p>
                                        </button>
                                    </div>
                                </div> : ""}
                            </div>
                        </>
                        } */}


                        {active === 3 && customEmail === 0 && <>
                            {/* <div className="template-item custom-email-template-flex"
                                style={{ border: '1px solid', overflow: 'hidden' }}

                            >
                                <div style={{ fontSize: '199px', overflow: 'hidden' }}
                                    onClick={() => { setActive(4); setCustomEmail(1) }}
                                >
                                    +
                                </div>
                            </div> */}
                            {templates.map((template) => (
                                <div key={template.id} className="template-item">
                                    <label htmlFor={template.id}></label>
                                    <div
                                        className="email-template-box"
                                        style={{
                                            width: "100%",
                                            height: "100px",
                                            border: "1px solid #ccc",
                                            overflow: "hidden",
                                        }}
                                    >
                                        <div dangerouslySetInnerHTML={{ __html: template.text }} />
                                        <button >Choose template</button>

                                    </div>
                                    <div className="email-template-name" >{template.name}</div>
                                </div>
                            ))}
                        </>}
                    </div>
                </>
            </div>
        </>

    )
}

export default EmailCampaign2
