
export const containerAnimation = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      duration: 0.3
    }
  }
};

export const itemAnimation = {
  hidden: { opacity: 0, y: 5 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.2
    }
  }
};
