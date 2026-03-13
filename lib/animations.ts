export const pageTransition = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3, ease: "easeInOut" }
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.4 }
};

export const slideInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
};

export const slideInRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3, ease: "easeOut" }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.02, 
    y: -5,
    transition: { duration: 0.2, ease: "easeOut" }
  }
};

export const glowPulse = {
  animate: {
    boxShadow: [
      "0 0 20px rgba(99, 102, 241, 0.2)",
      "0 0 40px rgba(99, 102, 241, 0.4)",
      "0 0 20px rgba(99, 102, 241, 0.2)"
    ],
    transition: { duration: 2, repeat: Infinity }
  }
};

export const shake = {
  animate: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5 }
  }
};

export const countUp = (end: number, duration: number = 2) => ({
  initial: { count: 0 },
  animate: { count: end },
  transition: { duration, ease: "easeOut" }
});

export const drawLine = {
  initial: { pathLength: 0 },
  animate: { pathLength: 1 },
  transition: { duration: 1.5, ease: "easeInOut" }
};

export const barGrow = {
  initial: { scaleY: 0 },
  animate: { scaleY: 1 },
  transition: { duration: 0.8, ease: "easeOut" }
};

export const donutDraw = {
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { duration: 1.5, ease: "easeInOut" }
};

export const modalSlideUp = {
  initial: { opacity: 0, y: 100, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 100, scale: 0.95 },
  transition: { type: "spring", damping: 25, stiffness: 300 }
};

export const rippleEffect = {
  initial: { scale: 0, opacity: 0.5 },
  animate: { scale: 4, opacity: 0 },
  transition: { duration: 0.6 }
};

export const confettiBurst = {
  initial: { scale: 0, rotate: 0 },
  animate: { 
    scale: [0, 1.2, 0],
    rotate: [0, 180, 360],
    y: [0, -100, 100],
    opacity: [1, 1, 0]
  },
  transition: { duration: 1, ease: "easeOut" }
};

export const skeleton = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: { duration: 1.5, repeat: Infinity, ease: "linear" }
  }
};
