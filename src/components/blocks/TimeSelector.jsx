import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Translator from '../Translator';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/pagination';
import { Grid, Pagination } from 'swiper/modules';

function TimeSelector({GlobalState}) {
  const {
    language,
    storeData, storeServicesData,
    selectedServiceId, selectedCombinationIds,
    selectedDay, selectedMonth, selectedYear,
    api, setSelectedTime, storeReservationsData,
    setStoreReservationsData, storeWorkingHoursData
} = GlobalState;

  const [selectedService,setSelectedService] = useState([]);
  const [availableTimes,setAvailableTimes] = useState([]);
  const [conflictsCounter,setConflictsCounter] = useState([]);
  const [skeletonTimes,setSkeletonTimes] = useState(true);
  const [deafultTimes,setDefaultTimes] = useState(true);

  useEffect(() => {
    if (!storeData.id || !selectedYear || !selectedMonth || !selectedDay || !selectedServiceId){
      setSkeletonTimes(false);
      setDefaultTimes(true);
      setAvailableTimes([]);
      setConflictsCounter([]);
      return;
    }

    setDefaultTimes(false);
    setSkeletonTimes(true);
    const tempSelectedService = storeServicesData.find(service => service.id === selectedServiceId);
    setSelectedService(tempSelectedService);

    const fetchStoreReservations = async () => {
      try {
        const response = await fetch(`${api}/get_store_reservations.php?storeId=${storeData.id}&date=${selectedYear}-${selectedMonth}-${selectedDay}`);
        if (!response.ok) {
          throw new Error('API error');
        }
        const data = await response.json();
        setStoreReservationsData(data);
        //Skeleton items continue to exist
      } catch (error) {
        console.error('fetchStoreReservations:', error);
      }
    };

    fetchStoreReservations();
  }, [selectedServiceId, selectedCombinationIds, selectedDay, selectedMonth, selectedYear]);

  useEffect(() => {
    const dayOfWeek = new Date(selectedYear,selectedMonth-1,selectedDay).getDay();
    const adjustedDayOfWeek = (dayOfWeek === 0 ? 7 : dayOfWeek);
  
    const scheduleOfDay = storeWorkingHoursData.filter(row => row.day == adjustedDayOfWeek && row.status == 1);

    const availableTimes = [];
    const conflictsCounter = [];
    var selectedDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    
    for (let row=0; row<scheduleOfDay.length ;row++){
      var storeStartTimeDate = new Date(`${selectedDate}T${scheduleOfDay[row].start_time}`);
      var storeEndTimeDate = new Date(`${selectedDate}T${scheduleOfDay[row].end_time}`);

      if (storeEndTimeDate<storeStartTimeDate){
        storeEndTimeDate.setDate(storeEndTimeDate.getDate() + 1);
      }

      var tempStartTimeDate = new Date(`${selectedDate}T${scheduleOfDay[row].start_time}`);
      var tempEndTimeDate = new Date(`${selectedDate}T${scheduleOfDay[row].start_time}`);

      tempEndTimeDate.setMinutes(tempStartTimeDate.getMinutes() + parseInt(selectedService.duration));

      if (selectedCombinationIds.length>0){
        var extra_minutes = 0;
        for (let i=0;i<selectedCombinationIds.length;i++){
          const tempSelectedService = storeServicesData.find(service => service.id === selectedCombinationIds[i]);
          extra_minutes += tempSelectedService.duration;
        }
        tempEndTimeDate.setMinutes(tempStartTimeDate.getMinutes() + parseInt(selectedService.duration) + parseInt(extra_minutes));
      }

      while (tempStartTimeDate<storeEndTimeDate && tempEndTimeDate<=storeEndTimeDate){
        var skip = false;
        var conflicts = 0;

        for (let row=0;row<storeReservationsData.rows.length;row++){
          if (selectedService.concurrent>0 && selectedServiceId != storeReservationsData.rows[row].service_id){
            break;
          }
          var reservationStartTimeDate = new Date(`${selectedDate}T${storeReservationsData.rows[row].time}`);
          var reservationEndTimeDate = new Date(`${selectedDate}T${storeReservationsData.rows[row].time}`);
          reservationEndTimeDate.setMinutes(reservationStartTimeDate.getMinutes() + parseInt(storeReservationsData.rows[row].duration));

          if((tempStartTimeDate>=reservationStartTimeDate && tempStartTimeDate<reservationEndTimeDate) ||
          (tempEndTimeDate>reservationStartTimeDate && tempEndTimeDate<reservationEndTimeDate)){
            conflicts++;
            //counting conflicts with service-duration or combined-services-duration
            console.log(`${tempStartTimeDate.getHours()}:${tempStartTimeDate.getMinutes()}-${tempEndTimeDate.getHours()}:${tempEndTimeDate.getMinutes()} conflict with booking ${reservationStartTimeDate.getHours()}:${reservationStartTimeDate.getMinutes()}-${reservationEndTimeDate.getHours()}:${reservationEndTimeDate.getMinutes()}`);
          }
        }

        if (selectedCombinationIds.length>0){
          if (selectedService.concurrent>0 && conflicts>=selectedService.concurrent){
            skip = true;
          }else if(conflicts>=storeData.concurrent){
            skip = true;
          }else{
            //check if has individual conflicts
            function generateAllPermutations(services) {
              const result = [];
            
              function permute(arr, start) {
                if (start === arr.length - 1) {
                  result.push([...arr]);
                  return;
                }
            
                for (let i = start; i < arr.length; i++) {
                  [arr[start], arr[i]] = [arr[i], arr[start]];
                  permute(arr, start + 1);
                  [arr[start], arr[i]] = [arr[i], arr[start]]; // backtrack
                }
              }
            
              permute(services, 0);
            
              return result.filter(combination => combination.length >= 3);
            }
            
            const services = [];
            services.push(selectedServiceId);
            for (let i=0;i<selectedCombinationIds.length;i++){
              services.push(selectedCombinationIds[i]);
            }
            const allPermutations = generateAllPermutations(services);
            
            for (let permutation=0;permutation<allPermutations.length;permutation++){
              for (let row=0;row<allPermutations[permutation].length;row++){
                conflicts = 0;
                const combinationService = storeServicesData.find(service => service.id === allPermutations[permutation][row]);
                
                var tempServiceStartTimeDate = new Date(tempStartTimeDate);
                var tempServiceEndTimeDate = new Date(tempStartTimeDate);

                var extraDuration = 0;
                for (let j=0;j<row;j++){
                  const tempService = storeServicesData.find(service => service.id === allPermutations[permutation][j]);
                  extraDuration += tempService.duration;
                }
                tempServiceStartTimeDate.setMinutes(tempStartTimeDate.getMinutes() + parseInt(extraDuration));
                tempServiceEndTimeDate.setMinutes(tempStartTimeDate.getMinutes() + parseInt(extraDuration) + parseInt(combinationService.duration));

                for (let row=0;row<storeReservationsData.rows.length;row++){
                  if (combinationService.concurrent>0 && combinationService.id != storeReservationsData.rows[row].service_id){
                    break;
                  }
                  var reservationStartTimeDate = new Date(`${selectedDate}T${storeReservationsData.rows[row].time}`);
                  var reservationEndTimeDate = new Date(`${selectedDate}T${storeReservationsData.rows[row].time}`);
                  reservationEndTimeDate.setMinutes(reservationStartTimeDate.getMinutes() + parseInt(storeReservationsData.rows[row].duration));

                  if((tempServiceStartTimeDate>=reservationStartTimeDate && tempServiceStartTimeDate<reservationEndTimeDate) ||
                  (tempServiceEndTimeDate>reservationStartTimeDate && tempServiceEndTimeDate<reservationEndTimeDate)){
                    conflicts++;
                    //counting conflicts with service-duration or combined-services-duration
                    //console.log(`${tempServiceStartTimeDate.getHours()}:${tempServiceStartTimeDate.getMinutes()}-${tempServiceEndTimeDate.getHours()}:${tempServiceEndTimeDate.getMinutes()} conflict with booking ${reservationStartTimeDate.getHours()}:${reservationStartTimeDate.getMinutes()}-${reservationEndTimeDate.getHours()}:${reservationEndTimeDate.getMinutes()}`);
                  }
                }
                // FIX ME 
                //Maybe 2-1-3 not allowed but 1-2-3 to be okay
                if (combinationService.concurrent>0){
                  if (conflicts>=combinationService.concurrent){
                    skip = true;
                  }
                }else if(conflicts>=storeData.concurrent){
                  skip = true;
                }
              }
            }
          }
        }else{
          if (selectedService.concurrent>0){
            if (conflicts>=selectedService.concurrent){
              skip = true;
            }
          }else if(conflicts>=storeData.concurrent){
            skip = true;
          }
        }

        var serverTimestamp = new Date(`${storeReservationsData.timestamp}`); //Server Time
        
        if(tempStartTimeDate<=serverTimestamp){
          skip = true;
        }

        var tempTimeValue = `${String(tempStartTimeDate.getHours()).padStart(2, '0')}:${String(tempStartTimeDate.getMinutes()).padStart(2, '0')}`;

        const time = {
          value: tempTimeValue,
          classes: skip ? "time locked" : "time"
        };

        //console.log(tempTimeValue);
        //console.log(conflicts);
        
        if (!skip){
          time.handleClick = ((tempTimeValue) => (event) => handleTimeSelection(event,tempTimeValue))(tempTimeValue);
        }
        availableTimes.push(time);

        if (selectedCombinationIds.length==0){
          if (selectedService.concurrent>0){
            conflictsCounter.push(selectedService.concurrent-conflicts);
          }else{
            conflictsCounter.push(storeData.concurrent-conflicts);
          }
        }else{
          conflictsCounter.push(0);
        }

        if (selectedCombinationIds.length>0){
          tempStartTimeDate.setMinutes(tempStartTimeDate.getMinutes() + parseInt(selectedService.duration) + extra_minutes);
          tempEndTimeDate.setMinutes(tempEndTimeDate.getMinutes() + parseInt(selectedService.duration) + extra_minutes);
        }else{
          tempStartTimeDate.setMinutes(tempStartTimeDate.getMinutes() + parseInt(selectedService.duration));
          tempEndTimeDate.setMinutes(tempEndTimeDate.getMinutes() + parseInt(selectedService.duration));
        }

      };
      setAvailableTimes(availableTimes);
      setConflictsCounter(conflictsCounter);
      setSkeletonTimes(false);
    }
  }, [storeReservationsData]);

  const handleTimeSelection = (event,time) => {
    const clickedTime = event.currentTarget;
    var times = document.querySelectorAll(".selected-time");
    times.forEach(time => {
      time.classList.remove("selected-time");
    });
    clickedTime.classList.add("selected-time");
    setSelectedTime(time);
  };

  return (
    <>
      <div className="times-grid">
        <Swiper
          slidesPerView={3}
          grid={{
            rows: 3,
          }}
          spaceBetween={10}
          pagination={{
            clickable: true,
          }}
          modules={[Grid, Pagination]}
          className="times-swiper"
        >
          {deafultTimes && (
            <>
              <SwiperSlide key="time-1" className="time locked">09:00</SwiperSlide>
              <SwiperSlide key="time-2" className="time locked">10:00</SwiperSlide>
              <SwiperSlide key="time-3" className="time locked">11:00</SwiperSlide>
              <SwiperSlide key="time-4" className="time locked">12:00</SwiperSlide>
              <SwiperSlide key="time-5" className="time locked">13:00</SwiperSlide>
              <SwiperSlide key="time-6" className="time locked">15:00</SwiperSlide>
              <SwiperSlide key="time-7" className="time locked">16:00</SwiperSlide>
              <SwiperSlide key="time-8" className="time locked">17:00</SwiperSlide>
              <SwiperSlide key="time-9" className="time locked">18:00</SwiperSlide>
            </>
          )}
          {skeletonTimes ? 
          (
            <>
              <SwiperSlide className="time skeleton-box">text</SwiperSlide>
              <SwiperSlide className="time skeleton-box">text</SwiperSlide>
              <SwiperSlide className="time skeleton-box">text</SwiperSlide>
              <SwiperSlide className="time skeleton-box">text</SwiperSlide>
              <SwiperSlide className="time skeleton-box">text</SwiperSlide>
              <SwiperSlide className="time skeleton-box">text</SwiperSlide>
              <SwiperSlide className="time skeleton-box">text</SwiperSlide>
              <SwiperSlide className="time skeleton-box">text</SwiperSlide>
              <SwiperSlide className="time skeleton-box">text</SwiperSlide>
            </>
          ) : (
            <>
              {availableTimes.map((time,index) => (
                <SwiperSlide key={index} className={time.classes} onClick={time.handleClick}>
                  <span>{time.value}</span>
                  {(conflictsCounter[index]>0 && selectedService.concurrent>1) && (
                    <span className='availability-counter'>
                      {`(`}
                      {conflictsCounter[index]}
                      {` `}
                      <Translator 
                        code={language}
                        value={"available"}
                      />
                      {`)`}
                    </span>
                  )}
                </SwiperSlide>
              ))}
            </>
          )}
        </Swiper>
      </div>
    </>
  )
}

export default TimeSelector
