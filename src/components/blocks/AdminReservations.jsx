import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Translator from "../../components/Translator"
import AdminDaySelector from "../../components/blocks/AdminDaySelector"
import {faClock} from '@fortawesome/free-solid-svg-icons';
import {faPhone} from '@fortawesome/free-solid-svg-icons';
import {faEnvelope} from '@fortawesome/free-solid-svg-icons';

function AdminReservations({
  GlobalState,adminReservations,
  skeletonAdminReservations,
  handleAccept,handleCancel}) {
  const {
    language
  } = GlobalState;

  return (
    <>
      <AdminDaySelector
        GlobalState={GlobalState}
      />
      {!skeletonAdminReservations && adminReservations.length==0 ? (
        <p className='message reservations'>
          <Translator
            code={language}
            value={"Currently, there are no reservations to display. Check back later for updates."}
          />
        </p>
      ) : (
        <div className="admin-reservations">
          {skeletonAdminReservations && (
            <>
              <div className="reservation card skeleton-box"></div>
              <div className="reservation card skeleton-box"></div>
              <div className="reservation card skeleton-box"></div>
              <div className="reservation card skeleton-box"></div>
            </>
          )}
          {adminReservations.map((reservation,index) => (
            <div className={`${reservation.expired==0 ? "reservation card" : ("reservation card expired")}`} key={index}>
              <div className="reservation-info">
                <h3 className="reservation-title">{reservation.first_name} {reservation.last_name}</h3>
                <span className="reservation-description">{reservation.title}</span>
                <div className="reservation-details">
                  <span className='reservation-duration'>
                    <FontAwesomeIcon icon={faClock} />
                    {reservation.duration}'
                  </span>
                  <span className="reservation-time">
                    {reservation.time.substring(0, 5)} 
                  </span>
                  <span className="reservation-date">
                    {reservation.date}
                  </span>
                </div>
                <div className="user-info">
                  {reservation.phone.length>0 && (
                    <a href={"tel:"+reservation.phone} className="user-phone">
                      <FontAwesomeIcon icon={faPhone}/>
                      <span>{reservation.phone}</span>
                    </a>
                  )}
                  <a href={"mailto:"+reservation.email} className="user-mail">
                    <FontAwesomeIcon icon={faEnvelope} />
                    <span>{reservation.email}</span>
                  </a>
                </div>
              </div>
              {reservation.accepted==0 && (
                <>
                  <div className="reservation-accept">
                    <button onClick={(event) => handleAccept(event,reservation.code)} className="button">
                      <span className="button-loader ninja"></span>
                      <Translator
                        code={language}
                        value={"Accept"}
                      />
                    </button>
                  </div>
                </>
              )}
              {reservation.expired==0 && (
                <>
                  <div className="reservation-cancel">
                    <button onClick={(event) => handleCancel(event,reservation.code)} className="button">
                      <span className="button-loader ninja"></span>
                      <Translator
                        code={language}
                        value={"Cancel"}
                      />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default AdminReservations
