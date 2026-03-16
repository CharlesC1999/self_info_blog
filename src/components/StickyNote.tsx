"use client";

import Image from "next/image";
import { ReactNode, useEffect, useRef, useState } from "react";
import pinImage from "@/assets/pin.png";
import styles from "./StickyNote.module.css";
import { clamp } from "@/utils/clamp";
import { getNextStackOrder } from "@/utils/stacking";

type StickyNoteProps = {
  children: ReactNode;
  className?: string;
  width?: string;
  minHeight?: string;
  padding?: string;
  title?: string;
  initialX?: number;
  initialY?: number;
  pinLeft?: number;
  pinTop?: number;
  pinRotation?: number;
  pinDragOffsetX?: number;
  pinDragOffsetY?: number;
  pinDragRotation?: number;
};

type Position = {
  x: number;
  y: number;
};

export default function StickyNote({
  children,
  className = "",
  width = "300px",
  minHeight = "220px",
  padding = "20px",
  title,
  initialX = 32,
  initialY = 32,
  pinLeft = 42,
  pinTop = -10,
  pinRotation = -9,
  pinDragOffsetX = 4,
  pinDragOffsetY = -5,
  pinDragRotation = -5,
}: StickyNoteProps) {
  const noteRef = useRef<HTMLDivElement | null>(null);
  const dragOffsetRef = useRef<Position>({ x: 0, y: 0 });
  const [position, setPosition] = useState<Position>({
    x: initialX,
    y: initialY,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [zIndex, setZIndex] = useState(1);

  useEffect(() => {
    const updatePosition = () => {
      const note = noteRef.current;

      if (!note) {
        return;
      }

      const { width: noteWidth, height: noteHeight } =
        note.getBoundingClientRect();

      setPosition((currentPosition) => ({
        x: clamp(
          currentPosition.x,
          0,
          Math.max(window.innerWidth - noteWidth, 0)
        ),
        y: clamp(
          currentPosition.y,
          0,
          Math.max(window.innerHeight - noteHeight, 0)
        ),
      }));
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);

    return () => window.removeEventListener("resize", updatePosition);
  }, []);

  const clampPosition = (nextX: number, nextY: number) => {
    const note = noteRef.current;

    if (!note) {
      return { x: nextX, y: nextY };
    }

    const { width: noteWidth, height: noteHeight } =
      note.getBoundingClientRect();

    return {
      x: clamp(nextX, 0, Math.max(window.innerWidth - noteWidth, 0)),
      y: clamp(nextY, 0, Math.max(window.innerHeight - noteHeight, 0)),
    };
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragOffsetRef.current = {
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
    setZIndex(getNextStackOrder());
    setIsDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) {
      return;
    }

    setPosition(
      clampPosition(
        event.clientX - dragOffsetRef.current.x,
        event.clientY - dragOffsetRef.current.y
      )
    );
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) {
      return;
    }

    event.currentTarget.releasePointerCapture(event.pointerId);
    setIsDragging(false);
  };

  const pinStyle = {
    left: `${pinLeft}px`,
    top: `${pinTop}px`,
    transform: isDragging
      ? `rotate(${pinDragRotation}deg) translate(${pinDragOffsetX}px, ${pinDragOffsetY}px)`
      : `rotate(${pinRotation}deg) translate(0, 0)`,
  };

  return (
    <div
      ref={noteRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`${styles.stickyNote} ${
        isDragging ? styles.dragging : ""
      } ${className}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex,
        width,
        minHeight,
        padding,
      }}
    >
      <Image
        src={pinImage}
        alt="pin"
        priority
        draggable={false}
        className={`${styles.pin} ${isDragging ? styles.pinDragging : ""}`}
        style={pinStyle}
      />
      {title ? <h3 className={styles.title}>{title}</h3> : null}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
