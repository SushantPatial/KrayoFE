import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GoogleSignin from './components/GoogleSignin';
import Home from './components/Home';
import { gapi } from 'gapi-script';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { verify } from 'crypto';

const clientId = process.env.REACT_APP_CLIENT_ID as string; 

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

  useEffect(() => {
    if (localStorage.getItem('token') === null) {
      setIsLoggedIn(false);
    } else {
      axios.post(process.env.REACT_APP_BACKEND_URL + '/api/verify', {}, {
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then((res) => {
          console.log(res);
          if (res.data.result)
            setIsLoggedIn(true);
          else
            setIsLoggedIn(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoggedIn(false);
        });
    }
  }, [])

  

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


// React takes a lot of time to build the react-scripts. A walkaround for this will be to use esbuild (react-app-rewired-esbuild) which speeds up the development process. The problem is that it causes fast_refresh to fail. While these methods can be used to speed up the development process. It is not advisable to use them for production level.