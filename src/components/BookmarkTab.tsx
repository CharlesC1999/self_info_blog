"use client";

import React from "react";
import { motion, useAnimationControls } from "motion/react";
import woodTexture from "@/assets/wood_testure.jpg";
import styles from "./BookmarkTab.module.css";

type BookmarkTabProps = {
  label?: string;
  isExiting?: boolean;
  onClick?: () => void;
};

export default function BookmarkTab({
  label = "About",
  isExiting = false,
  onClick,
}: BookmarkTabProps) {
  const controls = useAnimationControls();

  const handleClick = async () => {
    if (!isExiting) {
      await controls.start({
        y: [0, 18, -6, 0],
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
      initial={{ y: 0, opacity: 1 }}
      animate={
        isExiting
          ? {
              y: [0, 12, -140],
              opacity: [1, 1, 0],
              transition: {
                duration: 0.6,
                ease: "easeOut",
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
