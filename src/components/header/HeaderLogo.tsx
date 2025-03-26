
import React from 'react';
import { Link } from 'react-router-dom';

const HeaderLogo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <span className="font-bold text-xl">GoPlayNow</span>
    </Link>
  );
};

export default HeaderLogo;
