"use client";

import {
  motion,
  useAnimation,
  type Transition,
  type Variants,
} from "motion/react";

const transition: Transition = {
  duration: 0.5,
  ease: "easeInOut",
  type: "spring",
  damping: 15,
  stiffness: 200,
};

const zapVariants: Variants = {
  normal: {
    pathLength: 1,
    opacity: 1,
    scale: 1,
    fill: "rgba(0,0,0,0)",
  },
  animate: {
    pathLength: [0, 1],
    opacity: [0, 1],
    scale: [1, 1.2, 1],
    fill: ["rgba(0,0,0,0)", "currentColor"],
  },
};

export const ZapIcon = () => {
  const controls = useAnimation();

  return (
    <div
      className="cursor-pointer select-none p-2 hover:bg-accent rounded-md transition-colors duration-200 flex items-center justify-center text-primary"
      onMouseEnter={() => controls.start("animate")}
      onMouseLeave={() => controls.start("normal")}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.polygon
          points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
          variants={zapVariants}
          transition={transition}
          animate={controls}
        />
      </motion.svg>
    </div>
  );
};

export const ShieldCheckIcon = () => {
  const controls = useAnimation();

  return (
    <div
      className="cursor-pointer select-none p-2 hover:bg-accent rounded-md transition-colors duration-200 flex items-center justify-center text-primary"
      onMouseEnter={() => controls.start("animate")}
      onMouseLeave={() => controls.start("normal")}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path
          d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"
          variants={{
            normal: { scale: 1 },
            animate: { scale: 1.1 },
          }}
          transition={transition}
          animate={controls}
        />
        <motion.path
          d="m9 12 2 2 4-4"
          variants={{
            normal: { pathLength: 1, opacity: 1 },
            animate: { pathLength: [0, 1], opacity: [0, 1] },
          }}
          transition={transition}
          animate={controls}
        />
      </motion.svg>
    </div>
  );
};

export const UsersIcon = () => {
  const controls = useAnimation();

  return (
    <div
      className="cursor-pointer select-none p-2 hover:bg-accent rounded-md transition-colors duration-200 flex items-center justify-center text-primary"
      onMouseEnter={() => controls.start("animate")}
      onMouseLeave={() => controls.start("normal")}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path
          d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
          variants={{
            normal: { translateX: 0 },
            animate: { translateX: -2 },
          }}
          transition={transition}
          animate={controls}
        />
        <motion.circle
          cx="9"
          cy="7"
          r="4"
          variants={{
            normal: { scale: 1 },
            animate: { scale: 1.1 },
          }}
          transition={transition}
          animate={controls}
        />
        <motion.path
          d="M22 21v-2a4 4 0 0 0-3-3.87"
          variants={{
            normal: { translateX: 0, opacity: 1 },
            animate: { translateX: 2, opacity: 0.8 },
          }}
          transition={transition}
          animate={controls}
        />
        <motion.path
          d="M16 3.13a4 4 0 0 1 0 7.75"
          variants={{
            normal: { translateY: 0, opacity: 1 },
            animate: { translateY: -1, opacity: 0.8 },
          }}
          transition={transition}
          animate={controls}
        />
      </motion.svg>
    </div>
  );
};

export const CodeIcon = () => {
  const controls = useAnimation();

  return (
    <div
      className="cursor-pointer select-none p-2 hover:bg-accent rounded-md transition-colors duration-200 flex items-center justify-center text-primary"
      onMouseEnter={() => controls.start("animate")}
      onMouseLeave={() => controls.start("normal")}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.polyline
          points="16 18 22 12 16 6"
          variants={{
            normal: { translateX: 0 },
            animate: { translateX: 2 },
          }}
          transition={transition}
          animate={controls}
        />
        <motion.polyline
          points="8 6 2 12 8 18"
          variants={{
            normal: { translateX: 0 },
            animate: { translateX: -2 },
          }}
          transition={transition}
          animate={controls}
        />
      </motion.svg>
    </div>
  );
};

export const FileCheckIcon = () => {
  const controls = useAnimation();

  return (
    <div
      className="cursor-pointer select-none p-2 hover:bg-accent rounded-md transition-colors duration-200 flex items-center justify-center text-primary"
      onMouseEnter={() => controls.start("animate")}
      onMouseLeave={() => controls.start("normal")}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path
          d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
          variants={{
            normal: { scale: 1 },
            animate: { scale: 1.05 },
          }}
          transition={transition}
          animate={controls}
        />
        <motion.path
          d="M14 2v4a2 2 0 0 0 2 2h4"
          variants={{
            normal: { opacity: 1 },
            animate: { opacity: 0.8 },
          }}
          transition={transition}
          animate={controls}
        />
        <motion.path
          d="m9 15 2 2 4-4"
          variants={{
            normal: { pathLength: 1, opacity: 1 },
            animate: { pathLength: [0, 1], opacity: [0, 1] },
          }}
          transition={transition}
          animate={controls}
        />
      </motion.svg>
    </div>
  );
};
