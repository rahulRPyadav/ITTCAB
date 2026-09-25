import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import Footer from './components/Footer'; 
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import TourList from './pages/TourList';
import TourDetail from './pages/TourDetail';
import CabServices from './pages/CabServices'; 
import Contact from './pages/ContactUs';
import Testimonials from './pages/Testimonials';
import BookCab from './pages/BookCab';


const AppLayout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      {/* Public Navbar hides on Admin */}
      {!isAdminRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/tours" element={<TourList />} />
        <Route path="/tours/:slug" element={<TourDetail />} />
       <Route path="/cabs" element={<CabServices />} />
                <Route path="/contact" element={<Contact />} />
        <Route path="/book-cab" element={<BookCab />} />
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
};



function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}


export default App;