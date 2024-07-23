import React, { useState, useEffect } from 'react';
import { useNavigate , useParams} from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import GridListItem from "../components/GridListItem";
import SearchCity from '../components/blocks/SearchCity';
import Translator from '../components/Translator';

function Service({GlobalState}) {
  const {
    api,language,
    servicesData,setServicesData,
    storesData,setStoresData,
    searchLon,setSearchLon,
    searchLat, setSearchLat,
    resultsOrigin,setResultsOrigin,
  } = GlobalState;

  const { category_slug, service_slug } = useParams();
  const [serviceData, setServiceData] = useState([]);
  const [skeletonServiceData,setSkeletonServiceData] = useState(true);
  const [skeletonStoresData,setSkeletonStoresData] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setSkeletonStoresData(true);
    fetchStoresData();

    localStorage.setItem('searchLon', searchLon);
    localStorage.setItem('searchLat', searchLat);
    localStorage.setItem('resultsOrigin', resultsOrigin);
  }, [searchLat,searchLon,resultsOrigin]);

  const fetchStoresData = async () => {
    try {
      const response = await fetch(`${api}/get_stores.php?serviceSlug=${service_slug}&lon=${searchLon}&lat=${searchLat}`);
      const data = await response.json();
      setStoresData(data);
      setSkeletonStoresData(false);
    } catch (error) {
      console.error('fetchStoresData:', error);
    }
  };

  useEffect(() => {
    var tempServiceData = [];
    if (servicesData.length>0){
      tempServiceData = servicesData.find(service => service.slug === service_slug);
      setServiceData(tempServiceData);
    }

    if (tempServiceData.length==0 || tempServiceData.slug!=service_slug){
      const fetchServiceData = async () => {
        try {
          const response = await fetch(`${api}/get_services.php?categorySlug=${category_slug}&serviceSlug=${service_slug}`)
          const data = await response.json();
          if (data.length == 0) {
            navigate('/404');
          }else{
            setServiceData(data[0]);
            setSkeletonServiceData(false);
          }
        } catch (error) {
          console.error('fetchServiceData:', error);
        }
      };

      fetchServiceData();
    }else{
      setSkeletonServiceData(false);
    }
  }, [category_slug, service_slug]);

  const handleGetLocation = () => {
    setSkeletonStoresData(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSearchLat(latitude);
          setSearchLon(longitude);
          setResultsOrigin("your location");
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };
  
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{Translator({code:language,value:serviceData.title}).props.children}</title>
          <meta property="og:title" content={Translator({code:language,value:serviceData.title}).props.children} />
        </Helmet>
      </HelmetProvider>
      {(skeletonServiceData || skeletonStoresData) ? (
        <main>
          <div className="service-page page">
            <div className="page-content">
              <h1 className='skeleton-box'>Title</h1>
              <p className='skeleton-box'>Paragraph</p>
              <div className='search-location-request-wrapper'>
                <div className="search-location-request">
                  <SearchCity/>
                  <div className="location-request">
                    <FontAwesomeIcon icon={faLocationArrow} />
                  </div>
                </div>
              </div>
              <div>
                <p className='results-origin skeleton-box'>Stores near you</p>
              </div>
              <div className="grid-list">
                <GridListItem
                  title={"Title"}
                  description={"Description"}
                  skeleton={true}
                />
                <GridListItem
                  title={"Title"}
                  description={"Description"}
                  skeleton={true}
                />
                <GridListItem
                  title={"Title"}
                  description={"Description"}
                  skeleton={true}
                />
                <GridListItem
                  title={"Title"}
                  description={"Description"}
                  skeleton={true}
                />
              </div>
            </div>
          </div>
        </main>
      ):(
        <main>
          <div className="service-page page">
            <div className="page-content">
              <h1>{serviceData.title}</h1>
              <p>{serviceData.description}</p>
              <div className='search-location-request-wrapper'>
                <div className="search-location-request">
                  <SearchCity
                    setSearchLat = {setSearchLat}
                    setSearchLon = {setSearchLon}
                    resultsOrigin = {resultsOrigin}
                    setResultsOrigin = {setResultsOrigin}
                    language={language}
                  />
                  <button onClick={handleGetLocation} className="location-request">
                    <FontAwesomeIcon icon={faLocationArrow} />
                  </button>
                </div>
              </div>
              <div>
                <p className='results-origin'>
                  <Translator
                    code={language}
                    value={"Stores near"}
                  />
                  {" "}
                  <Translator
                    code={language}
                    value={resultsOrigin}
                  />
                </p>
              </div>
              {storesData.length==0 && (
                <div className='message'>
                  <strong>
                    <Translator
                      code={language}
                      value={`There aren't any`}
                    />

                    {` `}
                    <Translator
                      code={language}
                      value={serviceData.title}
                    />
                    {` `}
                    <Translator
                      code={language}
                      value={`on Reserwave near`}
                    />
                    {` `}
                    <Translator
                      code={language}
                      value={resultsOrigin}
                    />
                    {` `}
                    <Translator
                      code={language}
                      value={`yet.`}
                    />
                  </strong>
                  <br/>
                  <p>
                    <Translator
                      code={language}
                      value={`It's not you, it's us! We're working hard to expand and hope to come to your area soon.`}
                    />
                  </p>
                </div>
              )}
              <div className="grid-list">
                {storesData.map((store) => (
                  <GridListItem
                    key={store.id}
                    title={store.title}
                    distance={store.distance}
                    description={store.description}
                    url={`/${category_slug}/${service_slug}/${store.slug}`}
                    image_url={store.image_url}
                    status={1}
                  />
                ))}
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  )
}

export default Service
