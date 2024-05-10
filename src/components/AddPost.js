import React, { useState, useEffect, useContext } from 'react';
import FacebookLoginButton from './FacebookLoginButton';
import LinkedIn from './LinkedIn';
import Instagram from './Instagram';
import ImageUploader from './ImageUploader';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AuthContext } from './context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
// Functions for connecting/disconnecting accounts

const AddPost = () => {
  const [connectedAccounts, setConnectedAccounts] = useState({
    facebook: false,
    linkedin: false,
    instagram: false,
  });
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const url = process.env.REACT_APP_API_URL;
  const { auth } = useContext(AuthContext);
  const headers = {
    Authorization: auth.token,
  };

  const [post, setPost] = useState({
    name: "",
    title: "",
    description: "",
  });
  const [error, setError] = useState("");

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
    const connected = fetchConnectedAccounts(); // Replace with your API function

    if (connected) {
      setConnectedAccounts({
        facebook: connected.facebook,
        linkedin: connected.linkedin,
        instagram: connected.instagram,
      });
    }
  };

  const handleSaveClick = async (e) => {
    e.preventDefault();

    if (!post.name.trim() || images.length === 0) {
      toast.error("name and image is required")
      return;
    }
    const updateData = { ...post, images: images[0] }
    try {
      const response = await axios.post(`${url}api/post/save`, updateData, {
        headers,
      });

      if (response.status === 201) {
        // Contact added successfully
        navigate(`/social/${response.data.id}`)
        toast.success('Post added successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
        // Redirect to the contacts list page
      } else {
        console.error("Failed to add contact");
      }
    } catch (error) {
      console.error("An error occurred while adding a contact:", error);
    }

  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  // Usage example:
  // Call postToFacebook function with the obtained accessToken and message
  const accessToken = 'EAACtatswqk0BOwXE7p3dmCyLCOw41eBQVKmXXokHkrcusvgPs2VHisDEymDLMcFkflAaydup9QGNYieBfHt2qxaDSKdEscSzHvd5HZBsB8vPFvxx45r0bZCKZA4gfdHDv5CZBTJEf9qtEEdnDpeRYlWwnjPKeBrNru9oznCDnB1vcvpYc3DB2FnqzCCN15PzF1IZAlDBEMQyqNGpE6AoKb3xPSEoZD'; // Replace with the obtained access token
  const message = 'Hello from my app!';

  ;
  const editedContact = {
    "id": 6,
    "name": "Travel Insurance",
    "images": "[\"https:\\/\\/insauranceadmin.nvinfobase.com\\/storage\\/uploads\\/jL8ADup73NCwUx6h6xpiE6xNTVCz7nOB8lNAmAFA.webp\"]",
    "notes": "<p>Covers medical emergencies, trip cancellations, lost luggage, and other unexpected events while traveling domestically or internationally.</p>",
    "created_at": "2023-11-29T09:22:35.000000Z",
    "updated_at": "2023-11-29T13:07:32.000000Z"
  }

  useEffect(() => {
    checkConnectedAccounts(); // Check connected accounts on component mount
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

  return (
    <div className="form-user-add">
      <form onSubmit={handleSaveClick}>
        <div className="add_property_btn">
          <div style={{ marginBottom: "20px" }} className='inner-pages-top'>
            <h3>Add Post</h3>
          </div>
          <div className="form-user-edit-inner-wrap form-user-add-wrapper form-catagory-edit-sec">

            <div className="form-catagory-edit-sec-left">
              <div className="form-user-add-inner-wrap">
                <label>Name<span className="required-star">*</span></label>

                <div className="edit-new-input">
                  <input
                    name="name"
                    value={post.name}
                    onChange={handleChange}

                  />

                </div>
              </div>
              <ImageUploader
                images={images}
                setImages={setImages}
                mainImage={mainImage}
                setMainImage={setMainImage}
                headers={headers}
                url={url}
              />
            </div>

            <div className="form-catagory-edit-sec-right">
              <div className="add-contact-user-custom-right">
                <div className="form-user-add-inner-wrap">
                  <label>Description</label>
                  <CKEditor
                    editor={ClassicEditor}
                    data={post?.description ? post.description : ""}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setPost({ ...post, description: data });
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
                    className="custom-ckeditor" // Add a custom class for CKEditor container
                    style={{ width: "100%", maxWidth: "800px", height: "200px" }}
                  />
                </div>
              </div>
            </div>


            <div className="form-user-add-inner-btm-btn-wrap">
              <button type='submit' style={{ background: "#004686" }}>
                Save
              </button>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
};

export default AddPost;
