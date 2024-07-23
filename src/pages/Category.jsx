import React, { useState, useEffect } from 'react';
import { useNavigate , useParams} from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import GridListItem from "../components/GridListItem"
import Fuse from 'fuse.js';
import Translator from '../components/Translator';

function Category({GlobalState}) {
  const {
    api, language,
    servicesData, setServicesData,
    categoriesData,
  } = GlobalState;

  const {category_slug} = useParams();
  const [categoryData, setCategoryData] = useState([]);
  const [skeletonCategoryData,setSkeletonCategoryData] = useState(true);
  const [skeletonServicesData,setSkeletonServicesData] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [matchingServices, setMatchingServices] = useState([]);
  const [nonMatchingServices, setNonMatchingServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    var translatedServicesData = servicesData.map(service => {
      const translatedTitle = Translator({ code: language, value: service.title });
      return { ...service, title: translatedTitle.props.children };
    });

    const fuseOptions = {
      keys: ['title'],
      threshold: 0.5, // Adjust the threshold
    };

    const fuse = new Fuse(translatedServicesData, fuseOptions);
    const searchResults = fuse.search(searchTerm);
  
    var tempMatchingServices = searchResults.map((result) => result.item);
    setMatchingServices(tempMatchingServices);
    setNonMatchingServices(servicesData.filter(
      (service) => !tempMatchingServices.some((match) => match.id === service.id)
    ));
  },[servicesData,searchTerm])

  const updateBookAsActive = () => {
      var bookMenuItem = document.querySelector('.mobile-nav .button-nav svg[data-icon="magnifying-glass-location"]');
      bookMenuItem.parentElement.classList.add("active");
  };

  useEffect(() => {
    var tempCategoryData = [];
    if (categoriesData.length>0){
      tempCategoryData = categoriesData.find(category => category.slug === category_slug);
      setCategoryData(tempCategoryData);
    }

    if (tempCategoryData.length==0 || tempCategoryData.slug!=category_slug){
      const fetchCategoryData = async () => {
        try {
          const response = await fetch(`${api}/get_categories.php?categorySlug=${category_slug}`)
          const data = await response.json();          
          if (data.length == 0) {
            navigate('/404');
          }else{
            setCategoryData(data[0]);
            setSkeletonCategoryData(false);
          }
        } catch (error) {
          console.error('fetchCategoryData:', error);
        }
      };

      fetchCategoryData();
    }else{
      setSkeletonCategoryData(false);
    }

    const fetchServicesData = async () => {
      try {
        const response = await fetch(`${api}/get_services.php?categorySlug=${category_slug}`);
        const data = await response.json();
        setServicesData(data);
        setSkeletonServicesData(false);
      } catch (error) {
        console.error('fetchServicesData:', error);
      }
    };

    fetchServicesData();
  }, [category_slug]);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{Translator({code:language,value:categoryData.title}).props.children}</title>
          <meta property="og:title" content={Translator({code:language,value:categoryData.title}).props.children} />
        </Helmet>
      </HelmetProvider>
      {(skeletonCategoryData || skeletonServicesData) ? (
        <main>
          <div className="services-page page">
            <div className="page-content">
              <h1 className='skeleton-box'>Title</h1>
              <p className='skeleton-box'>Paragraph</p>
              <div className="search-input" id="search-input">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                <input 
                  className="input" 
                  type="text"
                  placeholder={`${Translator({code:language, value:"Search services"}).props.children}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="grid-list">
                <GridListItem
                  title={"Title"}
                  skeleton={true}
                />
                <GridListItem
                  title={"Title"}
                  skeleton={true}
                />
                <GridListItem
                  title={"Title"}
                  skeleton={true}
                />
                <GridListItem
                  title={"Title"}
                  skeleton={true}
                />
              </div>
            </div>
          </div>
        </main>
      ) : (
        <main>
          <div className="services-page page">
            <div className="page-content">
              <h1>{categoryData.title}</h1>
              <p>{categoryData.description}</p>
              <div className="search-input" id="search-input">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                <input 
                  className="input" 
                  type="text"
                  placeholder={`${Translator({code:language, value:"Search services"}).props.children}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="grid-list">
                {matchingServices.map((service) => (
                  <GridListItem
                    key={service.id}
                    title={service.title}
                    text={service.description}
                    url={`${service.slug}`}
                    image_url={service.image_url}
                    language={language}
                    status={service.status}
                  />
                ))}
                {nonMatchingServices.map((service) => (
                  <GridListItem
                    key={service.id}
                    title={service.title}
                    text={service.description}
                    url={`${service.slug}`}
                    image_url={service.image_url}
                    language={language}
                    status={service.status}
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

export default Category
