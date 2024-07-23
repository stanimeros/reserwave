import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async'
import Translator from "../components/Translator"
import SlotCounter from 'react-slot-counter';
import ServiceSelectorMap from '../components/blocks/ServiceSelectorMap';
import PartnerForm from '../components/forms/PartnerForm';
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

function BecomeAPartner({GlobalState}) {
  const {
    api,language
  } = GlobalState;

  const [reserwaveStatisticsData,setReserwaveStatisticsData] = useState(null);
  const [skeletonReserwaveStatisticsData,setSkeletonReserwaveStatisticsData] = useState(true);

  const [loading, setLoading] = useState(false);

  const fetchReserwaveStatisticsData = async () => {
    try {
      const response = await fetch(`${api}/get_reserwave_statistics.php`);
      if (!response.ok) {
        throw new Error('API error');
      }
      const data = await response.json();
      setReserwaveStatisticsData(data[0]);
      setSkeletonReserwaveStatisticsData(false);
    } catch (error) {
      console.error('fetchReserwaveStatisticsData:', error);
    }
  };

  const executeSubscriptionRedirect = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${api}/subscribe.php`);
      if (response.ok) {
        const { redirect_url } = await response.json();
        window.location.href = redirect_url;
      }else{
        throw new Error('API error');
      }
    } catch (error) {
      console.error('executeSubscriptionRedirect:', error);
      Toastify({
        text: Translator({code:language, value:"Oops! Something didn't go as planned"}).props.children,
        duration: 3000,
        className: "toast warning",
        gravity: "bottom",
        position: "right",
      }).showToast();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReserwaveStatisticsData();
  }, []);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{Translator({code:language,value:"Become a Partner"}).props.children}</title>
          <meta name="description" content='Join our partner program and unlock exciting opportunities. Collaborate with us to drive growth and achieve mutual success.'/>
          <meta property="og:title" content={Translator({code:language,value:"Become a Partner"}).props.children} />
          <meta property="og:description" content='Join our partner program and unlock exciting opportunities. Collaborate with us to drive growth and achieve mutual success.' />
        </Helmet>
      </HelmetProvider>
      <main>
        <div className="page narrow-page">
          <div className="page-content">
            <h1>
              <Translator
                code={language}
                value={"Become a Partner"}
              />
            </h1>
            <div className='reserwave-statistics'>
              {(reserwaveStatisticsData==null || skeletonReserwaveStatisticsData) ? (
                <>
                  <div className='statistic skeleton-box'>
                    <span className='value'>1</span>
                    <span className='description'>Text</span>
                  </div>
                  <div className='statistic skeleton-box'>
                    <span className='value'>1</span>
                    <span className='description'>Text</span>
                  </div>
                  <div className='statistic skeleton-box'>
                    <span className='value'>1</span>
                    <span className='description'>Text</span>
                  </div>
                  <div className='statistic skeleton-box'>
                    <span className='value'>1</span>
                    <span className='description'>Text</span>
                  </div>
                  <div className='statistic skeleton-box'>
                    <span className='value'>1</span>
                    <span className='description'>Text</span>
                  </div>
                  <div className='statistic skeleton-box'>
                    <span className='value'>1</span>
                    <span className='description'>Text</span>
                  </div>
                </>
              ) : (
                <>
                  <div className='statistic'>
                    <span className='value'>
                      <SlotCounter
                        startValue={0}
                        value={parseInt(reserwaveStatisticsData.users_count)}
                        direction="bottom-up"
                        autoAnimationStart={true}
                      />
                    </span>
                    <span className='description'>
                      <Translator
                        code={language}
                        value={'Users'}
                      />
                    </span>
                  </div>
                  <div className='statistic'>
                    <span className='value'>
                      <SlotCounter
                        startValue={0}
                        value={parseInt(reserwaveStatisticsData.store_reservations_count)}
                        direction="bottom-up"
                        autoAnimationStart={true}
                      />
                    </span>
                    <span className='description'>
                      <Translator
                        code={language}
                        value={'Reservations'}
                      />
                    </span>
                  </div>
                  <div className='statistic'>
                    <span className='value'>
                      <SlotCounter
                        startValue={0}
                        value={parseInt(reserwaveStatisticsData.store_services_count)}
                        direction="bottom-up"
                        autoAnimationStart={true}
                      />
                    </span>
                    <span className='description'>
                      <Translator
                        code={language}
                        value={'Services'}
                      />
                    </span>
                  </div>
                  <div className='statistic'>
                    <span className='value'>
                      <SlotCounter
                        startValue={0}
                        value={parseInt(reserwaveStatisticsData.stores_count)}
                        direction="bottom-up"
                        autoAnimationStart={true}
                      />
                    </span>
                    <span className='description'>
                      <Translator
                        code={language}
                        value={'Stores'}
                      />
                    </span>
                  </div>
                  <div className='statistic'>
                    <span className='value'>
                      <SlotCounter
                        startValue={0}
                        value={parseInt(reserwaveStatisticsData.services_count)}
                        direction="bottom-up"
                        autoAnimationStart={true}
                      />
                    </span>
                    <span className='description'>
                      <Translator
                        code={language}
                        value={'Subcategories'}
                      />
                    </span>
                  </div>
                  <div className='statistic'>
                    <span className='value'>
                      <SlotCounter
                        startValue={0}
                        value={parseInt(reserwaveStatisticsData.categories_count)}
                        direction="bottom-up"
                        autoAnimationStart={true}
                      />
                    </span>
                    <span className='description'>
                      <Translator
                        code={language}
                        value={'Categories'}
                      />
                    </span>
                  </div>
                </>
              )}
            </div>
            <br/>
            <h2>
              <Translator
                code={language}
                value={`Connect with Customers, Manage Reservations`}
              />
              {/* <br/>
              <Translator
                code={language}
                value={`Your Business, Your Way`}
              /> */}
            </h2>
            <p>
              <Translator
                code={language}
                value={`Welcome to Reserwave, where we connect local businesses with customers like never before. Join us and grow your business by becoming a partner.`}
              />
            </p>
            <h3>
              <Translator
                code={language}
                value={`Key Benefits`}
              />
              {`:`}
            </h3>
            <ul>
              <li>
                <Translator
                  code={language}
                  value={`Increase Visibility: Reach a broader audience in your local community.`}
                />
              </li>
              <li>
                <Translator
                  code={language}
                  value={`Seamless Reservations: Effortlessly manage reservations through our user-friendly platform.`}
                />
              </li>
              <li>
                <Translator
                  code={language}
                  value={`Boost Your Customer Base: Attract new customers looking for businesses like yours.`}
                />
              </li>
            </ul>
            <h3>
              <Translator
                code={language}
                value={`How It Works`}
              />
              {`:`}
            </h3>
            <ul>
              <li>
                <Translator
                  code={language}
                  value={`Sign Up: Fill out a simple form with your business details to get started.`}
                />
              </li>
              <li>
                <Translator
                  code={language}
                  value={`Add Your Services: Incorporate your services with the flexibility to create your own bundles.`}
                />
              </li>
              <li>
                <Translator
                  code={language}
                  value={`Start Connecting: Once approved, start receiving reservations and engaging with new customers.`}
                />
              </li>
            </ul>
            <h3>
              <Translator
                code={language}
                value={`Need Presentation?`}
              />
            </h3>
            <p>
              <Translator
                code={language}
                value={`Fullfill the form down below`}
              />
            </p>
            <PartnerForm
              GlobalState={GlobalState}
            />
            <h3>
              <Translator
                code={language}
                value={`Join the subscription`}
              />
            </h3>
            <p>
              <Translator
                code={language}
                value={`If you want to join our plaform, you can start your subscription now. Then our team will contact you soon to submit your store on Reserwave.`}
              />
            </p>
            <button className='button subscription-button' onClick={executeSubscriptionRedirect}>
              {loading && (
                <span className="button-loader"></span>
              )}
              <Translator
                code={language}
                value={`Buy Subscription Now`}
              />
            </button>
            <h3>
              <Translator
                code={language}
                value={`Contact Us Now`}
              />
            </h3>
            <p>
              <Translator
                code={language}
                value={`For any inquiries or assistance, our support team is ready to help. Please contact us at`}
              />
              {` `}
              <a href="mailto:hello@reserwave.com">hello@reserwave.com</a>
              {`.`}
            </p>
            <br/>
            <div id='map-example' className='store-map'>
              <ServiceSelectorMap
                GlobalState={GlobalState}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default BecomeAPartner
