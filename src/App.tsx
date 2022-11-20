import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GoogleSignin from './components/GoogleSignin';
import Home from './components/Home';
import { gapi } from 'gapi-script';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const clientId = "917824582757-q2akd2q0n99o6b6m7iauaenj8bc6bdel.apps.googleusercontent.com";

function App() {

  useEffect(() => {
    function start() {
      gapi.client.init({
        client_id: clientId,
        scope: ""
      })
    };

    gapi.load('client:auth2', start);
  }, [])


  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("token") !== null;
  });

  return (
    <Router>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/" element={ isLoggedIn ? <Home /> : <Navigate replace to='/login' /> }/>
        <Route path="/login" element={<GoogleSignin />} />
      </Routes>
    </Router>
  );
}

export default App;
