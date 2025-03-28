import React from 'react';

const MobileMenu = () => {
  return (
    <div
      className="fixed top-20 right-0 z-[9999] w-[80%] max-w-sm bg-green-500 text-white p-6 md:hidden"
      data-mobile-menu
    >
      ✅ Mobile menu is visible
    </div>
  );
};

export default MobileMenu;
