import React from 'react';
import { Button } from '@/components/ui/button';
import BearCharacter from '@/components/characters/BearCharacter';
import { motion } from 'framer-motion';

const DashboardHero = ({ name = 'Friend', onEditProfile }: { name?: string; onEditProfile?: () => void }) => {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-[#DFF1FF] shadow-md">
      {/* Sky and cloud background */}
      <div className="absolute inset-0">
        <svg viewBox="0 0 1000 300" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,100 Q250,0 500,100 T1000,100 V300 H0 Z" fill="#DFF1FF" />
          <path d="M0,160 Q250,60 500,160 T1000,160 V300 H0 Z" fill="#C0E3F7" />
        </svg>
        {/* Sun */}
        <motion.div
          className="absolute top-6 right-10 w-16 h-16 bg-yellow-300 rounded-full shadow-md"
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        />
        {/* Cloud */}
        <motion.div
          className="absolute top-10 left-10 w-24 h-12 bg-white rounded-full shadow"
          animate={{ x: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
        />
        {/* Hill */}
        <div className="absolute bottom-0 w-full">
          <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="w-full h-40">
            <path d="M0,100 Q250,200 500,100 T1000,100 V200 H0 Z" fill="#A3D977" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-6 py-10">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {name}!</h1>
          <p className="text-muted-foreground text-lg mb-4 max-w-md">
            Here’s what’s happening with your playdates and connections.
          </p>
          <Button
            onClick={onEditProfile}
            className="rounded-full bg-yellow-300 hover:bg-yellow-400 text-black font-semibold px-6 py-2 shadow"
          >
            Edit Profile
          </Button>
        </div>

        <motion.div
          className="mt-8 md:mt-0 md:ml-8"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <BearCharacter className="w-36 md:w-48" />
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardHero;
