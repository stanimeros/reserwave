import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faClock} from '@fortawesome/free-solid-svg-icons';
import Translator from "../../components/Translator"
import { format } from 'date-fns';
import { Link } from "react-router-dom";

function CustomerReservations({
  GlobalState,customerReservations,
  skeletonCustomerReservations,
  handleCancel}) {
    
  const {
    language
  } = GlobalState;

  return (
    <>
      {!skeletonCustomerReservations && customerReservations.length==0 ? (
        <>
          <p className='message'>
            <Translator
              code={language}
              value={"Good news! You don't have any active reservations at the moment. Book a new service to get started on your next experience."}
            />
          </p>
          <Link className="button" to={`/`}>
            <Translator
              code={language}
              value={`Explore Now`}
            />
          </Link>
        </>
      ) : (
        <div className="customer-reservations">
          {skeletonCustomerReservations && (
            <>
              <div className="reservation card skeleton-box"></div>
              <div className="reservation card skeleton-box"></div>
              <div className="reservation card skeleton-box"></div>
              <div className="reservation card skeleton-box"></div>
            </>
          )}
          {customerReservations.map((reservation,index) => (
            <div className={`${(reservation.expired==1 || reservation.cancelled==1) ? "reservation card expired" : ("reservation card")}`} key={index}>
              <div className="reservation-info">
                <Link to={`/${reservation.category_slug}/${reservation.service_slug}/${reservation.store_slug}`}>
                  <h3 className="reservation-title">{reservation.store_title}</h3>
                </Link>
                <span className="reservation-description">{reservation.service_title}</span>
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
              </div>
              <div className="reservation-message">
                {reservation.cancelled==0 ? (
                  <>
                    {reservation.accepted==0 ? (
                      <>
                        <Translator
                          code={language}
                          value={"Not accepted yet"}
                        />
                      </>
                    ) : (
                      <>
                        <Translator
                          code={language}
                          value={"Accepted at"}
                        />
                        {` `}
                        <span>
                          {format(new Date(reservation.accepted_datetime), 'HH:mm dd/MM/yy')}
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Translator
                      code={language}
                      value={"Cancelled at"}
                    />
                    {` `} 
                    <span>
                      {format(new Date(reservation.cancelled_datetime), 'HH:mm dd/MM/yy')}
                    </span>
                  </>
                )}
              </div>
              {reservation.expired==0 && reservation.cancelled==0 && (
                <div className="reservation-cancel">
                  <button onClick={(event) => handleCancel(event,reservation.code)} className="button">
                    <span className="button-loader ninja"></span>
                    <Translator
                      code={language}
                      value={"Cancel"}
                    />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default CustomerReservations
