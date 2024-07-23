import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async'
import GridListItem from "../components/GridListItem";
import Translator from '../components/Translator';

function Home({GlobalState}) {
  const {
    api, language,
    categoriesData, setCategoriesData
  } = GlobalState;
  const [skeletonCategoriesData, setSkeletonCategoriesData] = useState(true);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const response = await fetch(`${api}/get_categories.php`);
        const data = await response.json();
        setCategoriesData(data);
        setSkeletonCategoriesData(false);
      } catch (error) {
        console.error('fetchCategoriesData:', error);
      }
    };

    fetchCategoriesData();
  }, []);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{Translator({code:language,value:"Home"}).props.children}</title>
          <meta property="og:title" content={Translator({code:language,value:"Home"}).props.children} />
        </Helmet>
      </HelmetProvider>
      <main>
        <div className="main-page page">
          <div className="page-content">
            <h1>
              <Translator 
                code={language}
                value="Welcome to Reserwave"
              />
            </h1>
            <p> 
             <Translator 
                code={language} 
                value="Your journey to discovering, reserving, and enjoying experiences starts here."
              />
            </p>
            {skeletonCategoriesData ? (
              <div className="grid-list">
                <GridListItem
                  skeleton={true}
                  title={"Title"}
                />
                <GridListItem
                  skeleton={true}
                  title={"Title"}
                />
                <GridListItem
                  skeleton={true}
                  title={"Title"}
                />
                <GridListItem
                  skeleton={true}
                  title={"Title"}
                />
              </div>
            ) : (
              <div className="grid-list">
                {categoriesData.map((category) => (
                  <GridListItem
                    key={category.id}
                    title={category.title}
                    url={`/${category.slug}`}
                    language={language}
                    image_url={category.image_url}
                    status={category.status}
                  />
                ))}
             </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

export default Home
