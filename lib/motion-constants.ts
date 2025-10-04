export const VariantSlideInUp = {
  initial: { opacity: 0, y: 100 },
  animate: { opacity: 1, y: 0 },
};

export const VariantEnterAnimation = {
  initial: { opacity: 0, scale: 0 },
  animate: (i: number = 0) => {
    return {
      opacity: 1,
      scale: 1,
      transition: {
        delay: i,
        duration: 0.2,
        scale: { type: "spring", visualDuration: 0.3, bounce: 0.35 },
      },
    };
  },
};
