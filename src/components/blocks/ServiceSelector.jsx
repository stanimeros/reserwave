import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faClock} from '@fortawesome/free-solid-svg-icons';
import Translator from '../Translator';

function ServiceSelector({GlobalState,storeServicesData}) {
  const {
    language, setSelectedTime,
    selectedServiceId,setSelectedServiceId,
    selectedCombinationIds,setSelectedCombinationIds,
  } = GlobalState;

  const handleServiceSelection = (event,id) => {
    var services = document.querySelectorAll(".selected-service");
    services.forEach(service => {
      service.classList.remove("selected-service");
    });

    if (selectedServiceId==id){
      setSelectedServiceId();
    }else{
      setSelectedServiceId(id);
      const clickedService = event.currentTarget;
      clickedService.classList.add("selected-service");
    }
    setSelectedCombinationIds([]);

    var times = document.querySelectorAll(".selected-time");
    times.forEach(time => {
      time.classList.remove("selected-time");
    });
    setSelectedTime();
  };

  const handleServiceCombinationSelection = (event,id) => {
    if (!selectedCombinationIds.includes(id)) {
      const clickedService = event.currentTarget;
      clickedService.classList.add("selected-service");
      setSelectedCombinationIds((prevIds) => [...prevIds, id]);
    }else{
      const clickedService = event.currentTarget;
      clickedService.classList.remove("selected-service");
      setSelectedCombinationIds((prevIds) => prevIds.filter((prevId) => prevId !== id));
    }

    var times = document.querySelectorAll(".selected-time");
    times.forEach(time => {
      time.classList.remove("selected-time");
    });
    setSelectedTime();
  };

  return (
    <>
      {storeServicesData.map((service,index) =>
      (service.status==1 && service.independent==1 && !service.can_combine_with_ids.includes("_" + selectedServiceId + "_")) && (
        <div key={index} onClick={(event) => handleServiceSelection(event,service.id)} className="service-selector card">
          <div className='service-info'>
            <h3 className='service-title'>
              <Translator
                code={language}
                value={service.title}
              />
            </h3>
            <span className='service-description'>
              <Translator
                code={language}
                value={service.description}
              />
            </span>
            <span className='service-duration'>
              <FontAwesomeIcon icon={faClock} />
              {service.duration}'
            </span>
          </div>
          <div className='service-prices'>
            {parseFloat(service.list_price)>parseFloat(service.price) && (
              <span className='list-price'>
                {service.list_price}€
              </span>
            )}
            {service.price>0 && (
              <span className='price'>
                {service.price}€
              </span>
            )}
          </div>
        </div>
        )
      )}      
      {/* {storeServicesData.some(service => service.can_combine_with_ids.includes('_' + selectedServiceId + '_') && service.independent==0) && (
        <>
          No extra
        </>
      )} */}
      {storeServicesData.map((service,index) => 
      (service.status==1 && service.can_combine_with_ids.includes("_" + selectedServiceId + "_") && !service.can_not_combine_with_ids.split('_').map(id => parseInt(id)).some(id => selectedCombinationIds.includes(id))) && (
        <div key={index} onClick={(event) => handleServiceCombinationSelection(event,service.id)} className="service-selector card">
          <div className='service-info'>
            <h3 className='service-title'>
              <Translator
                code={language}
                value={`Combine it with`}
              />
              {` `}
              {service.title}
            </h3>
            <span className='service-description'>
              {service.description}
            </span>
            <span className='service-duration'>
              <FontAwesomeIcon icon={faClock} />
              {service.duration}'
            </span>
          </div>
          <div className='service-prices'>
            {parseFloat(service.list_price)>parseFloat(service.price) && (
              <span className='list-price'>
                {service.list_price}€
              </span>
            )}
            <span className='price'>
              +{service.price}€
            </span>
          </div>
        </div>
        )
      )}
    </>
  )
}

export default ServiceSelector
