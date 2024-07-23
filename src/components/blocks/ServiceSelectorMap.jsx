import React, { useState, useEffect } from 'react';
import MapExample from '../../assets/store_maps/test.svg?react';
import Translator from '../Translator';

function ServiceSelectorMap({url,GlobalState}) {
  const {
    language,
  } = GlobalState;

  const [selectedServiceId, setSelectedServiceId] = useState("None");

  const handleSvgClick = (event) => {
    const clickedPathId = event.target.id;
    if (!clickedPathId){return}
    const clickedPath = document.getElementById(clickedPathId);
    document.querySelectorAll('#map-example path').forEach(path => {
      path.classList.remove('selected');
    });
    clickedPath.classList.add('selected');
    
    setSelectedServiceId(clickedPathId);
  };

  return (
    <div id='map-example' className='card'>
      <h2>
        <Translator
          code={language}
          value={`Soon: Interactive Map`}
        />
      </h2>
      <p>
        <Translator
          code={language}
          value={`Selceted Service`}
        />
        {`: `}
        {selectedServiceId}
      </p>
      <MapExample onClick={handleSvgClick}/>
    </div>
  )
}

export default ServiceSelectorMap
