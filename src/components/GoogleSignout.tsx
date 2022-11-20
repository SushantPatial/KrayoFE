import React, { useState } from 'react'
import { GoogleLogout } from 'react-google-login';
import { useNavigate } from 'react-router-dom';

const clientId = '917824582757-q2akd2q0n99o6b6m7iauaenj8bc6bdel.apps.googleusercontent.com'; // Store in .env

const GoogleSignout:React.FC = () => {

    let navigate = useNavigate();

    const onSuccess = () => {
        console.log('[Logout Success]');
        localStorage.removeItem('name');
        localStorage.removeItem('email');
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
