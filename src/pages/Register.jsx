import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useNavigate } from "react-router-dom";
import Translator from "../components/Translator";
import RegisterForm from "../components/forms/RegisterForm";

function Register({GlobalState}) {
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
            <title>{Translator({code:language, value:"Sign Up"}).props.children}</title>
            <meta name="description" content={`Sign up for an account today and unlock exclusive benefits. Join our community and get started with ease.`}/>
            <meta property="og:title" content={Translator({code:language,value:"Sign Up"}).props.children} />
            <meta property="og:description" content={`Sign up for an account today and unlock exclusive benefits. Join our community and get started with ease.`} />
        </Helmet>
      </HelmetProvider>
      <main>
        <div className="register-page page">
          <div className="page-content">
            <RegisterForm
              GlobalState = {GlobalState}
            />
          </div>
        </div>
      </main>
    </>
  )
}

export default Register
