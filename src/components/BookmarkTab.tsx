"use client";

import React, { useEffect } from "react";
import { motion, useAnimationControls } from "motion/react";
import woodTexture from "@/assets/wood_testure.jpg";
import styles from "./BookmarkTab.module.css";

type BookmarkTabProps = {
  label?: string;
  isExiting?: boolean;
  returnAnimationKey?: number;
  onClick?: () => void;
};

export default function BookmarkTab({
  label = "About",
  isExiting = false,
  returnAnimationKey = 0,
  onClick,
}: BookmarkTabProps) {
  const controls = useAnimationControls();

  useEffect(() => {
    if (returnAnimationKey === 0 || isExiting) {
      return;
    }

    controls.set({ y: -148, rotate: 0, opacity: 1, scaleY: 1 });

    void controls.start({
      y: [-148, 18, -8, 0],
      rotate: [0, -5, 3, 0],
      transition: {
        duration: 0.74,
        times: [0, 0.58, 0.8, 1],
        ease: "easeOut",
      },
    });
  }, [controls, isExiting, returnAnimationKey]);

  const handleClick = async () => {
    if (!isExiting) {
      await controls.start({
        y: [0, 18, -6, 0],
        rotate: 0,
        transition: {
          duration: 0.42,
          times: [0, 0.45, 0.75, 1],
          ease: "easeOut",
        },
      });
    }

    onClick?.();
  };

  return (
    <motion.button
      type="button"
      className={styles.bookmark}
      onClick={handleClick}
      initial={{ y: 0, rotate: 0, opacity: 1, scaleY: 1 }}
      animate={
        isExiting
          ? {
              y: [0, -18, -220],
              rotate: [0, 1, -5],
              scaleY: [1, 1.01, 0.86],
              opacity: [1, 0.99, 0],
              transition: {
                duration: 0.58,
                times: [0, 0.18, 1],
                ease: [0.16, 0.92, 0.24, 1],
              },
            }
          : controls
      }
      aria-label={label}
      style={{
        backgroundImage: `
          linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.16) 0%,
            rgba(255, 255, 255, 0.04) 20%,
            rgba(0, 0, 0, 0.05) 100%
          ),
          url(${woodTexture.src})
        `,
      }}
    >
      <span className={styles.ropeLeft} aria-hidden="true" />
      <span className={styles.ropeRight} aria-hidden="true" />
      <span className={styles.hole} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </motion.button>
  );
}


