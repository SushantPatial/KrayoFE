import React, {  } from 'react'
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';
import { toast } from 'react-toastify';

const clientId = process.env.REACT_APP_CLIENT_ID as string; 

const GoogleSignin:React.FC = () => {

    const onSuccess = (res: any) => {
        axios.post(process.env.REACT_APP_BACKEND_URL + '/api/login', res, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((result) => {
            localStorage.setItem('name', res.profileObj.givenName);
            localStorage.setItem('token', res.accessToken);
            window.location.href = '/';
        })
        .catch((err) => {
            toast.error("Couldn't login. Try again later");
        })
    }

    const onFailure = (res: any) => {
        toast.error("Couldn't login. Try again later");
        console.log('Login Failed', res);
    }

    return (
        <div className='login'>
            <h2>Login with your Google account to continue</h2>
            <GoogleLogin
                clientId={clientId}
                buttonText='Login'
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
            />
        </div>
    )
}

export default GoogleSignin;