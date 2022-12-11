import React, { useState } from 'react'
import { GoogleLogout } from 'react-google-login';

const clientId = process.env.REACT_APP_CLIENT_ID as string; 

const GoogleSignout:React.FC = () => {

    const onSuccess = () => {
        console.log('[Logout Success]');
        localStorage.removeItem('name');
        localStorage.removeItem('token');
        window.location.href = '/';
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
