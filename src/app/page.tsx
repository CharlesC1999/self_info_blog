"use client";

import Image from "next/image";
import { ReactNode, useEffect, useRef, useState } from "react";
import cakeIcon from "@/assets/cake.png";
import githubIcon from "@/assets/github.png";
import instagramIcon from "@/assets/instagram.svg";
import linkinIcon from "@/assets/linkin.png";
import BookmarkTab from "@/components/BookmarkTab";
import DraggableHead from "@/components/DraggableHead";
import LanguageToggle from "@/components/LanguageToggle";
import StickyNote from "@/components/StickyNote";
import styles from "./page.module.css";

const MOBILE_SECTION_COUNT = 4;
const MOBILE_BREAKPOINT = 500;
const SWIPE_THRESHOLD = 42;
const WHEEL_THRESHOLD = 22;
const ANIMATION_MS = 560;
const BOOKMARK_EXIT_MS = 650;

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
  const [isBookmarkExiting, setIsBookmarkExiting] = useState(false);
  const [hideBookmark, setHideBookmark] = useState(false);
  const [bookmarkReturnAnimationKey, setBookmarkReturnAnimationKey] =
    useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const touchStartYRef = useRef<number | null>(null);
  const animationLockRef = useRef(false);
  const animationTimeoutRef = useRef<number | null>(null);
  const bookmarkTimeoutRef = useRef<number | null>(null);

  const isMobileViewport = () =>
    typeof window !== "undefined" && window.innerWidth <= MOBILE_BREAKPOINT;

  const goToMobileSection = (nextSection: number) => {
    if (!isMobileViewport()) {
      return;
    }

    const clamped = Math.max(
      0,
      Math.min(MOBILE_SECTION_COUNT - 1, nextSection)
    );

    if (clamped === activeMobileSection) {
      return;
    }

    const isLeavingFirstScreen = activeMobileSection === 0 && clamped > 0;
    const isReturningToFirstScreen = clamped === 0;

    if (bookmarkTimeoutRef.current !== null) {
      window.clearTimeout(bookmarkTimeoutRef.current);
    }

    if (isReturningToFirstScreen) {
      setHideBookmark(false);
      setIsBookmarkExiting(false);
      setBookmarkReturnAnimationKey((current) => current + 1);
    }

    if (isLeavingFirstScreen) {
      setIsBookmarkExiting(true);

      bookmarkTimeoutRef.current = window.setTimeout(() => {
        setHideBookmark(true);
        setIsBookmarkExiting(false);
      }, BOOKMARK_EXIT_MS);
    }

    animationLockRef.current = true;
    setActiveMobileSection(clamped);

    if (animationTimeoutRef.current !== null) {
      window.clearTimeout(animationTimeoutRef.current);
    }

    animationTimeoutRef.current = window.setTimeout(() => {
      animationLockRef.current = false;
    }, ANIMATION_MS);
  };

  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current !== null) {
        window.clearTimeout(animationTimeoutRef.current);
      }

      if (bookmarkTimeoutRef.current !== null) {
        window.clearTimeout(bookmarkTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    };

    updateViewport();
    setIsMounted(true);

    window.addEventListener("resize", updateViewport);

    return () => {
      window.removeEventListener("resize", updateViewport);
    };
  }, []);

  const handleMobileWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!isMobileViewport() || animationLockRef.current) {
      return;
    }

    if (Math.abs(event.deltaY) < WHEEL_THRESHOLD) {
      return;
    }

    event.preventDefault();
    goToMobileSection(activeMobileSection + (event.deltaY > 0 ? 1 : -1));
  };

  const handleMobileTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isMobileViewport() || animationLockRef.current) {
      return;
    }

    touchStartYRef.current = event.touches[0]?.clientY ?? null;
  };

  const handleMobileTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isMobileViewport() || animationLockRef.current) {
      return;
    }

    const startY = touchStartYRef.current;
    const endY = event.changedTouches[0]?.clientY ?? null;
    touchStartYRef.current = null;

    if (startY == null || endY == null) {
      return;
    }

    const deltaY = startY - endY;

    if (Math.abs(deltaY) < SWIPE_THRESHOLD) {
      return;
    }

    goToMobileSection(activeMobileSection + (deltaY > 0 ? 1 : -1));
  };

  const handleBookmarkClick = () => {
    console.log("bookmark clicked");
  };

  return (
    <>
      <LanguageToggle />

      {isMounted && !hideBookmark && isMobile && (
        <BookmarkTab
          label="About"
          isExiting={isBookmarkExiting}
          returnAnimationKey={bookmarkReturnAnimationKey}
          onClick={handleBookmarkClick}
        />
      )}

      <div className={styles.hero}>
        <DraggableHead />
        <StickyNote
          className={styles.profileNote}
          initialX={700}
          initialY={48}
          mobileInitialX={45}
          mobileInitialY={220}
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
            <Image
              src={instagramIcon}
              alt="Instagram icon"
              width={52}
              height={52}
              className={styles.socialImage}
            />
          </SocialNoteContent>
        </StickyNote>
      </div>

      <div
        className={styles.mobilePager}
        onWheel={handleMobileWheel}
        onTouchStart={handleMobileTouchStart}
        onTouchEnd={handleMobileTouchEnd}
      >
        <div
          className={styles.mobilePagerTrack}
          style={{ transform: `translateY(-${activeMobileSection * 100}dvh)` }}
        >
          <section className={styles.mobilePage}>
            <DraggableHead />
            <StickyNote
              className={styles.mobileProfileNote}
              initialX={0}
              initialY={0}
              mobileInitialX={45}
              mobileInitialY={215}
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
              className={styles.mobileSocialNote}
              initialX={0}
              initialY={0}
              mobileInitialX={40}
              mobileInitialY={540}
              width="152px"
              minHeight="136px"
              padding="18px 16px 14px"
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
              className={styles.mobileSocialNote}
              initialX={0}
              initialY={0}
              mobileInitialX={220}
              mobileInitialY={530}
              width="152px"
              minHeight="136px"
              padding="18px 16px 14px"
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
              className={styles.mobileSocialNote}
              initialX={0}
              initialY={0}
              mobileInitialX={42}
              mobileInitialY={705}
              width="152px"
              minHeight="136px"
              padding="18px 16px 14px"
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
              className={styles.mobileSocialNote}
              initialX={0}
              initialY={0}
              mobileInitialX={230}
              mobileInitialY={705}
              width="152px"
              minHeight="136px"
              padding="18px 16px 14px"
              pinLeft={16}
              pinTop={-14}
              pinRotation={-5}
              pinDragRotation={-2}
              draggable={false}
              color="pink"
            >
              <SocialNoteContent label="Instagram">
                <Image
                  src={instagramIcon}
                  alt="Instagram icon"
                  width={52}
                  height={52}
                  className={styles.socialImage}
                />
              </SocialNoteContent>
            </StickyNote>
          </section>

          <section className={styles.mobilePage} />
          <section className={styles.mobilePage} />
          <section className={styles.mobilePage} />
        </div>

        <div className={styles.mobileDots} aria-hidden="true">
          {Array.from({ length: MOBILE_SECTION_COUNT }).map((_, index) => (
            <button
              key={index}
              type="button"
              className={`${styles.mobileDot} ${
                index === activeMobileSection ? styles.mobileDotActive : ""
              }`}
              onClick={() => goToMobileSection(index)}
              aria-label={`Go to screen ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
