import React from 'react';
import { FacebookShareButton } from 'react-share';
import { Helmet } from 'react-helmet';
const FacebookLoginButton = (props) => {
  const shareUrl = 'http://insurancecrm.nvinfobase.com';
  const title = props.editedContact.name;
  const imageUrl = props.editedContact.images; // URL of the image to be shared
  const description = props.editedContact.images?.replace(/(<([^>]+)>)/gi, '').slice(0, 100).replace(/(?<=\s)\S*$/i, '');
  console.log(title);
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta property="og:url" content={shareUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />

        {/* Other necessary meta tags */}
      </Helmet>
      <FacebookShareButton url={shareUrl} title={title} image={imageUrl}>
         Facebook
      </FacebookShareButton>
    </>
  );
};

export default FacebookLoginButton;
