import React from 'react';
import './SearchBar.css';
import { FiSearch } from 'react-icons/fi'; // Feather search icon

function SearchBar() {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search"
        className="search-input"
      />
      <button className="search-button">
        <FiSearch size={16} />
      </button>
    </div>
  );
}

export default SearchBar;
