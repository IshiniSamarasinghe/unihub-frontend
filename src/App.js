import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import UpcomingEvents from './pages/UpcomingEvents';
import PastEvents from './pages/PastEvents';
import About from './pages/About';
import SignUp from './pages/SignUp';
import EventDetails from './pages/EventDetails'; 


function LayoutWrapper({ children }) {
  const location = useLocation();
  const hideLayout = location.pathname === '/signup'; // add more paths if needed

  return (
    <>
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<UpcomingEvents />} />
          <Route path="/past-events" element={<PastEvents />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/event/:id" element={<EventDetails />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;
