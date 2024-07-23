import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate , Link } from "react-router-dom"
import Translator from "../Translator";
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"
import GoogleSignInButton from '../buttons/GoogleSignInButton';

function ForgotForm({GlobalState}) {
  const {
    api, language,
    userData, authenticated, setAuthenticated
  } = GlobalState;
  const navigate = useNavigate();

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const token = params.get('token');

  const [loading, setLoading] = useState(false);

  const handleForgotSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    const email = document.querySelector('#email').value;

    if (!email){
      setLoading(false);
      Toastify({
        text: Translator({code:language, value:"Please enter your email to submit a recovery request"}).props.children,
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
    }

    const formData = {
        email: email,
    };

    try {
      const response = await fetch(`${api}/forgot_password.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.status=="success"){
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
      console.error('handleForgotSubmit:', error);
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

  const handleRecoverySubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    const password = document.querySelector('#password').value;
    const password2 = document.querySelector('#password2').value;

    if (!password || !password2){
      setLoading(false);
      Toastify({
        text: Translator({code:language, value:"Please enter a new password to continue"}).props.children,
        duration: 3000,
        className: "toast warning",
        gravity: "bottom",
        position: "right",
      }).showToast();
      return;
    }else if (password != password2){
      setLoading(false);
      Toastify({
        text: Translator({code:language, value:"Passwords must be identical"}).props.children,
        duration: 3000,
        className: "toast warning",
        gravity: "bottom",
        position: "right",
      }).showToast();
      return;
    }

    const formData = {
        token: token,
        password: password,
    };

    try {
      const response = await fetch(`${api}/change_password.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.status=="success"){
        setAuthenticated(false);
        localStorage.removeItem('token');
        navigate('/login');
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
      console.error('handleRecoverySubmit:', error);
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
      {token ? (
        <>
          <form id="recovery-form">
            <h1 className='form-title'>
              <Translator
                code={language}
                value={"Account Recovery"}
              />
            </h1>
            <div className="form-input">
              <input type="password" id="password" name="password" autoComplete="off" required />
              <label htmlFor="password" className="label-name">
                  <span className="content-name">
                    <Translator
                      code={language}
                      value={`New Password`}
                    />
                  </span>
              </label>
            </div>
            <div className="form-input">
              <input type="password" id="password2" name="password2" autoComplete="off" required />
              <label htmlFor="password2" className="label-name">
                  <span className="content-name">
                    <Translator
                      code={language}
                      value={`Confirm New Password`}
                    />
                  </span>
              </label>
            </div>
          </form>
          <button id="recovery-button" className="button form-button" onClick={handleRecoverySubmit}>
            {loading && (
              <span className="button-loader"></span>
            )}
            <Translator
              code={language}
              value={"Submit"}
            />
          </button>
        </>
      ) : (
        <>
          <form id="forgot-form">
            <h1 className='form-title'>
              <Translator
                code={language}
                value={"Account Recovery"}
              />
            </h1>
            <div className="form-input">
              <input type="text" id="email" name="email" autoComplete="off" required />
              <label htmlFor="email" className="label-name">
                  <span className="content-name">E-mail</span>
              </label>
            </div>
          </form>
          <button id="forgot-button" className="button form-button" onClick={handleForgotSubmit}>
            {loading && (
              <span className="button-loader"></span>
            )}
            <Translator
              code={language}
              value={"Submit"}
            />
          </button>
          <Link className="link" to="/login">
            <Translator
              code={language}
              value={"Sign In"}
            />
          </Link>
          {` / `}
          <Link className="link" to="/register">
            <Translator
              code={language}
              value={"Sign Up"}
            />
          </Link>
        </>
      )}
    </>
  )
}

export default ForgotForm
