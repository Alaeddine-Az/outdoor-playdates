
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

const HeaderLogo = () => {
  const { user } = useAuth();
  
  // Determine the link destination based on auth status
  const destination = user ? "/dashboard" : "/";
  
  return (
    <Link to={destination} className="flex items-center space-x-2">
      <motion.div 
        className="w-8 h-8 rounded-full bg-play-orange flex items-center justify-center shadow-sm"
        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-white font-bold">GP</span>
      </motion.div>
      <motion.span 
        className="font-bold text-2xl text-play-orange font-baloo"
        whileHover={{ scale: 1.05 }}
      >
        GoPlayNow
      </motion.span>
    </Link>
  );
};

export default HeaderLogo;
