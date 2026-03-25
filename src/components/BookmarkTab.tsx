"use client";

import React from "react";
import { motion } from "motion/react";
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
  return (
    <motion.button
      type="button"
      className={styles.bookmark}
      onClick={onClick}
      initial={{ y: 0, opacity: 1 }}
      animate={
        isExiting
          ? {
              y: [0, 12, -140],
              opacity: [1, 1, 0],
            }
          : {
              y: 0,
              opacity: 1,
            }
      }
      whileTap={{
        y: [0, 18, -6, 0],
        transition: {
          duration: 0.42,
          times: [0, 0.45, 0.75, 1],
          ease: "easeOut",
        },
      }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
      aria-label={label}
    >
      <span className={styles.ropeLeft} aria-hidden="true" />
      <span className={styles.ropeRight} aria-hidden="true" />
      <span className={styles.hole} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </motion.button>
  );
}
