"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import headImage from "@/assets/8bit-head.png";
import pinImage from "@/assets/pin.png";
import { clamp } from "@/utils/clamp";

const HEAD_SCALE = 0.675;
const PIN_SCALE = 0.06;
const INITIAL_Y_OFFSET = -48;

type Position = {
  x: number;
  y: number;
};

export default function DraggableHead() {
  const mainRef = useRef<HTMLElement | null>(null);
  const dragOffsetRef = useRef<Position>({ x: 0, y: 0 });
  const headWidth = headImage.width * HEAD_SCALE;
  const headHeight = headImage.height * HEAD_SCALE;
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const updateInitialPosition = () => {
      const container = mainRef.current;

      if (!container) {
        return;
      }

      const { width, height } = container.getBoundingClientRect();

      setPosition({
        x: (width - headWidth) / 2,
        y: (height - headHeight) / 2 + INITIAL_Y_OFFSET,
      });
    };

    updateInitialPosition();
    window.addEventListener("resize", updateInitialPosition);

    return () => window.removeEventListener("resize", updateInitialPosition);
  }, [headHeight, headWidth]);

  const clampPosition = (nextX: number, nextY: number) => {
    const container = mainRef.current;

    if (!container) {
      return { x: nextX, y: nextY };
    }

    const { width, height } = container.getBoundingClientRect();

    return {
      x: clamp(nextX, 0, width - headWidth),
      y: clamp(nextY, 0, height - headHeight),
    };
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragOffsetRef.current = {
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
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

  return (
    <main
      ref={mainRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          position: "absolute",
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${headWidth}px`,
          height: `${headHeight}px`,
          cursor: isDragging ? "grabbing" : "grab",
          touchAction: "none",
          userSelect: "none",
          transform: isDragging ? "translateY(-2px)" : "translateY(0)",
          transition: "transform 140ms ease-out",
        }}
      >
        <Image
          src={pinImage}
          alt="pin"
          priority
          draggable={false}
          style={{
            position: "absolute",
            top: "-4px",
            left: "70px",
            width: `${pinImage.width * PIN_SCALE}px`,
            height: `${pinImage.height * PIN_SCALE}px`,
            zIndex: 2,
            transform: isDragging ? "translate(5px, -5px)" : "translate(0, 0)",
            transition: "transform 140ms ease-out",
            pointerEvents: "none",
            filter: isDragging
              ? "drop-shadow(-3px 5px 2px rgba(38, 56, 88, 0.28))"
              : "none",
          }}
        />
        <Image
          src={headImage}
          alt="8-bit head"
          priority
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            transform: isDragging ? "translateY(-1px)" : "translateY(0)",
            transition: "transform 140ms ease-out",
            filter: isDragging
              ? "drop-shadow(-6px 8px 3px rgba(38, 56, 88, 0.24))"
              : "none",
          }}
        />
      </div>
    </main>
  );
}
