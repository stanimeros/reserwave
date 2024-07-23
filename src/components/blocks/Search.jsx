import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

function Search() {
  return (
    <div className="search-input" id="search-input">
      <FontAwesomeIcon icon={faMagnifyingGlass} />
      <input className="input" placeholder="Search here"></input>
    </div>
  )
}

export default Search
