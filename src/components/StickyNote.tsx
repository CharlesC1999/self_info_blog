import { ReactNode } from "react";
import styles from "./StickyNote.module.css";

type StickyNoteProps = {
  children: ReactNode;
  className?: string;
  width?: string;
  minHeight?: string;
  padding?: string;
  title?: string;
};

export default function StickyNote({
  children,
  className = "",
  width = "280px",
  minHeight = "180px",
  padding = "20px",
  title,
}: StickyNoteProps) {
  return (
    <div
      className={`${styles.stickyNote} ${className}`}
      style={{
        width,
        minHeight,
        padding,
      }}
    >
      {title ? <h3 className={styles.title}>{title}</h3> : null}
      <div className={styles.content}>{children}</div>
      <span className={styles.corner}></span>
    </div>
  );
}
