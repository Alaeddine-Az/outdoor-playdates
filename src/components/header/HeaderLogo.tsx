
import React from 'react';
import { Link } from 'react-router-dom';

const HeaderLogo = () => {
  return (
    <div className="flex items-center">
      <Link to="/" className="flex items-center">
        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center mr-2">
          <span className="text-white font-bold text-sm">GP</span>
        </div>
        <span className="font-bold text-lg md:text-xl lg:text-2xl text-primary">GoPlayNow</span>
      </Link>
    </div>
  );
};

export default HeaderLogo;
