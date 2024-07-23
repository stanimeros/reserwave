import React, { useState, useEffect } from 'react';
import { useNavigate , Link } from "react-router-dom"
import Translator from "../Translator";
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

function PartnerForm({GlobalState}) {
  const {
    api, language,
  } = GlobalState;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;

    if (!name){
      setLoading(false);
      Toastify({
        text: Translator({code:language, value:"Please enter your name to proceed"}).props.children,
        duration: 3000,
        className: "toast warning",
        gravity: "bottom",
        position: "right",
      }).showToast();
      return;
    }else if (!email){
      setLoading(false);
      Toastify({
        text: Translator({code:language, value:"Email cannot be empty"}).props.children,
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
        name: name,
        email: email,
    };

    try {
      const response = await fetch(`${api}/become_partner.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.status=="success"){
        var inputName = document.querySelector('#name');
        inputName.value = '';
        var inputEmail = document.querySelector('#email');
        inputEmail.value = '';
        Toastify({
          text: Translator({code:language, value:"Will be in touch shortly"}).props.children,
          duration: 3000,
          className: "toast success",
          gravity: "bottom",
          position: "right",
        }).showToast();
      }else{
        throw new Error("Data Status Error");
      }
    } catch (error) {
      console.error('handleSubmit:', error);
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
      <form id="partner-form">
        <div className="form-input">
          <input type="text" id="name" name="name" autoComplete="off" required />
          <label htmlFor="name" className="label-name">
              <span className="content-name">
                <Translator
                  code={language}
                  value={"Full Name"}
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
        <button id="partner-button" className="button form-button" onClick={handleSubmit}>
          {loading && (
            <span className="button-loader"></span>
          )}
          <Translator
            code={language}
            value={"Request Presentation"}
          />
        </button>
      </form>
    </>
  )
}

export default PartnerForm
