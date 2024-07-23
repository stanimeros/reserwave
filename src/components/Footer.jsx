import React from 'react';
import { Link, NavLink } from "react-router-dom"
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlassLocation } from '@fortawesome/free-solid-svg-icons';
import { faHeart, faUser ,faHandshakeSimple } from '@fortawesome/free-solid-svg-icons';
import Translator from './Translator';

function Footer({GlobalState}) {
  const {
    userData, authenticated, language,
  } = GlobalState;
  
  const currentURL = window.location.href;

  return (
    <footer>
      <div className="footer-bar">
        <div className="copyright">
          <Translator 
            code={language} 
            value="Copyright © 2023 Reserwave - All rights reserved"
          />
        </div>
        <div className="footer-nav">
          <Link to="/terms-and-conditions">
          <Translator 
            code={language} 
            value="Terms & Conditions"
          />
          </Link>
          <Link to="/privacy-policy">
          <Translator 
            code={language} 
            value="Privacy Policy"
          />
          </Link>
          <Link to="/become-a-partner">
          <Translator 
            code={language} 
            value="Become a Partner"
          />
          </Link>
        </div>
      </div>
      <div className="mobile-nav">
        <NavLink to="/" 
          className={({ isActive }) => 
            !currentURL.includes('/account') &&
            !currentURL.includes('/login') &&
            !currentURL.includes('/register') &&
            !currentURL.includes('/forgot') &&
            !currentURL.includes('/become') &&
            !currentURL.includes('/terms') &&
            !currentURL.includes('/privacy') &&
            !currentURL.includes('/404')
            ? "button-nav active" : "button-nav"}>
          <FontAwesomeIcon icon={faMagnifyingGlassLocation} />
          <Translator 
            code={language} 
            value="Explore"
          />
        </NavLink>
        {authenticated ? (
          <>
            <NavLink to="account?tab=tab-2"
              className={({ isActive }) => currentURL.includes('/account?tab=tab-2') ? "button-nav active" : "button-nav"}>
              <FontAwesomeIcon icon={faHeart} />
              <Translator 
                code={language} 
                value="Favourites"
              />
            </NavLink>
            {userData.role == 'admin' ? (
              <NavLink to="/account?tab=tab-0"
                className={({ isActive }) => currentURL.includes('/account') && !currentURL.includes('tab-2') ? "button-nav active" : "button-nav"}>
                <FontAwesomeIcon icon={faUser} />
                <Translator 
                  code={language} 
                  value="Account"
                />
              </NavLink>
            ) : (
              <NavLink to="/account?tab=tab-1"
                className={({ isActive }) => currentURL.includes('/account') && !currentURL.includes('tab-2') ? "button-nav active" : "button-nav"}>
                <FontAwesomeIcon icon={faUser} />
                <Translator 
                  code={language} 
                  value="Account"
                />
              </NavLink>
            )}
          </>
        ) : (
          <>
            <NavLink to="/login"
              className={({ isActive }) => 
              currentURL.includes('/login') ||
              currentURL.includes('/register') ||
              currentURL.includes('/forgot')
              ? "button-nav active" : "button-nav"}>
              <FontAwesomeIcon icon={faUser} />
              <Translator 
                code={language} 
                value="Sign in"
              />
            </NavLink>
            <NavLink to="/become-a-partner" className="button-nav">
              <FontAwesomeIcon icon={faHandshakeSimple} />
              <Translator 
                code={language} 
                value="Partner"
              />
            </NavLink>
          </>
        )}
      </div>
    </footer>
  )
}

export default Footer
  