// src/pages/Home.js

import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import UniversityLogos from '../components/UniversityLogos';
import FilterSection from '../components/FilterSection';
import SearchBar from '../components/SearchBar';
import EventGrid from '../components/EventGrid';
import EventPromo from '../components/EventPromo';
import axios from '../axios';
import HoverSidebar from '../components/HoverSidebar';

function Home() {
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filters, setFilters] = useState({ university: '', faculty: '', society: '' });
  const [searchQuery, setSearchQuery] = useState('');

  // ✅ Load all approved events
  useEffect(() => {
    axios.get('/events/approved')
      .then(response => {
        console.log("✅ Raw event data from backend:", response.data);

     const formatted = response.data.map(event => {
  const trimmedEvent = {
    id: event.id,
    image: event.image_url || '/react/assets/events/default.jpg',
    title: event.name || '',
    university: event.university?.trim() || '',
    faculty: event.faculty?.trim() || '',
    society: event.society?.trim() || '',
  };

  console.log(`📌 Event: ${trimmedEvent.title}, University: [${trimmedEvent.university}], Faculty: [${trimmedEvent.faculty}], Society: [${trimmedEvent.society}]`);
  return trimmedEvent;
});

        setAllEvents(formatted);
        setFilteredEvents(formatted);
      })
      .catch(error => {
        console.error('❌ Error loading events:', error);
      });
  }, []);

  // ✅ Filtering function with all combinations
  const applyAllFilters = (activeFilters, search) => {
    const filtered = allEvents.filter((event) => {
      const eventUniversity = event.university.toLowerCase().trim();
      const eventFaculty = event.faculty.toLowerCase().trim();
      const eventSociety = event.society.toLowerCase().trim();

      const filterUniversity = activeFilters.university.toLowerCase().trim();
      const filterFaculty = activeFilters.faculty.toLowerCase().trim();
      const filterSociety = activeFilters.society.toLowerCase().trim();

      const matchesUniversity = !filterUniversity || eventUniversity === filterUniversity;
      const matchesFaculty = !filterFaculty || eventFaculty === filterFaculty;
      const matchesSociety = !filterSociety || eventSociety === filterSociety;
      const matchesSearch = !search || event.title.toLowerCase().includes(search.toLowerCase());

      return matchesUniversity && matchesFaculty && matchesSociety && matchesSearch;
    });

    setFilteredEvents(filtered);
  };

  // ✅ When user changes dropdowns
  const handleFilter = (filterValues) => {
    setFilters(filterValues);
    applyAllFilters(filterValues, searchQuery);
  };

  // ✅ When user uses search bar
  const handleSearch = (query) => {
    setSearchQuery(query);
    applyAllFilters(filters, query);
  };

  // ✅ Reset all filters
  const handleClear = () => {
    setFilters({ university: '', faculty: '', society: '' });
    setSearchQuery('');
    setFilteredEvents(allEvents);
  };

  return (
    <>
      <HoverSidebar />
      <Hero />
      <UniversityLogos />
      <FilterSection onFilter={handleFilter} onClear={handleClear} />
      <SearchBar onSearch={handleSearch} />
      {filteredEvents.length > 0 ? (
        <EventGrid events={filteredEvents} />
      ) : (
        <p style={{ textAlign: 'center', padding: '2rem', fontWeight: 500 }}>No matching events found.</p>
      )}
      <EventPromo />
    </>
  );
}

export default Home;
