import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { useNavigate } from "react-router-dom"
import Translator from "../components/Translator";
import LoginForm from "../components/forms/LoginForm"

function Login({GlobalState}) {
  const {
    authenticated,language
} = GlobalState;
const navigate = useNavigate();

useEffect(() => {
  if (authenticated){
      navigate('/account');
  } 
}, [authenticated]);

  return (
    <>
      <HelmetProvider>
        <Helmet>
            <title>{Translator({code:language,value:"Sign In"}).props.children}</title>
            <meta name="description" content='Log in to your account to access personalized content and features. Stay connected and enjoy a seamless user experience.'/>
            <meta property="og:title" content={Translator({code:language,value:"Sign In"}).props.children} />
            <meta property="og:description" content='Log in to your account to access personalized content and features. Stay connected and enjoy a seamless user experience.' />
        </Helmet>
      </HelmetProvider>
      <main>
        <div className="login-page page">
          <div className="page-content">
            <LoginForm GlobalState = {GlobalState} />
          </div>
        </div>
      </main>
    </>
  )
}

export default Login
