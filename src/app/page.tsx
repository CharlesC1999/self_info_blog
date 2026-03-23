"use client";

import Image from "next/image";
import { ReactNode, useEffect, useRef, useState } from "react";
import cakeIcon from "@/assets/cake.png";
import githubIcon from "@/assets/github.png";
import linkinIcon from "@/assets/linkin.png";
import DraggableHead from "@/components/DraggableHead";
import StickyNote from "@/components/StickyNote";
import styles from "./page.module.css";

const MOBILE_SECTION_COUNT = 4;
const MOBILE_BREAKPOINT = 500;
const SWIPE_THRESHOLD = 48;
const ANIMATION_LOCK_MS = 520;

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label="Instagram icon"
      className={styles.socialIconSvg}
    >
      <defs>
        <linearGradient
          id="instagramGradient"
          x1="0%"
          y1="100%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#feda75" />
          <stop offset="32%" stopColor="#fa7e1e" />
          <stop offset="58%" stopColor="#d62976" />
          <stop offset="82%" stopColor="#962fbf" />
          <stop offset="100%" stopColor="#4f5bd5" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="17" fill="url(#instagramGradient)" />
      <rect
        x="14"
        y="14"
        width="36"
        height="36"
        rx="11"
        fill="none"
        stroke="#ffffff"
        strokeWidth="5"
      />
      <circle
        cx="32"
        cy="32"
        r="9"
        fill="none"
        stroke="#ffffff"
        strokeWidth="5"
      />
      <circle cx="43.5" cy="20.5" r="3.5" fill="#ffffff" />
    </svg>
  );
}

function SocialNoteContent({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.socialCard}>
      <div className={styles.socialIconWrap}>{children}</div>
      <p className={styles.socialLabel}>{label}</p>
    </div>
  );
}

