import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import Translator from './Translator';
import Picture from './Picture';

function GridListItem({title,description,distance,image_url,url,language,status,skeleton}) {

  return (
    <Link to={status==1 && url}>
      <div className="grid-list-item">
        <div className={status==0 ? (`card locked`) : (`card`)}>
          <Picture
            title={title}
            image_url={image_url}
            skeleton={skeleton}
            width={300}
            height={300}
          />
          <div className="txt">
            {distance>=0 && (<span className='store-distance'>{parseInt(distance)}m</span>)}
            <h2 className={skeleton ? (`skeleton-box`) : (``)}>
              <Translator 
                code={language} 
                value={title}
              />
            </h2>
            {description && (
              <p className={skeleton ? (`skeleton-box`) : (``)}>
                <Translator 
                  code={language} 
                  value={description}
                />
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default GridListItem
