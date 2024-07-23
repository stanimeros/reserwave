import React, { useEffect, useState } from 'react'
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"
import Translator from '../Translator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';

function FavouriteButton({GlobalState, storeId}) {
  const {
    api, language,
    authenticated, userData
  } = GlobalState;

	const [isFavorited, setIsFavorited] = useState(null);

  useEffect(() => {
		if (userData && userData.favourites){
			setIsFavorited(userData.favourites.some(favorite => favorite.store_id === storeId));
		}
	},[userData]);

  const toggleFavorite = () => {
    if (authenticated){
      if (!isFavorited){
        addToFavourites();
      }else{
        removeFromFavourites();
      }
  
      setIsFavorited(!isFavorited);
    }else{
      Toastify({
        text: Translator({code:language, value:"Oops! You need an account for this action"}).props.children,
        duration: 3000,
        className: "toast warning",
        gravity: "bottom",
        position: "right",
      }).showToast();
    }
  };

	async function addToFavourites() {
		try {
			const response = await fetch(`${api}/add_to_favourites.php?store_id=${storeId}&token=${userData.token}`);
			const data = await response.json();

      if (data.status == "success"){
				userData.favourites = [...userData.favourites, { store_id: storeId,}];
      }else{
				throw new Error("Data Status Error");
			}
    } catch (error) {
      console.error('addToFavourites:', error);
      Toastify({
        text: Translator({code:language, value:"Oops! Something didn't go as planned"}).props.children,
        duration: 3000,
        className: "toast warning",
        gravity: "bottom",
        position: "right",
      }).showToast();
    }
	};

	async function removeFromFavourites() {
		try {
			const response = await fetch(`${api}/remove_from_favourites.php?store_id=${storeId}&token=${userData.token}`);
			const data = await response.json();

      if (data.status == "success"){
				userData.favourites = userData.favourites.filter(favorite => favorite.store_id !== storeId);
      }else{
				throw new Error("Data Status Error");
			}
    } catch (error) {
      console.error('removeFromFavourites:', error);
      Toastify({
        text: Translator({code:language, value:"Oops! Something didn't go as planned"}).props.children,
        duration: 3000,
        className: "toast warning",
        gravity: "bottom",
        position: "right",
      }).showToast();
    }
	};

  return (
		<>
			<button className='favourite-button' onClick={toggleFavorite}>
				<FontAwesomeIcon icon={isFavorited ? solidHeart : regularHeart} />
			</button>
		</>
  )
}

export default FavouriteButton
