import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"
import Translator from '../Translator';
import FavouriteButton from '../buttons/FavouriteButton';
import Picture from '../Picture';

function FavouriteStores({GlobalState}) {
  const {
    api, language,
    userData
  } = GlobalState;

  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFavourites();
  },[]);

  async function getFavourites() {
		try {
			const response = await fetch(`${api}/get_favourites.php?token=${userData.token}`);
			const data = await response.json();

      if (data.status == "success"){
        setFavourites(data.data);
      }else{
				throw new Error("Data Status Error");
			}
    } catch (error) {
      console.error('getFavourites:', error);
      Toastify({
        text: Translator({code:language, value:"Oops! Something didn't go as planned"}).props.children,
        duration: 3000,
        className: "toast warning",
        gravity: "bottom",
        position: "right",
      }).showToast();
    }finally{
      setLoading(false);
    }
	};
  
  return (
    <>
    {!userData || userData.favourites.length == 0 ? (
      <>
        <p className='message'>
          <Translator
            code={language}
            value={"You don't have any favourite stores στις the moment. For easier access later, include a store on this list."}
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
      <>
        <div className='list'>
          {loading ? ( 
            <>
              {userData.favourites.map((favorite,index) => (
                <div key={index} className='card skeleton-box favourite-store'></div>
              ))}
            </>
          ) : (
            <>
              {favourites.map((store,index) => (
                <div key={index} className='card favourite-store'>
                  <div className='column'>
                    <div>
                      <Link className="logo" to={`/${store.category_slug}/${store.service_slug}/${store.slug}`}>
                        <div className='title'>{store.title}</div>
                      </Link>
                      <div className='description'>{store.description}</div>
                    </div>
                    <FavouriteButton
                      GlobalState={GlobalState}
                      storeId={store.id}
                    />
                  </div>
                  <div>
                    <Link className="logo" to={`/${store.category_slug}/${store.service_slug}/${store.slug}`}>
                      <Picture
                        title={store.title}
                        image_url={store.image_url}
                        width={250}
                        height={250}
                      />
                    </Link>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        </>
      )}
    </>
  )
}

export default FavouriteStores
