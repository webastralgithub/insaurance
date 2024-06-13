import React, { useState, useEffect, useContext } from 'react';
import FacebookLoginButton from './FacebookLoginButton';
import LinkedIn from './LinkedIn';
import Instagram from './Instagram';
import ImageUploader from './ImageUploader';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  WhatsappShareButton,
  WhatsappIcon
} from 'react-share';
import { images } from 'react-creditcard-validator';
// Functions for connecting/disconnecting accounts

const SocialMediaLogin = () => {
  const [postdescription, setpostdescription] = useState("")
  const [connectedAccounts, setConnectedAccounts] = useState({
    facebook: false,
    linkedin: false,
    instagram: false,
  });

  const url = process.env.REACT_APP_API_URL
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const headers = {
    Authorization: auth.token,
  };
  const navigate = useNavigate()
  const [editedContact, setEditedContact] = useState({});



  const fetchConnectedAccounts = () => {

  }
  const shareUrl = 'http://insurancecrm.nvinfobase.com/categories/6';
  const title = 'Critical Illness Insurance';
  const imageUrl = 'https://insauranceadmin.nvinfobase.com/storage/uploads/jL8ADup73NCwUx6h6xpiE6xNTVCz7nOB8lNAmAFA.webp'; // URL of the image to be shared
  const connectAccount = (platform) => {

  }
  const disconnectAccount = () => {

  }


  // Function to check currently connected accounts
  const checkConnectedAccounts = async () => {
    // API call to fetch user's connected accounts from the backend
    const connected = await fetchConnectedAccounts(); // Replace with your API function

    if (connected) {
      setConnectedAccounts({
        facebook: connected.facebook,
        linkedin: connected.linkedin,
        instagram: connected.instagram,
      });
    }
  };
  const shareOnInstagram = () => {
    const imageUrl = 'https://insauranceadmin.nvinfobase.com/storage/uploads/taCoHaH5dk3dSrtlFwSoYCeD5wbNSLJE9EgaHsvX.jpg'; // Replace with your image URL
    const caption = 'Critical Illness Insurance'; // Replace with your caption

    const encodedCaption = encodeURIComponent(caption); // Encode caption for URL

    // Construct the Instagram sharing URL
    const instagramUrl = `https://www.instagram.com/create?caption=${encodedCaption}&url=${imageUrl}`;

    // Open the Instagram sharing URL in a new tab
    window.open(instagramUrl, '_blank');
  };
  const postToFacebook = async (accessToken, message) => {
    try {
      const response = await fetch(`https://graph.facebook.com/me/feed?access_token=${accessToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message }),
      });

      if (response.ok) {
        toast.success('Posted to Facebook successfully!')

        // Handle success
      } else {
        toast.error('Failed to post to Facebook:', response)
        console.error('Failed to post to Facebook:', response);
        // Handle error
      }
    } catch (error) {
      console.error('Error posting to Facebook:', error);
      // Handle error
    }
  };

  // Usage example:
  // Call postToFacebook function with the obtained accessToken and message
  const accessToken = 'EAACtatswqk0BOwXE7p3dmCyLCOw41eBQVKmXXokHkrcusvgPs2VHisDEymDLMcFkflAaydup9QGNYieBfHt2qxaDSKdEscSzHvd5HZBsB8vPFvxx45r0bZCKZA4gfdHDv5CZBTJEf9qtEEdnDpeRYlWwnjPKeBrNru9oznCDnB1vcvpYc3DB2FnqzCCN15PzF1IZAlDBEMQyqNGpE6AoKb3xPSEoZD'; // Replace with the obtained access token
  const message = 'Hello from my app!';

  ;
  //   const editedContact={
  //     "id": 6,
  //     "name": "Travel Insurance",
  //     "images": "[\"https:\\/\\/insauranceadmin.nvinfobase.com\\/storage\\/uploads\\/jL8ADup73NCwUx6h6xpiE6xNTVCz7nOB8lNAmAFA.webp\"]",
  //     "notes": "<p>Covers medical emergencies, trip cancellations, lost luggage, and other unexpected events while traveling domestically or internationally.</p>",
  //     "created_at": "2023-11-29T09:22:35.000000Z",
  //     "updated_at": "2023-11-29T13:07:32.000000Z"
  // }

  const getPostById = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}api/post/${id}`, { headers });
      const responseData = await res.data
      setEditedContact(responseData)
    } catch (error) {
      console.error(error)
    }
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedContact(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  useEffect(() => {
    checkConnectedAccounts();
    getPostById() // Check connected accounts on component mount
  }, []);

  const handleConnect = async (platform) => {
    const success = await connectAccount(platform); // Function to connect account on the backend

    if (success) {
      setConnectedAccounts({ ...connectedAccounts, [platform]: true });
    }
  };

  const handleDisconnect = async (platform) => {
    const success = await disconnectAccount(platform); // Function to disconnect account on the backend
    if (success) {
      setConnectedAccounts({ ...connectedAccounts, [platform]: false });
    }
  };
  const handleSave = async () => {
    const newData = {
      name: editedContact.name,
      description: postdescription,
      images: editedContact.images
    }
    try {
      const response = axios.put(`${url}api/post/${editedContact.id}`, newData, { headers })

      if ((await response).status === 200) {
        navigate("/posts")
      } else {
        toast.error("Can't Update the Data Server is Busy")
      }
    } catch (error) {
      toast.error("Server is Busy")
    }
  }


  return (
    <div className="form-user-add">
      <div className="add_property_btn">
        <div style={{ marginBottom: "20px" }} className='inner-pages-top'>
          <h3>Social Media Share</h3>
          <div className="new-social" style={{ display: "flex" }} >
            <div className='facebook-share-btn'>
              <FacebookLoginButton editedContact={editedContact} connectedAccounts={connectedAccounts} setConnectedAccounts={setConnectedAccounts} />
            </div>
            <LinkedIn editedContact={editedContact} />
            <WhatsappShareButton
              url={editedContact.images}
              title={editedContact.name}
              separator=":: "
            >What`s app
            </WhatsappShareButton>
            {/* <button onClick={shareOnInstagram}> Instagram</button> */}
            <Instagram editedContact={editedContact} />
          </div>

        </div>
        <div className="form-user-edit-inner-wrap form-user-add-wrapper form-catagory-edit-sec social-media-post-sec">
          <div className="form-catagory-edit-sec-left">
            <div className="form-user-add-inner-wrap">
              <label>Name</label>
              <div className="edit-new-input">
                <input
                  name="name"
                  value={editedContact.name}
                  onChange={handleInputChange}
                //disabled
                />
              </div>
            </div>
            <div style={{marginTop : "40px"}}>
              {editedContact.images ? <img src={editedContact?.images} style={{ height: "300px", width: "400px" }}></img> : "no image found"}
            </div>
          </div>

          <div className="form-catagory-edit-sec-right">
            <div className="add-contact-user-custom-right">
              <div className="form-user-add-inner-wrap">
                <label>Description</label>
                <CKEditor
                  editor={ClassicEditor}
                  data={editedContact?.description ? editedContact.description : ""}
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
                  className="custom-ckeditor" // Add a custom class for CKEditor container
                  style={{ width: "100%", maxWidth: "800px", height: "200px" }}
                  // onChange={(event, editor) => {
                  //   const data = editor.getData();
                  //   setEditedContact({ ...editedContact, description: data });
                  // }}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setpostdescription(data);
                }}
                />
              </div>
            </div>
          </div>


          <div className="form-user-add-inner-btm-btn-wrap">
            <button style={{ background: "#004686" }} onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaLogin;
