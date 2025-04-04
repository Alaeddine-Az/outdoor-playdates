
export const containerAnimation = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const itemAnimation = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};
