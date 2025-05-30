import React from 'react';
import './FilterSection.css'; // 👈 Import the CSS file
import { FaFilter } from 'react-icons/fa';


function FilterSection() {
    return (
        <div className="filter-container">
            {/* Dropdown: University */}
            <select className="dropdown">
                <option>By University</option>
                <option>Kelaniya</option>
                <option>Colombo</option>
                <option>Moratuwa</option>
                <option>Peradeniya</option>
                <option>Jaffna</option>
                <option>Ruhuna</option>
                <option>Jayawardhanapura</option>
            </select>

            {/* Dropdown: Faculty */}
            <select className="dropdown">
                <option>By Faculty</option>
                <option>Faculty of Computing and Technology</option>
                <option>Faculty of Humanities</option>
                <option>Faculty of Social Science</option>
                <option>Faculty of Management</option>
                <option>Faculty of Physical Science</option>
            </select>

            {/* Dropdown: Society */}
            <select className="dropdown">
                <option>By Society</option>
                <option>ITSA</option>
                <option>ETSA</option>
                <option>CSSA</option>
                <option>Dancing club</option>
                <option>ISACA</option>
            </select>

            {/* Filter Button */}
            <button className="filter-button">
                <FaFilter style={{ marginRight: '6px' }} />
                Filter
            </button>
        </div>
    );
}

export default FilterSection;
