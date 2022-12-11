import React, {  } from 'react'
import { GoogleLogout } from 'react-google-login';
import axios from 'axios';
import { toast } from 'react-toastify';

const clientId = process.env.REACT_APP_CLIENT_ID as string; 

const GoogleSignout:React.FC = () => {

    const onSuccess = () => {
        axios.post(process.env.REACT_APP_BACKEND_URL + '/api/logout', {}, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then((result) => {
            console.log(result.data);
            localStorage.removeItem('name');
            localStorage.removeItem('token');
            window.location.href = '/';
        })
        .catch((err) => {
            toast.error("Couldn't logout. Try again later");
        })
    }

    return (
        <div>
            <GoogleLogout
                clientId={clientId}
                buttonText='Logout'
                onLogoutSuccess={onSuccess}
            />
        </div>
    )
}

export default GoogleSignout;
