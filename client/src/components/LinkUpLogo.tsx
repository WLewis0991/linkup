import type { CSSProperties } from "react";

interface LinkUpLogoProps {
  size?: number;
  variant?: "bubble" | "flat" | "outline";
  accentColor?: string;
  secondaryColor?: string;
  className?: string;
}

const DEFAULT_ACCENT = "#ff6482";
const DEFAULT_SECONDARY = "#5b7cf6";

export default function LinkUpLogo({
  size = 84,
  variant = "bubble",
  accentColor = DEFAULT_ACCENT,
  secondaryColor = DEFAULT_SECONDARY,
  className,
}: LinkUpLogoProps) {
  const radius = Math.round(size * 0.333);
  const iconSize = Math.round(size * 0.571);

  const bubbleStyle: CSSProperties = {
    width: size,
    height: size,
    borderRadius: radius,
    boxShadow: `0 ${Math.round(size * 0.095)}px ${Math.round(size * 0.38)}px ${accentColor}2e, 0 2px 8px rgba(0,0,0,0.06)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };

  const flatStyle: CSSProperties = {
    width: size,
    height: size,
    borderRadius: radius,
    background: `${accentColor}18`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };

  const outlineStyle: CSSProperties = {
    width: size,
    height: size,
    borderRadius: radius,
    background: "transparent",
    border: `2px solid ${accentColor}40`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };

  const containerStyle =
    variant === "bubble"
      ? bubbleStyle
      : variant === "flat"
        ? flatStyle
        : outlineStyle;

  const sw = (base: number) => (base * iconSize) / 48;

  return (
    <div style={containerStyle} className={className}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="LinkUp logo"
        role="img"
      >
        <rect x="4" y="6" width="30" height="22" rx="9" fill={accentColor} />
        <path d="M10 28 L7 36 L18 30" fill={accentColor} />
        <line
          x1="19"
          y1="21"
          x2="19"
          y2="11"
          stroke="#fff"
          strokeWidth={sw(2.8)}
          strokeLinecap="round"
        />
        <path
          d="M14.5 15 L19 10 L23.5 15"
          fill="none"
          stroke="#fff"
          strokeWidth={sw(2.8)}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="38" cy="34" r="7" fill={secondaryColor} />
        <line
          x1="38"
          y1="37.5"
          x2="38"
          y2="31.5"
          stroke="#fff"
          strokeWidth={sw(2.2)}
          strokeLinecap="round"
        />
        <path
          d="M35.2 33.8 L38 31 L40.8 33.8"
          fill="none"
          stroke="#fff"
          strokeWidth={sw(2.2)}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
