
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeaderLogo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <motion.div 
        className="w-8 h-8 rounded-full bg-play-orange flex items-center justify-center shadow-sm"
        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-white font-bold">GP</span>
      </motion.div>
      <motion.span 
        className="font-bold text-2xl text-play-orange"
        whileHover={{ scale: 1.05 }}
      >
        GoPlayNow
      </motion.span>
    </Link>
  );
};

export default HeaderLogo;
