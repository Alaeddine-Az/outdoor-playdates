
import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Import pages
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import ThankYou from '@/pages/ThankYou';
import About from '@/pages/About';
import FAQ from '@/pages/FAQ';
import Terms from '@/pages/Terms';
import Contact from '@/pages/Contact';

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/thank-you" element={<ThankYou />} />
      <Route path="/about" element={<About />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
};

export default PublicRoutes;
