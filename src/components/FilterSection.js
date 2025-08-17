// ✅ src/components/FilterSection.js

import React, { useState } from 'react';
import './FilterSection.css';
import { FaFilter, FaTimes } from 'react-icons/fa';

function FilterSection({ onFilter, onClear }) {
  const [university, setUniversity] = useState('');
  const [faculty, setFaculty] = useState('');
  const [society, setSociety] = useState('');

  const handleFilterClick = () => {
    onFilter({ university, faculty, society });
  };

  const handleClear = () => {
    setUniversity('');
    setFaculty('');
    setSociety('');
    onClear();
  };

  return (
    <div className="filter-container">
      <select className="dropdown" value={faculty} onChange={(e) => setFaculty(e.target.value)}>
        <option value="">By Faculty</option>
        <option value="fct">Faculty of Computing and Technology</option>
        <option value="humanities">Faculty of Humanities</option>
        <option value="social-science">Faculty of Social Science</option>
        <option value="management">Faculty of Management</option>
        <option value="physical-science">Faculty of Physical Science</option>
      </select>


      <select className="dropdown" value={university} onChange={(e) => setUniversity(e.target.value)}>
        <option value="">By University</option>
        <option value="kelaniya">Kelaniya</option>
        <option value="colombo">Colombo</option>
        <option value="moratuwa">Moratuwa</option>
        <option value="peradeniya">Peradeniya</option>
        <option value="jaffna">Jaffna</option>
        <option value="ruhuna">Ruhuna</option>
        <option value="jayawardhanapura">Jayawardhanapura</option>
      </select>


      <select className="dropdown" value={society} onChange={(e) => setSociety(e.target.value)}>
        <option value="">By Society</option>
        <option value="ITSA-society">ITSA</option>
        <option value="ETSA-society">ETSA</option>
        <option value="CSSA-society">CSSA</option>
        <option value="Dancing-club">Dancing Club</option>
        <option value="ISACA-society">ISACA</option>
        <option value="Legion-society">Legion</option>
        <option value="By-Faculty">By Faculty</option>
      </select>

      <button className="filter-button" onClick={handleFilterClick}>
        <FaFilter style={{ marginRight: '6px' }} />
        Filter
      </button>

      <button className="filter-button clear" onClick={handleClear}>
        <FaTimes style={{ marginRight: '6px' }} />
        Clear
      </button>
    </div>
  );
}

export default FilterSection;
