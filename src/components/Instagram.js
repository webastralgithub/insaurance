import React from 'react';
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton } from 'react-share';
import { Helmet } from 'react-helmet';
const Instagram = () => {
  const shareUrl = 'http://insurancecrm.nvinfobase.com/categories/8';
  const title = 'Critical Illness Insurance';
  const imageUrl = 'https://insauranceadmin.nvinfobase.com/storage/uploads/taCoHaH5dk3dSrtlFwSoYCeD5wbNSLJE9EgaHsvX.jpg'; // URL of the image to be shared

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta property="og:url" content={shareUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content="Description of your content." />
        <meta property="og:image" content={imageUrl} />

        {/* Other necessary meta tags */}
      </Helmet>
      <TwitterShareButton url={shareUrl} quote={title} imageUrl={imageUrl}>
         Twitter
      </TwitterShareButton>
    </>
  );
};

export default Instagram;
