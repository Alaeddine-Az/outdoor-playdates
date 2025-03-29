
import React from 'react';
import { motion, Variants } from 'framer-motion';

type BearSize = 'sm' | 'md' | 'lg';
type BearAnimation = 'wave' | 'bounce' | 'wiggle' | 'static';

interface BearCharacterProps {
  size?: BearSize;
  animation?: BearAnimation;
  className?: string;
}

const BearCharacter: React.FC<BearCharacterProps> = ({ 
  size = 'md', 
  animation = 'static',
  className = '' 
}) => {
  // Size configurations
  const sizes = {
    sm: {
      container: "w-16 h-16",
      head: "w-12 h-12",
      ear: "w-4 h-4",
      eye: "w-3 h-3",
      pupil: "w-1.5 h-1.5",
      nose: "w-2.5 h-2",
      mouth: "w-4 h-2",
      body: "w-10 h-6"
    },
    md: {
      container: "w-24 h-24",
      head: "w-16 h-16",
      ear: "w-5 h-5",
      eye: "w-4 h-4",
      pupil: "w-2 h-2",
      nose: "w-3 h-2",
      mouth: "w-5 h-2.5",
      body: "w-14 h-8"
    },
    lg: {
      container: "w-32 h-32",
      head: "w-24 h-24",
      ear: "w-8 h-8",
      eye: "w-6 h-6",
      pupil: "w-3 h-3",
      nose: "w-4 h-3",
      mouth: "w-7 h-3.5",
      body: "w-20 h-12"
    }
  };

  // Animation variants 
  const waveVariants: Variants = {
    initial: { rotate: 0 },
    animate: { 
      rotate: [0, 20, 0, 20, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut"
      }
    }
  };

  const bounceVariants: Variants = {
    initial: { y: 0 },
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut"
      }
    }
  };

  const wiggleVariants: Variants = {
    initial: { rotate: 0 },
    animate: {
      rotate: [0, 5, 0, -5, 0],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut"
      }
    }
  };

  const staticVariants: Variants = {
    initial: {},
    animate: {}
  };

  // Select the appropriate animation variants
  let containerVariants: Variants;
  let rightArmVariants: Variants;
  let leftArmVariants: Variants;
  
  // Configure animation variants based on the selected animation
  switch (animation) {
    case 'wave':
      containerVariants = staticVariants;
      rightArmVariants = waveVariants;
      leftArmVariants = staticVariants;
      break;
    case 'bounce':
      containerVariants = bounceVariants;
      rightArmVariants = staticVariants;
      leftArmVariants = staticVariants;
      break;
    case 'wiggle':
      containerVariants = wiggleVariants;
      rightArmVariants = staticVariants;
      leftArmVariants = staticVariants;
      break;
    default: // static
      containerVariants = staticVariants;
      rightArmVariants = staticVariants;
      leftArmVariants = staticVariants;
  }

  const selectedSize = sizes[size];

  return (
    <motion.div 
      className={`relative ${selectedSize.container} ${className}`}
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {/* Bear head */}
      <div className={`absolute ${selectedSize.head} bg-play-orange rounded-full left-1/2 transform -translate-x-1/2 top-0`}>
        {/* Ears */}
        <div className={`absolute ${selectedSize.ear} bg-play-orange rounded-full -top-[10%] -left-[10%]`} />
        <div className={`absolute ${selectedSize.ear} bg-play-orange rounded-full -top-[10%] -right-[10%]`} />
        
        {/* Eyes */}
        <div className={`absolute ${selectedSize.eye} bg-white rounded-full top-[30%] left-1/4 transform -translate-x-1/2`}>
          <div className={`absolute ${selectedSize.pupil} bg-black rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`} />
        </div>
        <div className={`absolute ${selectedSize.eye} bg-white rounded-full top-[30%] right-1/4 transform translate-x-1/2`}>
          <div className={`absolute ${selectedSize.pupil} bg-black rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`} />
        </div>
        
        {/* Nose */}
        <div className={`absolute ${selectedSize.nose} bg-play-coral rounded-full top-[60%] left-1/2 transform -translate-x-1/2`} />
        
        {/* Mouth */}
        <div className={`absolute ${selectedSize.mouth} bg-play-coral rounded-full top-[75%] left-1/2 transform -translate-x-1/2`} />
      </div>
      
      {/* Body */}
      <div className={`absolute ${selectedSize.body} bg-play-orange rounded-full left-1/2 transform -translate-x-1/2 bottom-0`} />
      
      {/* Arms */}
      <motion.div 
        className={`absolute w-1/4 h-1/5 bg-play-orange rounded-full left-[20%] top-3/4 transform -translate-y-1/4`}
        variants={leftArmVariants}
        initial="initial"
        animate="animate"
      />
      <motion.div 
        className={`absolute w-1/4 h-1/5 bg-play-orange rounded-full right-[20%] top-3/4 transform -translate-y-1/4 origin-top`}
        variants={rightArmVariants}
        initial="initial"
        animate="animate"
      />
    </motion.div>
  );
};

export default BearCharacter;
