import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home'; // Create this file if not created yet
import UpcomingEvents from './pages/UpcomingEvents';
import PastEvents from './pages/PastEvents';


function App() {
  return (
    <Router>
  <div className="App">
    <Navbar />   {/* Show on every page */}

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/events" element={<UpcomingEvents />} />
      <Route path="/past-events" element={<PastEvents />} />

    </Routes>

    <Footer />   {/* Show on every page */}
  </div>
</Router>

  );
}

export default App;
