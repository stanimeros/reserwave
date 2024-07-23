import { Helmet, HelmetProvider } from 'react-helmet-async'
import { Link, useNavigate } from "react-router-dom"
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Translator from "../components/Translator"
import AdminReservations from "../components/blocks/AdminReservations"
import CustomerReservations from "../components/blocks/CustomerReservations"
import FavouriteStores from "../components/blocks/FavouriteStores"
import StoreSettings from "../components/blocks/AccountSettings"
import swal from "sweetalert"
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faArrowLeftLong, faListCheck, faBookmark, faHeart, faGears } from '@fortawesome/free-solid-svg-icons';

function Account({GlobalState}) {
  const {
    api, language, userData,
    authenticated, setAuthenticated,
    setSelectedDay, setSelectedMonth, setSelectedYear,
    selectedDay, selectedMonth, selectedYear,
  } = GlobalState;

  const navigate = useNavigate();
  const [loadingLogout, setLoadingLogout] = useState(false);

  const [customerReservations, setCustomerReservations] = useState([]);
  const [adminReservations, setAdminReservations] = useState([]);
  const [skeletonCustomerReservations, setSkeletonCustomerReservations] = useState(true);
  const [skeletonAdminReservations, setSkeletonAdminReservations] = useState(true);

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const tabInURL = params.get('tab') || 'tab-1';

  useEffect(() => {
    console.log(tabInURL);
    var tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
      if (tabInURL != null && tabInURL!=tab.id){
        tab.classList.remove('active');
        document.querySelector(`#content-${tab.id}`).classList.remove('active');
      }
    });
  }, [tabInURL]);


  useEffect(() => {
    if (authenticated==false){
        navigate('/login');
    }
  }, [authenticated]);

  const fetchCustomerReservations = async () => {
    try {
      const response = await fetch(`${api}/get_customer_reservations.php?token=${userData.token}`);
      const data = await response.json();
      setCustomerReservations(data);
      setSkeletonCustomerReservations(false);
    } catch (error) {
      console.error('fetchCustomerReservations:', error);
    }
  };

  const fetchAdminReservations = async () => {
    try {
      const response = await fetch(`${api}/get_admin_reservations.php?token=${userData.token}&date=${selectedYear}-${selectedMonth}-${selectedDay}`);
      const data = await response.json();
      setAdminReservations(data);
      setSkeletonAdminReservations(false);
    } catch (error) {
      console.error('fetchAdminReservations:', error);
    }
  };

  useEffect(() => {
    if (userData.role){
      fetchCustomerReservations();
      if (userData.role==="admin"){
        fetchAdminReservations();
      }
    }
  }, [userData]);

  useEffect(() => {
    setSkeletonAdminReservations(true);
    if (userData.role==="admin"){
      fetchAdminReservations();
    }
  }, [selectedDay,selectedMonth,selectedYear]);

  useEffect(() => {    
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    if (!selectedDay || !selectedMonth || !selectedYear){
      //TODO
      setSelectedDay(currentDay);
      setSelectedMonth(currentMonth);
      setSelectedYear(currentYear);
    }
  }, []);

  const handleCancel = async (event,code) => {
    event.preventDefault();

    swal({
      title:Translator({code:language,value:`Double-check your decision`}).props.children,
      text:`${Translator({code:language,value:`This reservation will be permanently removed and cannot be restored`}).props.children}.`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        var loadingCancel = event.target.querySelector('.button-loader');
        if (!loadingCancel){
          var loadingCancel = event.target.parentNode.querySelector('.button-loader');
        }
        loadingCancel.classList.remove('ninja');
        deleteReservation(code, event);
      }
    });
  }

  const handleAccept = async (event, code) => {
    event.preventDefault();
    var loadingAccept = event.target.querySelector('.button-loader');
    if (!loadingAccept){
      var loadingAccept = event.target.parentNode.querySelector('.button-loader');
    }
    loadingAccept.classList.remove('ninja');
    acceptReservation(code, event);
  }

  const acceptReservation = async (code, event) => {
    try {
      const response = await fetch(`${api}/accept_store_reservation.php?reservationCode=${code}&token=${userData.token}`, {
        method: 'UPDATE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.status!="success"){
        throw new Error("Data Status Error");
      }
    } catch (error) {
      console.error('acceptReservation:', error);
      Toastify({
        text: Translator({code:language, value:"Oops! Something didn't go as planned"}).props.children,
        duration: 3000,
        className: "toast warning",
        gravity: "bottom",
        position: "right",
      }).showToast();
    } finally {
      var loadingAccept = event.target.querySelector('.button-loader');
      if (!loadingAccept){
        var loadingAccept = event.target.parentNode.querySelector('.button-loader');
      }
      loadingAccept.classList.add('ninja');

      fetchCustomerReservations();
      if (userData.role==="admin"){
        fetchAdminReservations();
      }
    }
  };

  const deleteReservation = async (code, event) => {
    try {
      const response = await fetch(`${api}/cancel_store_reservation.php?reservationCode=${code}`, {
        method: 'UPDATE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.status=="success"){
        Toastify({
          text: Translator({code:language, value:"Reservation Cancellation Confirmed"}).props.children,
          duration: 3000,
          className: "toast success",
          gravity: "bottom",
          position: "right",

        }).showToast();
      }else{
        throw new Error("Data Status Error");
      }
    } catch (error) {
      console.error('deleteReservation:', error);
      Toastify({
        text: Translator({code:language, value:"Oops! Something didn't go as planned"}).props.children,
        duration: 3000,
        className: "toast warning",
        gravity: "bottom",
        position: "right",
      }).showToast();
    } finally {
      var loadingCancel = event.target.querySelector('.button-loader');
      if (!loadingCancel){
        var loadingCancel = event.target.parentNode.querySelector('.button-loader');
      }
      loadingCancel.classList.add('ninja');

      fetchCustomerReservations();
      if (userData.role==="admin"){
        fetchAdminReservations();
      }
    }
  };

  const handleLogout = async (event) => {
    setLoadingLogout(true);
    event.preventDefault();

    try {
      const response = await fetch(`${api}/sign_out.php`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies in the request
      });

      const data = await response.json();
      if (data.status=="success"){
        setAuthenticated(false);
        localStorage.removeItem('token');
        Toastify({
          text: Translator({code:language, value:"Logged Out"}).props.children,
          duration: 3000,
          className: "toast success",
          gravity: "bottom",
          position: "right",

        }).showToast();
        navigate("/");
      }else{
        throw new Error("Data Status Error");
      }
    } catch (error) {
      console.error('handleLogout:', error);
      Toastify({
        text: Translator({code:language, value:"Oops! Something didn't go as planned"}).props.children,
        duration: 3000,
        className: "toast warning",
        gravity: "bottom",
        position: "right",
      }).showToast();
    } finally {
      setLoadingLogout(false);
    }
  }

  const handleTabClick = (event) => {
    var clickedElementId = event.target.id;
    while (!clickedElementId && event.target.parentNode) {
      event.target = event.target.parentNode;
      clickedElementId = event.target.id;
    }

    if (!clickedElementId || clickedElementId=='root') {
      return; //No ID or Root
    }

    updateURL(event.target.id);
    
    document.querySelectorAll('.tab.active').forEach(element => {
      element.classList.remove('active');
    });
    document.getElementById(clickedElementId).classList.add('active');

    document.querySelectorAll('.content-tab.active').forEach(element => {
      element.classList.remove('active');
    });
    document.getElementById(`content-${clickedElementId}`).classList.add('active');

    if (document.getElementById(`content-${clickedElementId}`).querySelector('.customer-reservations')){
      fetchCustomerReservations();
    }else if (document.getElementById(`content-${clickedElementId}`).querySelector('.admin-reservations') && userData.role==="admin"){
      fetchAdminReservations();
    }
  };

  function updateURL(tabName) {
    window.history.replaceState({}, document.title, window.location.pathname + "?tab=" + tabName);
  }

  return (
    <>
      <HelmetProvider>
        <Helmet>
            <title>{Translator({code:language,value:"Account"}).props.children}</title>
            <meta name="description" content='Manage your account with ease. View and update your profile, settings, and preferences. Stay in control of your account.'/>
            <meta property="og:title" content={Translator({code:language,value:"Account"}).props.children} />
            <meta property="og:description" content='Manage your account with ease. View and update your profile, settings, and preferences. Stay in control of your account.' />
        </Helmet>
      </HelmetProvider>
      <main className='page'>
        {(authenticated && userData.role) && (
          <>
            <div className='title-section'>
              <Link className="back-link" to="/">
                <FontAwesomeIcon icon={faArrowLeftLong} />
                <Translator
                  code={language}
                  value={`Back to Homepage`}
                />
              </Link>  
              <h1 className='account-title'>
                <Translator
                  code={language}
                  value={`Account`}
                />
              </h1>
            </div>
            <div className="account-page page">
              <div className="page-content">
                <div className="tabs-wrapper">
                  <div className="tabs" onClick={handleTabClick}>
                    {userData.role==="admin" ? (
                      <>
                        <div id="tab-0" className={`tab ${tabInURL === "tab-0" && 'active'}`}>
                          <FontAwesomeIcon icon={faListCheck} />
                          <Translator
                            code={language}
                            value={`Calendar`}
                          />
                        </div>
                        <div id="tab-1" className={`tab ${tabInURL === "tab-1" && 'active'}`}>
                          <FontAwesomeIcon icon={faBookmark} />
                          <Translator
                            code={language}
                            value={`Reservations`}
                          />
                        </div>
                      </>
                    ) : (
                      <div id="tab-1" className={`tab ${tabInURL === "tab-1" && 'active'}`}>
                        <FontAwesomeIcon icon={faBookmark} />
                        <Translator
                          code={language}
                          value={`Reservations`}
                        />
                      </div>
                    )}    
                    <div id="tab-2" className={`tab ${tabInURL === "tab-2" && 'active'}`}>
                      <FontAwesomeIcon icon={faHeart} />
                      <Translator
                        code={language}
                        value={`Favourites`}
                      />
                    </div>
                    <div id="tab-3" className={`tab ${tabInURL === "tab-3" ? 'active' : ''}`}>
                      <FontAwesomeIcon icon={faGears} />
                      <Translator
                        code={language}
                        value={`Settings`}
                      />
                    </div>
                  </div>
                  <div className="content-tabs">
                    {userData.role==="admin" ? (
                      <>
                        <div id="content-tab-0" className={`content-tab ${tabInURL === "tab-0" && 'active'}`}>
                          <AdminReservations
                            GlobalState={GlobalState}
                            adminReservations={adminReservations}
                            skeletonAdminReservations={skeletonAdminReservations}
                            handleAccept={handleAccept}
                            handleCancel={handleCancel}
                          />
                        </div>
                        <div id="content-tab-1" className={`content-tab ${tabInURL === "tab-1" && 'active'}`}>
                          <CustomerReservations 
                            GlobalState={GlobalState}
                            customerReservations={customerReservations}
                            skeletonCustomerReservations={skeletonCustomerReservations}
                            handleCancel={handleCancel}
                          />
                        </div>
                      </>
                    ) : (
                      <div id="content-tab-1" className={`content-tab ${tabInURL === "tab-1" && 'active'}`}>
                        <CustomerReservations 
                          GlobalState={GlobalState}
                          customerReservations={customerReservations}
                          skeletonCustomerReservations={skeletonCustomerReservations}
                          handleCancel={handleCancel}
                        />
                      </div>
                    )} 
                    <div id="content-tab-2" className={`content-tab ${tabInURL === "tab-2" && 'active'}`}>
                      <FavouriteStores
                        GlobalState={GlobalState}
                      />
                    </div>
                    <div id="content-tab-3" className={`content-tab ${tabInURL === "tab-3" && 'active'}`}>
                      <StoreSettings
                        GlobalState={GlobalState}
                      />
                    </div>
                  </div>
                </div>
                <div className="logout-section">
                  <button onClick={handleLogout} className="button">
                    {loadingLogout && (
                      <span className="button-loader"></span>
                    )}
                    <Translator
                      code={language}
                      value={"Sign Out"}
                    />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  )
}

export default Account
