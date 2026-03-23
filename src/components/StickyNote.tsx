"use client";

import Image from "next/image";
import { ReactNode, useEffect, useRef, useState } from "react";
import headImage from "@/assets/8bit-head.png";
import pinImage from "@/assets/pin.png";
import styles from "./StickyNote.module.css";
import { clamp } from "@/utils/clamp";
import {
  HEAD_SCALE,
  MOBILE_BREAKPOINT,
  MOBILE_HEAD_NOTE_GAP,
  MOBILE_HEAD_TOP_OFFSET,
} from "@/utils/mobileLayout";
import { getNextStackOrder } from "@/utils/stacking";

const INITIAL_NOTE_Z_INDEX = 1;

type StickyNoteColor =
  | "yellow"
  | "pink"
  | "blue"
  | "green"
  | "peach"
  | {
      base: string;
      tint?: string;
      line?: string;
      text?: string;
      border?: string;
    };

const NOTE_COLOR_MAP = {
  yellow: {
    base: "#f2df8b",
    tint: "#f8ecab",
    line: "rgba(126, 101, 32, 0.26)",
    text: "#59492a",
    border: "rgba(151, 121, 34, 0.18)",
  },
  pink: {
    base: "#f3c7cd",
    tint: "#f8dde1",
    line: "rgba(147, 74, 94, 0.24)",
    text: "#62323d",
    border: "rgba(149, 90, 105, 0.2)",
  },
  blue: {
    base: "#cde3f3",
    tint: "#e3f0fa",
    line: "rgba(71, 103, 132, 0.24)",
    text: "#334b61",
    border: "rgba(90, 126, 154, 0.2)",
  },
  green: {
    base: "#d8ebc2",
    tint: "#ebf5dc",
    line: "rgba(82, 112, 53, 0.24)",
    text: "#465933",
    border: "rgba(106, 136, 78, 0.2)",
  },
  peach: {
    base: "#f5d2b2",
    tint: "#fae3cf",
    line: "rgba(149, 99, 55, 0.24)",
    text: "#63462f",
    border: "rgba(161, 110, 68, 0.2)",
  },
} satisfies Record<
  string,
  {
    base: string;
    tint: string;
    line: string;
    text: string;
    border: string;
  }
>;

type StickyNoteProps = {
  children: ReactNode;
  className?: string;
  width?: string;
  minHeight?: string;
  padding?: string;
  title?: string;
  initialX?: number;
  initialY?: number;
  mobileInitialX?: number;
  mobileInitialY?: number;
  pinLeft?: number;
  pinTop?: number;
  pinRotation?: number;
  pinDragOffsetX?: number;
  pinDragOffsetY?: number;
  pinDragRotation?: number;
  color?: StickyNoteColor;
  draggable?: boolean;
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
  mobileInitialX,
  mobileInitialY,
  pinLeft = 42,
  pinTop = -10,
  pinRotation = -9,
  pinDragOffsetX = 4,
  pinDragOffsetY = -5,
  pinDragRotation = -5,
  color = "yellow",
  draggable = true,
}: StickyNoteProps) {
  const noteRef = useRef<HTMLDivElement | null>(null);
  const dragOffsetRef = useRef<Position>({ x: 0, y: 0 });
  const [position, setPosition] = useState<Position>({
    x: initialX,
    y: initialY,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [zIndex, setZIndex] = useState(INITIAL_NOTE_Z_INDEX);

  useEffect(() => {
    const updatePosition = () => {
      const note = noteRef.current;

      if (!note) {
        return;
      }

      const { width: noteWidth, height: noteHeight } =
        note.getBoundingClientRect();

      if (window.innerWidth <= MOBILE_BREAKPOINT) {
        const headHeight = headImage.height * HEAD_SCALE;
        const fallbackX = clamp(
          (window.innerWidth - noteWidth) / 2,
          0,
          Math.max(window.innerWidth - noteWidth, 0)
        );
        const fallbackY = clamp(
          MOBILE_HEAD_TOP_OFFSET + headHeight + MOBILE_HEAD_NOTE_GAP,
          0,
          Math.max(window.innerHeight - noteHeight, 0)
        );

        setPosition({
          x: clamp(
            mobileInitialX ?? fallbackX,
            0,
            Math.max(window.innerWidth - noteWidth, 0)
          ),
          y: clamp(
            mobileInitialY ?? fallbackY,
            0,
            Math.max(window.innerHeight - noteHeight, 0)
          ),
        });

        return;
      }

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
  }, [mobileInitialX, mobileInitialY]);

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
    if (!draggable) {
      return;
    }

    dragOffsetRef.current = {
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
    setZIndex(getNextStackOrder());
    setIsDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggable || !isDragging) {
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
    if (!draggable || !isDragging) {
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

  const palette =
    typeof color === "string" ? NOTE_COLOR_MAP[color] ?? NOTE_COLOR_MAP.yellow : color;

  return (
    <div
      ref={noteRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`${styles.stickyNote} ${
        !draggable ? styles.static : ""
      } ${isDragging ? styles.dragging : ""} ${className}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex,
        width,
        minHeight,
        padding,
        ["--sticky-note-base" as string]: palette.base,
        ["--sticky-note-tint" as string]: palette.tint ?? palette.base,
        ["--sticky-note-line" as string]:
          palette.line ?? "rgba(126, 101, 32, 0.26)",
        ["--sticky-note-text" as string]: palette.text ?? "#59492a",
        ["--sticky-note-border" as string]:
          palette.border ?? "rgba(151, 121, 34, 0.18)",
      }}
    >
      {draggable ? (
        <Image
          src={pinImage}
          alt="pin"
          priority
          draggable={false}
          className={`${styles.pin} ${isDragging ? styles.pinDragging : ""}`}
          style={pinStyle}
        />
      ) : (
        <span className={styles.tape} aria-hidden="true" />
      )}
      {title ? <h3 className={styles.title}>{title}</h3> : null}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
