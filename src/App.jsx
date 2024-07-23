import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { Routes, Route } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import Category from './pages/Category';
import Service from './pages/Service';
import Store from './pages/Store';
import Login from './pages/Login';
import Register from './pages/Register';
import Forgot from './pages/Forgot';
import Page404 from './pages/Page404';
import Account from './pages/Account';
import BecomeAPartner from './pages/BecomeAPartner';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
// const Home = lazy(() => import('./pages/Home'));
// const Category = lazy(() => import('./pages/Category'));
// const Service = lazy(() => import('./pages/Service'));
// const Store = lazy(() => import('./pages/Store'));
// const Login = lazy(() => import('./pages/Login'));
// const Register = lazy(() => import('./pages/Register'));
// const Account = lazy(() => import('./pages/Account'));
// const BecomeAPartner = lazy(() => import('./pages/BecomeAPartner'));
// const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
// const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
// const Page404 = lazy(() => import('./pages/Page404'));

function App() {
    const [categoriesData,setCategoriesData] = useState([]);
    const [servicesData,setServicesData] = useState([]);
    const [storesData,setStoresData] = useState([]);
    const [storeData,setStoreData] = useState([]);
    const [storeServicesData,setStoreServicesData] = useState([]);
    const [storeWorkingHoursData,setStoreWorkingHoursData] = useState([]);
    const [storeReservationsData,setStoreReservationsData] = useState([]);

    const [selectedServiceId,setSelectedServiceId] = useState();
    const [selectedCombinationIds,setSelectedCombinationIds] = useState([]);
    const [selectedDay,setSelectedDay] = useState();
    const [selectedMonth,setSelectedMonth] = useState();
    const [selectedYear,setSelectedYear] = useState();
    const [selectedTime,setSelectedTime] = useState();

    const [authenticated, setAuthenticated] = useState(null);
    const [searchLon,setSearchLon] = useState(localStorage.getItem('searchLon')); 
    const [searchLat,setSearchLat] = useState(localStorage.getItem('searchLat')); 
    const [resultsOrigin,setResultsOrigin] = useState(localStorage.getItem('resultsOrigin')); 
  
    const [userData, setUserData] = useState([]);
    const [language,setLanguage] = useState(localStorage.getItem('selectedLanguage') || 'EN'); 
    const [theme,setTheme] = useState('dark');
    const [api, setApi] = useState(
      window.location.href.includes('localhost')
        ? 'http://localhost/reserwave/public/api'
        : '/api'
    );
    
    const GlobalState = {
      categoriesData,setCategoriesData,
      servicesData,setServicesData,
      storesData,setStoresData,
      storeData,setStoreData,
      storeServicesData,setStoreServicesData,
      storeWorkingHoursData,setStoreWorkingHoursData,
      storeReservationsData,setStoreReservationsData,
      selectedServiceId,setSelectedServiceId,
      selectedCombinationIds,setSelectedCombinationIds,
      selectedDay,setSelectedDay,
      selectedMonth,setSelectedMonth,
      selectedYear,setSelectedYear,
      selectedTime,setSelectedTime,
      authenticated, setAuthenticated,
      searchLon,setSearchLon,
      searchLat,setSearchLat,
      resultsOrigin,setResultsOrigin,
      userData, setUserData,
      language,setLanguage,
      theme,setTheme,
      api,setApi
    }

    useEffect(() => {
      const checkAuthenticationStatus = async () => {
        try {
          const response = await fetch(`${api}/check_auth.php?token=${localStorage.getItem('token')}`, {
            method: 'GET',
            credentials: 'include',
          });
    
          if (response.ok) {
            const data = await response.json();
            setAuthenticated(data.authenticated);
          } else {
            setAuthenticated(false);
          }
        } catch (error) {
          console.error('checkAuthenticationStatus:', error);
        }
      };

      const fetchIpLocationInformation = async () => {
        try {
          const response = await fetch(`${api}/get_ip.php`);
          if (response.ok) {
            const data = await response.json();
            const [lat, lon] = data.loc.split(',');
            setSearchLat(lat);
            setSearchLon(lon);
            setResultsOrigin(data.city);
            if (data.country == `GR`){
              setLanguage(`EL`);
            }else{
              setLanguage(`EN`);
            }
          }

        } catch (error) {
          console.error('fetchIpLocationInformation:', error);
        }
      };

      if (!searchLat || !searchLon || !resultsOrigin){
        fetchIpLocationInformation();
      }

      checkAuthenticationStatus();

      if (!window.location.href.includes('localhost')) {
        const gaScript = document.createElement('script');
        gaScript.setAttribute('async', 'true');
        
        gaScript.onload = function() {
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-25D2HMM4MS');
        };
        
        gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-25D2HMM4MS';
        document.body.append(gaScript);
      }
    }, []);

    useEffect(() => {
      if (authenticated && userData.length==0){
        const getUserData = async () => {
          try {
            const response = await fetch(`${api}/get_user.php?token=${localStorage.getItem('token')}`, {
              method: 'GET',
              credentials: 'include',
            });
      
            if (response.ok) {
              const data = await response.json();
              setUserData(data);
            }

          } catch (error) {
            console.error('getUserData:', error);
          }
        };

        getUserData();
      }else if (authenticated==false){
        setUserData([]);
      }
    }, [authenticated]);

    const navigate = useNavigate();
    useEffect(() => {
      window.scrollTo({
        top: 0,
        //behavior: 'smooth',
      });
  
    }, [navigate]);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <meta name="description" content="Your one-stop destination for hassle-free online booking! Explore a wide range of stores and services, from salons to restaurants, and book your appointments seamlessly."/>
          <meta property="og:description" content="Your one-stop destination for hassle-free online booking! Explore a wide range of stores and services, from salons to restaurants, and book your appointments seamlessly."/>
          <meta property="og:type" content='website' />
          <meta property="og:image" content='https://reserwave.com/images/reserwave/logo512_transparent.png' />
          <meta property='og:site_name' content='Reserwave' />
          <meta property="og:url" content={window.location.href} />
          <link rel="canonical" href={window.location.href.split('?')[0]}></link>
          <meta name="robots" content="index, follow" />
          {language=='EN' && (
            <meta http-equiv="Content-Language" content='en-us'/>
          )}
          {language=='EL' && (
            <meta http-equiv="Content-Language" content='el-gr'/>
          )}
        </Helmet>
      </HelmetProvider>
      <Header GlobalState={GlobalState}/>
      {/* <Suspense fallback={<div className='page-loader'></div>}> */}
      <GoogleOAuthProvider clientId="876243670197-7hf4j93u64vg85o4ceshnve85a0lfqpv.apps.googleusercontent.com">
        <Routes>
          <Route exact path="/" element={<Home GlobalState={GlobalState} />} />
          <Route path=":category_slug" element={<Category GlobalState={GlobalState} />} />
          <Route path=":category_slug/:service_slug" element={<Service GlobalState={GlobalState} />} />
          <Route path=":category_slug/:service_slug/:store_slug" element={<Store GlobalState={GlobalState} />} />
          <Route path="login" element={<Login GlobalState={GlobalState} />} />
          <Route path="register" element={<Register GlobalState={GlobalState} />} />
          <Route path="forgot" element={<Forgot GlobalState={GlobalState} />} />
          <Route path="account" element={<Account GlobalState={GlobalState} />} />
          <Route path="become-a-partner" element={<BecomeAPartner GlobalState={GlobalState} />} />
          <Route path="terms-and-conditions" element={<TermsAndConditions GlobalState={GlobalState} />} />
          <Route path="privacy-policy" element={<PrivacyPolicy GlobalState={GlobalState} />} />
          <Route path="404" element={<Page404 GlobalState={GlobalState} />} />
          <Route path="*" element={<Page404 GlobalState={GlobalState} />} />
        </Routes>
      {/* </Suspense> */}
      </GoogleOAuthProvider>
      <Footer GlobalState={GlobalState}/>
    </>
  )
}

export default App;