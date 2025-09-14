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
import BackToTop from "../components/BackToTop";

const PER_PAGE = 12; // how many to fetch per request
const FALLBACK_IMG = '/react/assets/events/default.jpg';

function Home() {
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filters, setFilters] = useState({ university: '', faculty: '', society: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState(null);

  // Map backend event -> card props we use
  const mapEvent = (event) => ({
    id: event.id,
    image: event.image_url || FALLBACK_IMG,
    title: event.name || '',
    university: (event.university || '').trim(),
    faculty: (event.faculty || '').trim(),
    society: (event.society || '').trim(),
  });

  // Fetch events (paginated). Falls back gracefully if backend returns an array.
  const fetchEvents = async (p = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/events/all', { params: { per_page: PER_PAGE, page: p } });
      const raw = res.data;

      // Support Laravel paginator or plain array
      let data = [];
      let current = p;
      let last = p;

      if (raw && Array.isArray(raw.data)) {
        data = raw.data;
        current = raw.current_page ?? p;
        last = raw.last_page ?? p;
      } else if (Array.isArray(raw)) {
        data = raw;
      }

      const formatted = data.map(mapEvent);

      // Build the next allEvents list
      const nextAll = p === 1 ? formatted : [...allEvents, ...formatted];

      setAllEvents(nextAll);
      // Re-apply filters/search on the combined list
      applyAllFiltersInternal(nextAll, filters, searchQuery);

      setPage(current);
      setLastPage(last);
    } catch (e) {
      console.error('Events load error:', e);
      setError('Failed to load events.');
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  useEffect(() => {
    fetchEvents(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Core filter function (pure)
  const filterList = (list, activeFilters, search) => {
    const fUni = activeFilters.university.toLowerCase().trim();
    const fFac = activeFilters.faculty.toLowerCase().trim();
    const fSoc = activeFilters.society.toLowerCase().trim();
    const fSearch = search.toLowerCase().trim();

    return list.filter((event) => {
      const eUni = event.university.toLowerCase().trim();
      const eFac = event.faculty.toLowerCase().trim();
      const eSoc = event.society.toLowerCase().trim();

      const matchesUniversity = !fUni || eUni === fUni;
      const matchesFaculty = !fFac || eFac === fFac;
      const matchesSociety = !fSoc || eSoc === fSoc;
      const matchesSearch = !fSearch || event.title.toLowerCase().includes(fSearch);

      return matchesUniversity && matchesFaculty && matchesSociety && matchesSearch;
    });
  };

  // Apply filters to a given base list
  const applyAllFiltersInternal = (baseList, activeFilters, search) => {
    setFilteredEvents(filterList(baseList, activeFilters, search));
  };

  // When user changes dropdowns
  const handleFilter = (filterValues) => {
    setFilters(filterValues);
    applyAllFiltersInternal(allEvents, filterValues, searchQuery);
  };

  // When user searches
  const handleSearch = (query) => {
    setSearchQuery(query);
    applyAllFiltersInternal(allEvents, filters, query);
  };

  // Reset all filters
  const handleClear = () => {
    const cleared = { university: '', faculty: '', society: '' };
    setFilters(cleared);
    setSearchQuery('');
    applyAllFiltersInternal(allEvents, cleared, '');
  };

  // Load next page
  const handleLoadMore = () => {
    if (!loading && page < lastPage) {
      fetchEvents(page + 1);
    }
  };

  return (
    <>
      <HoverSidebar />
      <Hero />
      <UniversityLogos />
      <FilterSection onFilter={handleFilter} onClear={handleClear} />
      <SearchBar onSearch={handleSearch} />

      {!initialized && (
        <p style={{ textAlign: 'center', padding: '2rem', fontWeight: 500 }}>Loading events…</p>
      )}

      {error && (
        <p style={{ textAlign: 'center', padding: '2rem', color: 'crimson', fontWeight: 500 }}>{error}</p>
      )}

      {!error && initialized && (
        <>
          {filteredEvents.length > 0 ? (
            <EventGrid events={filteredEvents} />
          ) : (
            <p style={{ textAlign: 'center', padding: '2rem', fontWeight: 500 }}>
              No matching events found.
            </p>
          )}

          {/* Load More */}
          <div style={{ textAlign: 'center', margin: '1.5rem 0 2.5rem' }}>
            {page < lastPage ? (
              <button
                className="btn btn-outline-primary"
                onClick={handleLoadMore}
                disabled={loading}
              >
                {loading ? 'Loading…' : 'Load More'}
              </button>
            ) : (
              filteredEvents.length > 0 && (
                <span className="text-muted" style={{ fontSize: 13 }}>
                  You’ve reached the end.
                </span>
              )
            )}
          </div>
        </>
      )}

      <EventPromo />
       <BackToTop />
    </>
  );
}

export default Home;
