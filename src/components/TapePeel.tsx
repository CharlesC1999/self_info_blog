import { CSSProperties } from "react";
import "./TapePeel.css";

type TapePeelProps = {
  width?: number;
  height?: number;
  rotation?: number;
  opacity?: number;
  className?: string;
  label?: string;
};

export default function TapePeel({
  width = 96,
  height = 28,
  rotation = -8,
  opacity = 0.65,
  className = "",
  label = "",
}: TapePeelProps) {
  const style: CSSProperties & {
    "--tape-width": string;
    "--tape-height": string;
    "--tape-rotation": string;
    "--tape-opacity": number;
  } = {
    width: `${width}px`,
    height: `${height}px`,
    "--tape-width": `${width}px`,
    "--tape-height": `${height}px`,
    "--tape-rotation": `${rotation}deg`,
    "--tape-opacity": opacity,
  };

  return (
    <button className={`tape-peel ${className}`.trim()} style={style} type="button" aria-label={label || "Tape peel"}>
      <span className="tape-peel__shadow" aria-hidden="true" />
      <span className="tape-peel__stuck" aria-hidden="true" />
      <span className="tape-peel__lift-clip" aria-hidden="true">
        <span className="tape-peel__lift-body">
          <span className="tape-peel__underside" />
          <span className="tape-peel__shine" />
          <span className="tape-peel__tip" />
        </span>
      </span>
      {label ? <span className="tape-peel__label">{label}</span> : null}
    </button>
  );
}
