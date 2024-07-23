import React, { useState, useEffect } from 'react';
import { useNavigate , Link } from "react-router-dom"
import Translator from "../Translator";
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"
import GoogleSignInButton from '../buttons/GoogleSignInButton';

function LoginForm({GlobalState}) {
  const {
    api, language,
    setAuthenticated
  } = GlobalState;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    if (!email){
      setLoading(false);
      Toastify({
        text: Translator({code:language, value:"Please enter your email to log in"}).props.children,
        duration: 3000,
        className: "toast warning",
        gravity: "bottom",
        position: "right",
      }).showToast();
      return;
    }else if (email){
      var emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)){
        setLoading(false);
        Toastify({
          text: Translator({code:language, value:"The email entered is not valid"}).props.children,
          duration: 3000,
          className: "toast warning",
          gravity: "bottom",
          position: "right",
        }).showToast();
        return;
      }
    }else if (!password){
      setLoading(false);
      Toastify({
        text: Translator({code:language, value:"To proceed, enter your password"}).props.children,
        duration: 3000,
        className: "toast warning",
        gravity: "bottom",
        position: "right",
      }).showToast();
      return;
    }

    const formData = {
        email: email,
        password: password
    };

    try {
      const response = await fetch(`${api}/sign_in.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

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
      console.error('handleLoginSubmit:', error);
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
  }

  return (
    <>
      <form id="login-form">
        <h1 className='form-title'>
          <Translator
            code={language}
            value={"Sign In"}
          />
        </h1>
        <GoogleSignInButton
          GlobalState={GlobalState}
        />
        <div className='or-wrapper'>
          <Translator
            code={language}
            value={`or`}
          />
        </div>
        <div className="form-input">
          <input type="text" id="email" name="email" autoComplete="off" required />
          <label htmlFor="email" className="label-name">
              <span className="content-name">E-mail</span>
          </label>
        </div>
        <div className="form-input">
          <input type="password" id="password" name="password" autoComplete="off" required />
          <label htmlFor="password" className="label-name">
            <span className="content-name">
              <Translator
                code={language}
                value={"Password"}
              />
            </span>
          </label>
        </div>
      </form>
      <button id="login-button" className="button form-button" onClick={handleLoginSubmit}>
        {loading && (
          <span className="button-loader"></span>
        )}
        <Translator
          code={language}
          value={"Submit"}
        />
      </button>
      <Link className="link forgot" to="/forgot">
        <Translator
          code={language}
          value={"Forgot my password"}
        />
      </Link>
      <Link className="link" to="/register">
        <Translator
          code={language}
          value={"Sign Up"}
        />
      </Link>
    </>
  )
}

export default LoginForm
