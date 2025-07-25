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

  useEffect(() => {
    axios.get('/events/approved')
      .then(response => {
        const formatted = response.data.map(event => ({
          id: event.id,
          image: event.image_url || '/react/assets/events/default.jpg',
          title: event.name || '',
          university: event.university || '',
          faculty: event.faculty || '',
          society: event.society || '',
        }));
        setAllEvents(formatted);
        setFilteredEvents(formatted);
      })
      .catch(error => {
        console.error('❌ Error loading events:', error);
      });
  }, []);

  const applyAllFilters = (activeFilters, search) => {
    const filtered = allEvents.filter((event) =>
      (!activeFilters.university || event.university === activeFilters.university) &&
      (!activeFilters.faculty || event.faculty === activeFilters.faculty) &&
      (!activeFilters.society || event.society === activeFilters.society) &&
      (!search || event.title.toLowerCase().includes(search.toLowerCase()))
    );
    setFilteredEvents(filtered);
  };

  const handleFilter = (filterValues) => {
    setFilters(filterValues);
    applyAllFilters(filterValues, searchQuery);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    applyAllFilters(filters, query);
  };

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
      <EventGrid events={filteredEvents} />
      <EventPromo />
    </>
  );
}

export default Home;
