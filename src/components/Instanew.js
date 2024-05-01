import { InstagramLogin } from '@amraneze/react-instagram-login';


const YourComponent = () => {
const responseInstagram = (response) => {

};

const redirectUrl="http://localhost:3000/social-media"
return (

    <div>
   <InstagramLogin
    clientId="1406399590235210"
    buttonText="Login"
    onSuccess={responseInstagram}
    onFailure={responseInstagram}
    redirectUri={redirectUrl}
    scope="user_profile"
  />,
    </div>
  );
};

export default YourComponent;