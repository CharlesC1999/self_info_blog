import { ReactNode } from "react";
import styles from "./IconPlate.module.css";

type IconPlateProps = {
  children?: ReactNode;
  size?: number;
  className?: string;
};

export default function IconPlate({
  children,
  size = 132,
  className = "",
}: IconPlateProps) {
  return (
    <div
      className={`${styles.plate} ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <div className={styles.inner}>{children}</div>
    </div>
  );
}
