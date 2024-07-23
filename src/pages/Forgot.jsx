import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { useNavigate } from "react-router-dom"
import Translator from "../components/Translator";
import ForgotForm from '../components/forms/ForgotForm';

function Forgot({GlobalState}) {
  const {
    authenticated,language
} = GlobalState;
const navigate = useNavigate();

  return (
    <>
      <HelmetProvider>
        <Helmet>
					<title>{Translator({code:language, value:"Account Recovery"}).props.children}</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
      </HelmetProvider>
      <main>
        <div className="login-page page">
          <div className="page-content">
            <ForgotForm GlobalState = {GlobalState} />
          </div>
        </div>
      </main>
    </>
  )
}

export default Forgot
