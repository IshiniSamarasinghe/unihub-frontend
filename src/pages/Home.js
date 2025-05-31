import React from 'react';
import Hero from '../components/Hero';
import UniversityLogos from '../components/UniversityLogos';
import FilterSection from '../components/FilterSection';
import SearchBar from '../components/SearchBar';
import EventGrid from '../components/EventGrid';
import EventPromo from '../components/EventPromo';

function Home() {
  return (
    <>
      <Hero />
      <UniversityLogos />
      <FilterSection />
      <SearchBar />
      <EventGrid />
      <EventPromo />
    </>
  );
}

export default Home;
