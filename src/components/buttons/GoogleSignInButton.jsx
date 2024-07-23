import React, { useEffect, useState } from 'react'
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"
import Translator from '../Translator';
import { useGoogleLogin } from '@react-oauth/google';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useNavigate , Link } from "react-router-dom"

function GoogleSignInButton({GlobalState}) {
  const {
    api, language,
    setAuthenticated
  } = GlobalState;

	const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

	const googleSignInValidation = async (token) => {
		try {
			const response = await fetch(`${api}/sign_in_google.php?token=${token}`);
			const data = await response.json();

      if (data.status=="success"){
        setAuthenticated(true);
        localStorage.setItem('token', data.token);
        navigate('/account');
        Toastify({
          text: Translator({code:language, value:"Success"}).props.children,
          duration: 3000,
          className: "toast success",
          gravity: "bottom",
          position: "right",
        }).showToast();
			}else{
        throw new Error("Data Status Error");
      }
    } catch (error) {
      console.error('googleSignInValidation:', error);
      Toastify({
        text: Translator({code:language, value:"Oops! Something didn't go as planned"}).props.children,
        duration: 3000,
        className: "toast warning",
        gravity: "bottom",
        position: "right",
      }).showToast();
    } finally {
      setLoading(false);
    }
	};

	const login = useGoogleLogin({
		onSuccess: tokenResponse => {
			googleSignInValidation(tokenResponse.access_token);
		},
    onNonOAuthError: () => {
      setLoading(false);
    },
    onError: () => {
      Toastify({
        text: Translator({code:language, value:"Oops! Something didn't go as planned"}).props.children,
        duration: 3000,
        className: "toast warning",
        gravity: "bottom",
        position: "right",
      }).showToast();
      setLoading(false);
    }
	});

  return (
		<button className='button google-sign' onClick={() => { setLoading(true); login(); }}>
			{loading && (
				<span className="button-loader"></span>
			)}
			<FontAwesomeIcon 
				icon={faGoogle}
			/>
			<Translator
				code={language}
				value={`Continue with Google`}
			/>
		</button>
  )
}

export default GoogleSignInButton
