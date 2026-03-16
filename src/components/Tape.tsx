import { CSSProperties } from "react";
import styles from "./Tape.module.css";

type TapeProps = {
  width?: number;
  height?: number;
  rotation?: number;
  opacity?: number;
  className?: string;
};

export default function Tape({
  width = 96,
  height = 28,
  rotation = -8,
  opacity = 0.65,
  className = "",
}: TapeProps) {
  const style: CSSProperties & { "--tape-rotation": string } = {
    width: `${width}px`,
    height: `${height}px`,
    opacity,
    "--tape-rotation": `${rotation}deg`,
  };

  return (
    <span className={`${styles.tape} ${className}`} style={style}>
      <span className={styles.base}>
        <span className={styles.baseFace} />
      </span>
      <span className={styles.shadow} />
      <span className={styles.flap}>
        <span className={styles.face} />
        <span className={styles.underside} />
      </span>
    </span>
  );
}
