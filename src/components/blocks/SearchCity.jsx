import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faSearch } from '@fortawesome/free-solid-svg-icons';
import Translator from '../Translator';

function SearchCity({setSearchLat,setSearchLon,resultsOrigin,setResultsOrigin,language}) {
  const [searchValue, setSearchValue] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [valueFromInput, setValueFromInput] = useState(false);

  useEffect(() =>{
    if (resultsOrigin) {
      setSearchValue(resultsOrigin);
    }
  },[resultsOrigin])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!valueFromInput) {
        return;
      }
    
      if (searchValue.length<3){
        setResponseData(null);
        return;
      }

      const geoapifyAPI = `https://api.geoapify.com/v1/geocode/autocomplete?text=${searchValue}&apiKey=44cf66d8a2024df3af60ba977ea57afa&format=json&type=city&lang=${language.toLowerCase()}&limit=5`;
      //const googleAPI = `https://maps.googleapis.com/maps/api/place/queryautocomplete/json?input=${searchValue}&key=AIzaSyBl21be7FTpcuxSLGErBocVM9qIgjZpqKY&language=${language}`;

      fetch(geoapifyAPI, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        setResponseData(data);
        console.log(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchValue]);

  const handleInputChange = (e) => {
    setValueFromInput(true);
    setSearchValue(e.target.value);
  };

  const handleUnfocus = (e) => {
    const clickedElement = e.relatedTarget;
    if (!clickedElement || clickedElement.className!=="result"){
      setResponseData(null);
    }
  };
  
  const handleFocus = (e) => {
    setSearchValue('');
  };

  const handleResultClick = (event,address_line1,lat,lon) => {
    setResponseData(null);
    
    setSearchLat(lat);
    setSearchLon(lon);

    setValueFromInput(false);
    //setSearchValue(address_line1);
    setResultsOrigin(address_line1);
  };

  return (
    <div className="search-input" id="search-input">
      <FontAwesomeIcon icon={faSearch}/>
      <div className='input-results'>
        <input
            className="input"
            placeholder={`${Translator({code:language, value:"Region, Town, City"}).props.children}...`}
            value={Translator({code:language, value:searchValue.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())}).props.children}
            onChange={handleInputChange}
            onBlur={handleUnfocus}
            onFocus={handleFocus}
        />
        {responseData && (
          <div className='results'>
            {responseData.results.map((result, index) => (
              <div key={index} tabIndex={index} className='result' onClick={(event) => 
                handleResultClick(event,result.address_line1,result.lat,result.lon)}>
                <FontAwesomeIcon icon={faLocationDot} />
                <div className='value'>{result.address_line1}, {result.address_line2}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchCity;
