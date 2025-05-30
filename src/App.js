import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import UniversityLogos from './components/UniversityLogos';
import FilterSection from './components/FilterSection'; 
import SearchBar from './components/SearchBar';
import EventGrid from './components/EventGrid';
import EventPromo from './components/EventPromo';
import Footer from './components/Footer';
 


function App() {
  return (
    <div className="App">
       <Navbar/>
       <Hero/>
      <UniversityLogos />
      <FilterSection />
      <SearchBar />
      <EventGrid />
      <EventPromo /> 
      <Footer /> 
   
    </div>
  );
}

export default App;