import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState, useEffect } from "react";

const ImageUploader = (props) => {
  const { images, setImages, headers, url } = props;
  const fileRef = useRef(null);

  const handleImageChange = async (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      const imageUrl = URL.createObjectURL(selectedImage);

      // Create a FormData object to send the selected image to the server
      const formData = new FormData();
      formData.append(`images[]`, selectedImage);

      try {
        const response = await fetch(`${url}api/upload-images`, {
          method: "POST", // Use POST for file uploads
          headers,
          body: formData,
        });

        if (response) {
          const responseData = await response.json(); // Parse the JSON response
          const uploadedImageUrl = responseData;
          console.log(uploadedImageUrl,"gchgfgfg")
          setImages(uploadedImageUrl);

          // Handle a successful API response here, if needed
        } else {
          // Handle API errors here, if needed
        }
      } catch (error) {
        // Handle network errors or other exceptions here
        console.error("Error uploading image:", error);
      }
    }
  };

  const deleteImage = () => {
    URL.revokeObjectURL(images);
    setImages(null);
  };

  return (
    <div className="image-uploader">
      <div className="upload-container">
        <input
          type="file"
          accept="image/*"
          className="file-input"
          ref={fileRef}
          onChange={handleImageChange}
        />

        <div className="upload-text" onClick={() => fileRef.current.click()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="upload-icon"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
              clipRule="evenodd"
            />
          </svg>

          <span>Upload Image</span>
        </div>
      </div>

      {images?.length>0 && (
        <div className="selected-images">
          <div className="image-item">
            <img src={images[0]} alt="Uploaded" />
            <FontAwesomeIcon
              icon={faTrash}
              className="delete-icon"
              onClick={deleteImage}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
