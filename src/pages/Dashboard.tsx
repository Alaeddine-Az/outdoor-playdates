import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import '@/styles/fonts.css'; // Make sure you have playful, rounded fonts loaded

const DashboardHero = ({ name, onEditProfile }: { name: string; onEditProfile: () => void }) => {
  return (
    <section className="relative rounded-3xl overflow-hidden p-6 md:p-10 bg-[#E9F6FB] text-black font-playful">
      {/* Sky and sun */}
      <div className="absolute inset-0 bg-[#D4EEF9] z-0" />
      <div className="absolute top-10 right-10 w-20 h-20 bg-yellow-300 rounded-full z-10 shadow-lg" />

      {/* Clouds */}
      <motion.div
        className="absolute top-12 left-10 w-32 h-16 bg-white rounded-full opacity-70 z-10"
        animate={{ x: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-24 left-48 w-40 h-20 bg-white rounded-full opacity-70 z-10"
        animate={{ x: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Green hill */}
      <div className="absolute bottom-0 left-0 w-full h-[30%] bg-green-300 rounded-t-[50%] z-0" />

      {/* Content */}
      <div className="relative z-20 max-w-xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, {name}!</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-md">
          Here’s what’s happening with your playdates and connections.
        </p>
      </div>

      {/* Edit Button */}
      <div className="absolute bottom-6 right-6 z-20">
        <Button onClick={onEditProfile} className="rounded-full bg-yellow-300 hover:bg-yellow-400 text-black text-base font-semibold px-6 py-2 shadow-md">
          Edit Profile
        </Button>
      </div>
    </section>
  );
};

export default DashboardHero;
