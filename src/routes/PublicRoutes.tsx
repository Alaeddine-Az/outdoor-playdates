import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

// Import pages
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import ThankYou from '@/pages/ThankYou';
import About from '@/pages/About';
import FAQ from '@/pages/FAQ';
import Terms from '@/pages/Terms';
import Contact from '@/pages/Contact';

const PublicRoutes = () => {
  // Get the current path to determine if we're at the root path
  const path = window.location.pathname;
  
  // If we're at exactly "/auth", "/about", etc. render those components
  // Otherwise, if we're at the root path ("/"), render Index
  // This avoids the nested routes warning
  
  return (
    <Routes>
      <Route index element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/thank-you" element={<ThankYou />} />
      <Route path="/about" element={<About />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default PublicRoutes;
