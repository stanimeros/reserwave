import React, { useState, useEffect } from 'react';
import { useNavigate , Link } from "react-router-dom"
import Translator from '../Translator';
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"
import GoogleSignInButton from '../buttons/GoogleSignInButton';

function RegisterForm({GlobalState}) {
  const {
    api,language,
    setAuthenticated
  } = GlobalState;

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegisterSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    const firstName = document.querySelector('#firstName').value;
    const lastName = document.querySelector('#lastName').value;
    const email = document.querySelector('#email').value;
    const phone = document.querySelector('#phone').value;
    const password = document.querySelector('#password').value;

    if (!firstName){
      setLoading(false);
      Toastify({
        text: Translator({code:language, value:"Please provide your first name"}).props.children,
        duration: 3000,
        className: "toast warning",
        gravity: "bottom",
        position: "right",
      }).showToast();
      return;
    }else if (!lastName){
      setLoading(false);
      Toastify({
        text: Translator({code:language, value:"Please provide your last name"}).props.children,
        duration: 3000,
        className: "toast warning",
        gravity: "bottom",
        position: "right",
      }).showToast();
      return;
    }else if (!email){
      setLoading(false);
      Toastify({
        text: Translator({code:language, value:"Please enter your email"}).props.children,
        duration: 3000,
        className: "toast warning",
        gravity: "bottom",
        position: "right",
      }).showToast();
      return;
    }else if(email){
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
    }else if (!phone){
      setLoading(false);
      Toastify({
        text: Translator({code:language, value:"Please enter your phone number"}).props.children,
        duration: 3000,
        className: "toast warning",
        gravity: "bottom",
        position: "right",
      }).showToast();
      return;
    }else if (phone){
      var phoneRegex = /^\+?[0-9]{8,15}$/;
      if (!phoneRegex.test(phone)){
        setLoading(false);
        Toastify({
          text: Translator({code:language, value:"Please enter a valid phone number"}).props.children,
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
        text: Translator({code:language, value:"Please enter a password"}).props.children,
        duration: 3000,
        className: "toast warning",
        gravity: "bottom",
        position: "right",
      }).showToast();
      return;
    }else if (password.length<8){
      setLoading(false);
      Toastify({
        text: Translator({code:language, value:"Password must be at least 8 characters long"}).props.children,
        duration: 3000,
        className: "toast warning",
        gravity: "bottom",
        position: "right",
      }).showToast();
      return;
    }

    const formData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        password: password
    };

    try {
      const response = await fetch(`${api}/sign_up.php`, {
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
          text: Translator({code:language, value:"Greetings! You're now part of Reserwave"}).props.children,
          duration: 3000,
          className: "toast success",
          gravity: "bottom",
          position: "right",
        }).showToast();
      }else{
        throw new Error("Data Status Error");
      }
    } catch (error) {
      console.error('handleRegisterSubmit:', error);
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
      <form id="register-form">
        <h1 className='form-title'>
          <Translator
            code={language}
            value={"Sign Up"}
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
          <input type="text" id="firstName" name="firstName" autoComplete="off" required />
          <label htmlFor="firstName" className="label-name">
            <span className="content-name">
              <Translator
                code={language}
                value={"First Name"}
              />
            </span>
          </label>
        </div>
        <div className="form-input">
          <input type="text" id="lastName" name="lastName" autoComplete="off" required />
          <label htmlFor="lastName" className="label-name">
            <span className="content-name">
              <Translator
                code={language}
                value={"Last Name"}
              />
            </span>
          </label>
        </div>
        <div className="form-input">
          <input type="text" id="email" name="email" autoComplete="off" required />
          <label htmlFor="email" className="label-name">
              <span className="content-name">E-mail</span>
          </label>
        </div>
        <div className="form-input">
          <input type="text" id="phone" name="phone" autoComplete="off" required />
          <label htmlFor="phone" className="label-name">
            <span className="content-name">
              <Translator
                code={language}
                value={"Phone"}
              />
            </span>
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
      <button id="register-button" className="button form-button" onClick={handleRegisterSubmit}>
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
    </>
  )
}

export default RegisterForm
