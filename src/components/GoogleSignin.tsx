import React, { useState } from 'react'
import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const clientId = "917824582757-q2akd2q0n99o6b6m7iauaenj8bc6bdel.apps.googleusercontent.com"; // Store in .env

const GoogleSignin:React.FC = () => {

    const onSuccess = (res: any) => {
        axios.post('https://krayo-be.vercel.app/api/login', res, {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        })
        .then((result) => {
            localStorage.setItem('name', res.profileObj.givenName);
            localStorage.setItem('email', res.profileObj.email);
            localStorage.setItem('token', res.accessToken);
            window.location.href = '/';
        })
        .catch((err) => {
            toast.error("Couldn't login. Try again later");
        })
    }

    const onFailure = (res: any) => {
        toast.error("Couldn't login. Try again later");
        console.log('[Login Failed] res:', res);
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
