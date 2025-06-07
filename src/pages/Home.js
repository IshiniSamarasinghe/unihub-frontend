import React, { useState } from 'react';
import Hero from '../components/Hero';
import UniversityLogos from '../components/UniversityLogos';
import FilterSection from '../components/FilterSection';
import SearchBar from '../components/SearchBar';
import EventGrid from '../components/EventGrid';
import EventPromo from '../components/EventPromo';

function Home() {
  // All hardcoded events
  const allEvents = [
    {
      image: '/assets/events/codecraft.jpg',
      title: 'CodeCraft Hackathon 2025',
      university: 'Kelaniya',
      faculty: 'Faculty of Computing and Technology',
      society: 'ITSA',
    },
    {
      image: '/assets/events/quantum.jpg',
      title: 'Quantum Computing Workshop',
      university: 'Moratuwa',
      faculty: 'Faculty of Physical Science',
      society: 'ETSA',
    },
    {
      image: '/assets/events/research.jpg',
      title: 'Research Showcase: Innovations in ICT',
      university: 'Kelaniya',
      faculty: 'Faculty of Social Science',
      society: 'CSSA',
    },
    {
      image: '/assets/events/1.jpg',
      title: 'AI & Robotics Meetup',
      university: 'Colombo',
      faculty: 'Faculty of Computing and Technology',
      society: 'ISACA',
    },
  ];

  // State variables
  const [filteredEvents, setFilteredEvents] = useState(allEvents);
  const [filters, setFilters] = useState({ university: '', faculty: '', society: '' });
  const [searchQuery, setSearchQuery] = useState('');

  // Main function to apply both filters and search
  const applyAllFilters = (activeFilters, search) => {
    const filtered = allEvents.filter((event) =>
      (!activeFilters.university || event.university === activeFilters.university) &&
      (!activeFilters.faculty || event.faculty === activeFilters.faculty) &&
      (!activeFilters.society || event.society === activeFilters.society) &&
      (!search || event.title.toLowerCase().includes(search.toLowerCase()))
    );
    setFilteredEvents(filtered);
  };

  // Filter trigger
  const handleFilter = (filterValues) => {
    setFilters(filterValues);
    applyAllFilters(filterValues, searchQuery);
  };

  // Search trigger
  const handleSearch = (query) => {
    setSearchQuery(query);
    applyAllFilters(filters, query);
  };

  // Reset all
  const handleClear = () => {
    setFilters({ university: '', faculty: '', society: '' });
    setSearchQuery('');
    setFilteredEvents(allEvents);
  };

  return (
    <>
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
