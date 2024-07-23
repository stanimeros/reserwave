import React, { useState, useEffect } from 'react';
import { useNavigate , useParams} from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async'
import Reviews from "../components/blocks/Reviews"
import DaySelector from '../components/blocks/DaySelector';
import ServiceSelector from '../components/blocks/ServiceSelector';
import TimeSelector from '../components/blocks/TimeSelector';
import ReservationSubmit from '../components/buttons/ReservationSubmit';
import StoreMap from '../components/blocks/StoreMap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPhone, faCircleExclamation} from '@fortawesome/free-solid-svg-icons';
import Translator from '../components/Translator';

import moment from 'moment-timezone';
import Picture from '../components/Picture';
import FavouriteButton from '../components/buttons/FavouriteButton';

function Store({GlobalState}) {
  const {
    api,language, authenticated,
    setSelectedTime, setSelectedDay,
    setSelectedMonth, setSelectedYear,
    storeWorkingHoursData,
    setStoreWorkingHoursData, setSelectedServiceId,
    storesData, storeData, setStoreData,
    storeServicesData,setStoreServicesData,
  } = GlobalState;

  const { category_slug, service_slug, store_slug } = useParams();
  const [skeletonStoreData,setSkeletonStoreData] = useState(true);
  const [skeletonStoreServicesData,setSkeletonStoreServicesData] = useState(true);
  const [skeletonStoreWorkingHoursData,setSkeletonStoreWorkingHoursData] = useState(true);
  const [currentStatus,setCurrentStatus] = useState("");
  const [currentStatusMessage,setCurrentStatusMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setSelectedServiceId();
    setSelectedTime();

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    setSelectedDay();
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);

    setSkeletonStoreData(true);
    setSkeletonStoreServicesData(true);
    setSkeletonStoreWorkingHoursData(true);

    var tempStoreData = [];
    if ( storesData && storesData.length>0){
      tempStoreData = storesData.find(store => store.slug === store_slug);
      setStoreData(tempStoreData);
    }

    if (tempStoreData.length==0 || tempStoreData.slug!=store_slug){
      const fetchStoreData = async () => {
        try {
          const response = await fetch(`${api}/get_store.php?storeSlug=${store_slug}`);
          const data = await response.json();
          if (data.length == 0) {
            navigate('/404');
          }else{
            setStoreData(data[0]);
            setSkeletonStoreData(false);
          }
        } catch (error) {
          console.error('fetchStoreData:', error);
        }
      };

      fetchStoreData();
    }else{
      setSkeletonStoreData(false);
    }

    const fetchStoreServicesData = async () => {
      try {
        const response = await fetch(`${api}/get_store_services.php?storeSlug=${store_slug}`);
        const data = await response.json();
        setStoreServicesData(data);
        setSkeletonStoreServicesData(false);
      } catch (error) {
        console.error('fetchStoreServicesData:', error);
      }
    };

    fetchStoreServicesData();

    const fetchStoreWorkingHoursData = async () => {
      try {
        const response = await fetch(`${api}/get_store_working_hours.php?storeSlug=${store_slug}`);
        const data = await response.json();
        setStoreWorkingHoursData(data);
        setSkeletonStoreWorkingHoursData(false);
      } catch (error) {
        console.error('fetchStoreWorkingHoursData:', error);
      }
    }; 

    fetchStoreWorkingHoursData();
  }, [store_slug]);

  useEffect(() => {
    if (storeData.slug!=store_slug){
      return;
    }

    if (storeData.timezone){
      var daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday','sunday'];

      const currentDate = new Date();
      var currentDay = currentDate.getDay(); // 0 (Sunday) to 6 (Saturday)
      if (currentDay==0){ currentDay = 7; }

      //MOMENT WAY -- GOOD
      var format = 'HH:mm:ss';
      const currentTime = moment().utcOffset(storeData.timezone).format(format);

      // console.log(currentTime);
      // currentDay = 1;

      var workingHoursForCurrentDay = storeWorkingHoursData
      .filter((rows) => rows.day == currentDay)
      .sort((a, b) => (a.start_time < b.start_time ? -1 : 1));
    
      //console.log(workingHoursForCurrentDay); 

      for (let i=0;i<workingHoursForCurrentDay.length;i++){
        const { start_time, end_time } = workingHoursForCurrentDay[i];

        var timeParts = start_time.split(":");
        var startTimeDate = new Date();
        startTimeDate.setHours(parseInt(timeParts[0], 10), parseInt(timeParts[1], 10), parseInt(timeParts[2], 10));
        timeParts = end_time.split(":");
        var endTimeDate = new Date();
        endTimeDate.setHours(parseInt(timeParts[0], 10), parseInt(timeParts[1], 10), parseInt(timeParts[2], 10));
        timeParts = currentTime.split(":");
        var currentTimeDate = new Date();
        currentTimeDate.setHours(parseInt(timeParts[0], 10), parseInt(timeParts[1], 10), parseInt(timeParts[2], 10));

        if (endTimeDate<startTimeDate){
          endTimeDate.setDate(endTimeDate.getDate() + 1);
        }

        if (currentTimeDate >= startTimeDate && currentTimeDate <= endTimeDate) {
          setCurrentStatus(`Open`);
          setCurrentStatusMessage(`Until ${end_time.slice(0, 5)}`);
          break;
        } else {
          // Check if the store opens later in the day
          if (currentTimeDate < startTimeDate) {
            setCurrentStatus(`Closed`);
            setCurrentStatusMessage(`Opens at ${start_time.slice(0, 5)}`);
            break;
          } else {
            var tempWorkingHoursForCurrentDay = [];
            while (!tempWorkingHoursForCurrentDay || tempWorkingHoursForCurrentDay.length == 0){
              currentDay+=1;
              if (currentDay==8){currentDay=1;}
              tempWorkingHoursForCurrentDay = storeWorkingHoursData
              .filter((rows) => rows.day == currentDay)
              .sort((a, b) => (a.start_time < b.start_time ? -1 : 1))
              .shift();

              if (tempWorkingHoursForCurrentDay){
                setCurrentStatus(`Closed`);
                setCurrentStatusMessage(`Opens ${daysOfWeek[currentDay-1]} at ${tempWorkingHoursForCurrentDay.start_time.slice(0, 5)}`);
                break;
              }
            }
          }
        }
      }

      var checkedDays = 1;
      while ((!workingHoursForCurrentDay || workingHoursForCurrentDay.length==0) && checkedDays<=10){
        checkedDays+=1;
        currentDay+=1;
        if (currentDay==8){currentDay=1;}
        workingHoursForCurrentDay = storeWorkingHoursData
        .filter((rows) => rows.day == currentDay)
        .sort((a, b) => (a.start_time < b.start_time ? -1 : 1))
        .shift();

        if (workingHoursForCurrentDay){
          setCurrentStatus(`Closed`);
          setCurrentStatusMessage(`Opens ${daysOfWeek[currentDay-1]} at ${workingHoursForCurrentDay.start_time.slice(0, 5)}`);
          break;
        }
      }
    }
  }, [storeWorkingHoursData]);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{Translator({code:language,value:storeData.title}).props.children}</title>
          <meta property="og:title" content={Translator({code:language,value:storeData.title}).props.children} />
        </Helmet>
      </HelmetProvider>
      {(skeletonStoreData || skeletonStoreServicesData || skeletonStoreWorkingHoursData || 1==2) ? (
        <main>
          <div className="store-page page">
            <div className="page-content">
              <div className='row-1'>
                <div className='column-1'>
                  <div className='store-image mobile skeleton-box'></div>
                  <div className='store-title'>
                    <h1 className='skeleton-box'>{`Store Title`}</h1>
                  </div>
                </div>
                <div className='store-info'>
                  <a className='button secondary-button skeleton-box'>
                    <FontAwesomeIcon icon={faPhone} />
                    <span>+LC 0123 456 789</span>  
                  </a>
                  <div className='current-status skeleton-box'>
                    {`Status | Message Message`}
                  </div>
                </div>
              </div>
              <div className='row-2'>
                <div className='column-1 booking-system'>
                  <div>
                    <h2 className='section-title skeleton-box'>Section Title</h2>
                    <div className='services-grid'>
                      <div className='service-selector card skeleton-box'>
                        <p>Title</p>
                        <p>Text</p>
                        <p>Text</p>
                      </div>
                      <div className='service-selector card skeleton-box'>
                        <p>Title</p>
                        <p>Text</p>
                        <p>Text</p>
                      </div>
                    </div>
                  </div>
                  <div className='timestamp-selector'>
                    <div>
                      <h2 className='section-title skeleton-box'>Section Title</h2>
                      <div className='day-selector card skeleton-box'></div>
                    </div>
                    <div>
                      <h2 className='section-title skeleton-box'>Section Title</h2>
                      <div className='time-selector card skeleton-box'></div>
                    </div>
                  </div>
                  <div className="reservation-submit">
                    <div className="button skeleton-box">Submit</div>
                  </div>
                </div>
                <div className='column-2 map-reviews'>
                  <div className="img-wrapper skeleton-box"></div>
                  <div>
                    <div className='store-map-block'>
                      <div className='leaflet-container skeleton-box'></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      ):(          
        <main>
          <div className="store-page page">
            <div className="page-content">
              <div className='row-1'>
                <div className='column-1'>
                  {storeData.image_url && (
                    <Picture
                      image_url={storeData.image_url}
                      title={`${storeData.title} Image`}
                      wrapperClassNames={'mobile store-image'}
                    />
                  )}  
                  <div className='store-title'>
                    <h1>{storeData.title}</h1>
                    <FavouriteButton
                      GlobalState={GlobalState}
                      storeId={storeData.id}
                    />
                  </div>
                </div>
                <div className='store-info'>
                  <a href={"tel:" + storeData.phone} className='button secondary-button'>
                    <FontAwesomeIcon icon={faPhone} />
                    <span>{storeData.phone}</span>
                  </a>
                  {(currentStatus.length>1 && currentStatusMessage.length>1) && (
                    <div className='current-status'>
                      {currentStatus=="Closed" ? (
                        <Translator
                          code={language}
                          value={currentStatus}
                          classNames={'red'}
                        />
                      ):(
                        <Translator
                          code={language}
                          value={currentStatus}
                          classNames={'green'}
                        />
                      )}
                      {` | `}
                      <span>
                        <Translator
                          code={language}
                          value={currentStatusMessage}
                        />
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className='row-2'>
                <div className='column-1 booking-system'>
                  <div>
                    <h2 className='section-title'>
                      <Translator
                        code={language}
                        value={"Choose a service"}
                      />
                    </h2>
                    <div className='services-grid'>
                      {storeServicesData.length===0 && (
                        <div className='card message'>
                          <Translator
                            code={language}
                            value={"We're sorry, but it seems that this store is not currently offering any services."}
                          />
                        </div>
                      )}
                      <ServiceSelector
                        GlobalState = {GlobalState}
                        storeServicesData = {storeServicesData}
                      />
                    </div>
                  </div>
                  <div className='timestamp-selector'>
                    <div>
                      <h2 className='section-title'>
                        <Translator
                          code={language}
                          value={"Pick a date"}
                        />
                      </h2>
                      <DaySelector
                        GlobalState = {GlobalState}
                      />
                    </div>
                    <div>
                      <h2 className='section-title'>
                        <Translator
                          code={language}
                          value={"Select a time"}
                        />
                      </h2>
                      <div className='time-selector card'>
                        <TimeSelector
                          GlobalState = {GlobalState}
                          storeData = {storeData}
                          storeServicesData = {storeServicesData}
                        />
                      </div>
                    </div>
                  </div>
                  {!authenticated && (
                    <div className='attention-message'>
                      <FontAwesomeIcon icon={faCircleExclamation} />
                      <Translator
                        code={language}
                        value={`To proceed with your booking, create a free account.`}
                      />
                    </div>
                  )}
                  <ReservationSubmit
                    GlobalState = {GlobalState}
                    storeData = {storeData}
                  />
                </div>
                <div className='column-2 map-reviews'>   
                  {storeData.image_url && (
                    <Picture
                      image_url={storeData.image_url}
                      title={`${storeData.title} Image`}
                      classNames={"store-image"}
                    />
                  )}              
                  <div>
                    <StoreMap
                      lat={storeData.latitude}
                      lon={storeData.longitude}
                      title={storeData.title}
                      street={storeData.street + " " + storeData.zip + " " + storeData.city + " " + storeData.country}
                    />
                  </div>
                  <Reviews
                    GlobalState = {GlobalState}
                    storeData = {storeData}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  )
}

export default Store
