"use client";

import { useState } from "react";
import styles from "./LanguageToggle.module.css";

type LanguageOption = "en" | "zh";

export default function LanguageToggle() {
  const [activeLanguage, setActiveLanguage] = useState<LanguageOption>("en");

  return (
    <div className={styles.wrapper} aria-label="Language toggle">
      <div className={styles.toggle}>
        <button
          type="button"
          className={styles.option}
          onClick={() => setActiveLanguage("en")}
          aria-pressed={activeLanguage === "en"}
        >
          <span className={`${styles.circle} ${styles.circleLatin}`}>E</span>
          <span
            className={`${styles.check} ${
              activeLanguage === "en" ? styles.checkVisible : ""
            }`}
            aria-hidden="true"
          >
            <svg viewBox="0 0 20 16" className={styles.checkIcon}>
              <path d="M2.2 9.8C3.5 10.6 4.9 12 6.2 13.6C8.5 10.8 11 7 17 2.9" />
              <path d="M2.8 9.1C4 10 5 11.2 6.1 12.7" />
            </svg>
          </span>
        </button>

        <button
          type="button"
          className={styles.option}
          onClick={() => setActiveLanguage("zh")}
          aria-pressed={activeLanguage === "zh"}
        >
          <span className={`${styles.circle} ${styles.circleHan}`}>文</span>
          <span
            className={`${styles.check} ${
              activeLanguage === "zh" ? styles.checkVisible : ""
            }`}
            aria-hidden="true"
          >
            <svg viewBox="0 0 20 16" className={styles.checkIcon}>
              <path d="M2.2 9.8C3.5 10.6 4.9 12 6.2 13.6C8.5 10.8 11 7 17 2.9" />
              <path d="M2.8 9.1C4 10 5 11.2 6.1 12.7" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}