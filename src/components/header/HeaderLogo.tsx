
import React from 'react';
import { Link } from 'react-router-dom';

const HeaderLogo = () => {
  return (
    <div className="flex items-center">
      <Link to="/" className="flex items-center">
        <span className="font-bold text-lg md:text-xl lg:text-2xl text-primary">GoPlayNow</span>
      </Link>
    </div>
  );
};

export default HeaderLogo;
