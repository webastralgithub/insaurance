import React from 'react';
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton } from 'react-share';
import { Helmet } from 'react-helmet';

const Instagram = (props) => {
  const shareUrl = `${process.env.REACT_APP_API_URL}share/${props.editedContact.id}`;
  

  return (
    <>
      <TwitterShareButton url={shareUrl}>
         Twitter
      </TwitterShareButton>
    </>
  );
};

export default Instagram;
