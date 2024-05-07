import React from 'react';
import { FacebookShareButton } from 'react-share';
import { Helmet } from 'react-helmet';

const FacebookLoginButton = (props) => {

  const shareUrl = `${process.env.REACT_APP_API_URL}/share/${props.editedContact.id}`;

  return (
    <>
    
      <FacebookShareButton url={shareUrl}>
         Facebook
      </FacebookShareButton>
    </>
  );
};

export default FacebookLoginButton;