export default function Home() {
  const [activeMobileSection, setActiveMobileSection] = useState(0);
  const activeSectionRef = useRef(0);
  const touchStartYRef = useRef<number | null>(null);
  const animationLockRef = useRef(false);
  const animationTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const clampSection = (value: number) =>
      Math.max(0, Math.min(MOBILE_SECTION_COUNT - 1, value));

    const scrollToSection = (section: number) => {
      const nextSection = clampSection(section);
      activeSectionRef.current = nextSection;
      setActiveMobileSection(nextSection);
      animationLockRef.current = true;
      window.scrollTo({
        top: nextSection * window.innerHeight,
        behavior: "smooth",
      });

      if (animationTimeoutRef.current !== null) {
        window.clearTimeout(animationTimeoutRef.current);
      }

      animationTimeoutRef.current = window.setTimeout(() => {
        animationLockRef.current = false;
      }, ANIMATION_LOCK_MS);
    };

    const updateActiveSection = () => {
      if (window.innerWidth > MOBILE_BREAKPOINT) {
        activeSectionRef.current = 0;
        setActiveMobileSection(0);
        return;
      }

      const nextSection = clampSection(
        Math.round(window.scrollY / window.innerHeight)
      );

      if (!animationLockRef.current) {
        activeSectionRef.current = nextSection;
        setActiveMobileSection(nextSection);
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (window.innerWidth > MOBILE_BREAKPOINT || animationLockRef.current) {
        return;
      }

      touchStartYRef.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (window.innerWidth > MOBILE_BREAKPOINT || animationLockRef.current) {
        return;
      }

      const startY = touchStartYRef.current;
      const endY = event.changedTouches[0]?.clientY;
      touchStartYRef.current = null;

      if (startY == null || endY == null) {
        return;
      }

      const deltaY = startY - endY;

      if (Math.abs(deltaY) < SWIPE_THRESHOLD) {
        scrollToSection(activeSectionRef.current);
        return;
      }

      scrollToSection(activeSectionRef.current + (deltaY > 0 ? 1 : -1));
    };

    const handleWheel = (event: WheelEvent) => {
      if (window.innerWidth > MOBILE_BREAKPOINT || animationLockRef.current) {
        return;
      }

      if (Math.abs(event.deltaY) < 8) {
        return;
      }

      event.preventDefault();
      scrollToSection(activeSectionRef.current + (event.deltaY > 0 ? 1 : -1));
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("wheel", handleWheel);

      if (animationTimeoutRef.current !== null) {
        window.clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className={styles.hero}>
        <DraggableHead />
        <StickyNote
          className={styles.profileNote}
          initialX={700}
          initialY={48}
          mobileInitialX={45}
          mobileInitialY={230}
          width="320px"
          minHeight="220px"
          padding="20px"
          pinLeft={16}
          pinTop={-16}
        >
          <h3>Hi, I&apos;m Charles</h3>
          <br />
          Frontend developer exploring interaction, motion, and playful UI
          details.
          <br />
          This page mixes draggable notes, pinned icons, and scroll-based
          animation experiments.
        </StickyNote>

        <StickyNote
          className={styles.socialNote}
          width="152px"
          minHeight="136px"
          padding="18px 16px 14px"
          initialX={700}
          initialY={304}
          mobileInitialX={40}
          mobileInitialY={540}
          pinLeft={14}
          pinTop={-13}
          pinRotation={-11}
          pinDragRotation={-8}
          draggable={false}
          color="yellow"
        >
          <SocialNoteContent label="GitHub">
            <Image
              src={githubIcon}
              alt="GitHub icon"
              width={48}
              height={48}
              className={styles.socialImage}
            />
          </SocialNoteContent>
        </StickyNote>

        <StickyNote
          className={styles.socialNote}
          width="152px"
          minHeight="136px"
          padding="18px 16px 14px"
          initialX={868}
          initialY={304}
          mobileInitialX={220}
          mobileInitialY={530}
          pinLeft={16}
          pinTop={-14}
          pinRotation={6}
          pinDragRotation={9}
          draggable={false}
          color="blue"
        >
          <SocialNoteContent label="LinkedIn">
            <Image
              src={linkinIcon}
              alt="LinkedIn icon"
              width={48}
              height={48}
              className={styles.socialImage}
            />
          </SocialNoteContent>
        </StickyNote>

        <StickyNote
          className={styles.socialNote}
          width="152px"
          minHeight="136px"
          padding="18px 16px 14px"
          initialX={700}
          initialY={456}
          mobileInitialX={42}
          mobileInitialY={705}
          pinLeft={18}
          pinTop={-12}
          pinRotation={10}
          pinDragRotation={13}
          draggable={false}
          color="green"
        >
          <SocialNoteContent label="Cake">
            <Image
              src={cakeIcon}
              alt="Cake icon"
              width={48}
              height={48}
              className={styles.socialImage}
            />
          </SocialNoteContent>
        </StickyNote>

        <StickyNote
          className={styles.socialNote}
          width="152px"
          minHeight="136px"
          padding="18px 16px 14px"
          initialX={868}
          initialY={456}
          mobileInitialX={230}
          mobileInitialY={705}
          pinLeft={16}
          pinTop={-14}
          pinRotation={-5}
          pinDragRotation={-2}
          draggable={false}
          color="pink"
        >
          <SocialNoteContent label="Instagram">
            <InstagramIcon />
          </SocialNoteContent>
        </StickyNote>

        <div className={styles.mobileSnapTrack} aria-hidden="true">
          {Array.from({ length: MOBILE_SECTION_COUNT }).map((_, index) => (
            <section key={index} className={styles.mobileSnapSection} />
          ))}
        </div>
      </div>

      <div className={styles.mobileDots} aria-hidden="true">
        {Array.from({ length: MOBILE_SECTION_COUNT }).map((_, index) => (
          <span
            key={index}
            className={`${styles.mobileDot} ${
              index === activeMobileSection ? styles.mobileDotActive : ""
            }`}
          />
        ))}
      </div>
    </>
  );
}
