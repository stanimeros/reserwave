import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import Translator from './Translator';

function Picture({title,image_url,classNames,wrapperClassNames,language,skeleton,width,height}) {

  const [imageLoaded, setImageLoaded] = useState(false);
	const [imageError, setImageError] = useState(false);

  const handleImageLoaded = (event) => {
    setImageLoaded(true);
    event.target.classList.remove('loading');
  };

	const handleImageError = () => {
    setImageError(true);
		setImageLoaded(true);
  };
  
  return (
    <>
			<div className={skeleton || !imageLoaded ? (`img-wrapper skeleton-box ${wrapperClassNames}`) : (`img-wrapper ${wrapperClassNames}`)}>
				{image_url && !imageError ? (
					<img 
						src={image_url} 
						alt={Translator({code:language, value:title + ` Image`}).props.children}
						title={Translator({code:language, value:title}).props.children}
						className={`${classNames} ${imageLoaded ? '' : 'loading'}`}
						onLoad={(event) => handleImageLoaded(event)}
						onError={handleImageError}
						loading="lazy"
						width={width ? width : 800}
						height={height ? height : 800}
					></img>
				) : (
					<FontAwesomeIcon 
						icon={faImage}
					/>
				)}
			</div>
    </>
  )
}

export default Picture
