import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"
import Translator from '../Translator';

function ReservationSubmit({GlobalState,storeData}) {
  const {
    api, userData, 
    language, selectedServiceId,
    selectedCombinationIds, storeServicesData,
    selectedTime, selectedDay, setSelectedDay, setSelectedTime,
    selectedMonth, selectedYear,
  } = GlobalState;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [finalPrice, setFinalPrice] = useState(0);

  useEffect(() => {
    if (selectedServiceId){
      var price = 0;
      const selectedService = storeServicesData.find(service => service.id === selectedServiceId);
      price += selectedService.price;
      selectedCombinationIds.forEach((selectedServiceId) => {
        const selectedService = storeServicesData.find(service => service.id === selectedServiceId);
        price += selectedService.price;
      })

      setFinalPrice(price);
    }else{
      setFinalPrice(0);
    }
  },[selectedServiceId, selectedCombinationIds])

  const handleReservationSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    if (!selectedServiceId){
      setLoading(false); 
      Toastify({
        text: Translator({code:language, value:"Please select a service before proceeding"}).props.children,
        duration: 3000,
        className: "toast warning",
        gravity: "bottom",
        position: "right",
      }).showToast();
      return;
    }else if (!selectedDay || !selectedMonth || !selectedYear){
      setLoading(false); 
      Toastify({
        text: Translator({code:language, value:"Please add a date before proceeding"}).props.children,
        duration: 3000,
        className: "toast warning",
        gravity: "bottom",
        position: "right",
      }).showToast();
      return;
    }else if (!selectedTime){
      setLoading(false); 
      Toastify({
        text: Translator({code:language, value:"Please choose a time before proceeding"}).props.children,
        duration: 3000,
        className: "toast warning",
        gravity: "bottom",
        position: "right",
      }).showToast();
      return;
    }else if (!userData.id){
      setLoading(false); 
      Toastify({
        text: Translator({code:language, value:"Login required to proceed"}).props.children,
        duration: 3000,
        className: "toast warning",
        gravity: "bottom",
        position: "right",
      }).showToast();
      return;
    }

    var serviceIds = [];
    serviceIds.push(selectedServiceId);
    serviceIds.push(...selectedCombinationIds);
    await setReservations(serviceIds,selectedTime);
  }

  async function setReservations(serviceIds,time){
    const requestData = {
      storeId: storeData.id,
      serviceIds: serviceIds,
      date: `${selectedYear}-${selectedMonth}-${selectedDay}`,
      time: time,
      token: userData.token
   };

    try {
      const response = await fetch(`${api}/set_store_reservation.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      const data = await response.json();
      if (data.status=="success"){
        navigate('/');
        Toastify({
          text: Translator({code:language, value:"Success"}).props.children,
          duration: 3000,
          className: "toast success",
          gravity: "bottom",
          position: "right", 
        }).showToast();
      }else if (data.status=="active_reservation"){
        Toastify({
          text: Translator({code:language, value:"Another reservation is already scheduled for this time under this account"}).props.children,
          duration: 3000,
          className: "toast warning",
          gravity: "bottom",
          position: "right",
        }).showToast();
      }else{
        throw new Error("Data Status Error");
      }
    } catch (error) {
      console.error('setReservations:', error);
      Toastify({
        text: Translator({code:language, value:"Oops! Something didn't go as planned"}).props.children,
        duration: 3000,
        className: "toast warning",
        gravity: "bottom",
        position: "right",
      }).showToast();
    } finally{
      setLoading(false);
    }
  }

  return (
    <div className="reservation-submit">
      <button onClick={handleReservationSubmit} className='button'>
        {loading && (
          <span className="button-loader"></span>
        )}
        <Translator
          code={language}
          value={"Submit"}
        />
        {finalPrice>0 && (
          <>{" | "}{finalPrice}{"€"}</>
        )}         
      </button>
    </div>
  )
}

export default ReservationSubmit
