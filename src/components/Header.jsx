import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Translator from './Translator';
import Picture from './Picture';

function Header({GlobalState}) {
    const {
        language,setLanguage,
        authenticated,
    } = GlobalState;

    const handleLanguageWindow = (event) => {
        var languages = document.querySelector(".avail-languages");
        var display = window.getComputedStyle(languages).display;
        if (display==="none"){
          languages.style.display = "flex";
          document.querySelector("#root").addEventListener('click', handleLanguageWindow);
        }else{
          languages.style.display = "none";
          document.querySelector("#root").removeEventListener('click', handleLanguageWindow);
        }
    };

  const handleChangeLanguage = (event,code) => {
    setLanguage(code);
    handleLanguageWindow();
  };

  useEffect(() => {
    localStorage.setItem('selectedLanguage', language);
  }, [language]);

  return (
    <header>
      <div className="wrapper">
				<div className="left-side">
					<Link className="logo" to="/">
						<img 
							src={`/images/reserwave/logo512_transparent.png`} 
							alt={'Reserwave Logo'}
							title='Reserwave Logo'
							loading="eager"
							width={100}
							height={100}
						></img>
					</Link>
				</div>
				<nav>
					{/* <Link to="/">Book</Link>
					<Link to="/">Become a Partner</Link> */}
				</nav>
				<div className="right-side">
					<div className="language-selector">
						<button onClick={handleLanguageWindow} className="language-selector-button">
							<FontAwesomeIcon className="global-icon" icon={faGlobe} />
							{language}
							<FontAwesomeIcon className="open-icon" icon={faChevronDown}/>
						</button>
						<div className="avail-languages">
							<button onClick={(event) => handleChangeLanguage(event,"EN")}>English</button>
							<button onClick={(event) => handleChangeLanguage(event,"EL")}>Ελληνικά</button>
						</div>
					</div>
					{authenticated ? (
						<Link className="button" to="/account">
							<Translator code={language} value="Account" />
							<FontAwesomeIcon icon={faUser}/>
						</Link>
					) : (
						<Link className="button" to="/login">
							<Translator code={language} value="Sign In"/>
							<FontAwesomeIcon icon={faUser}/>
						</Link>
					)}
				</div>
      </div>
    </header>
  )
}

export default Header
