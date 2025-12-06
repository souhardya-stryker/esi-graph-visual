import React from "react";

export interface NodeProps {
  x: number;
  y: number;
  label: string | number;
  onHoverStart?: (label: string | number, e: React.MouseEvent) => void;
  onHoverMove?: (e: React.MouseEvent) => void;
  onHoverEnd?: () => void;
}

const NODE_W = 40;
const NODE_H = 20;

// -------------------------------------
// Helper: compute dynamic font size
// -------------------------------------
const computeFontSize = (label: string | number) => {
  const txt = String(label);
  const baseFont = 15;

  if (txt.length <= 4) return baseFont;      // Normal
  if (txt.length <= 6) return baseFont - 4; // Slightly smaller
  if (txt.length <= 8) return baseFont - 6;

  return baseFont - 6; // Very long text
};

// -------------------------------------
// Helper: truncate text to fit width
// -------------------------------------
const truncateLabel = (label: string | number) => {
  const txt = String(label);
  const maxChars = 6; // Fits comfortably inside NODE_W=40

  if (txt.length <= maxChars) return txt;
  return txt.slice(0, maxChars - 1) + "…";
};

// -------------------------------------
// Component
// -------------------------------------
const Node: React.FC<NodeProps> = ({ x, y, label, onHoverStart, onHoverMove, onHoverEnd, }) => {
  const labelStr = String(label);
  const fontSize = computeFontSize(labelStr);
  const displayText = truncateLabel(labelStr);

  return (
    <g
      onMouseEnter={(e) => onHoverStart && onHoverStart(label, e)}
      onMouseMove={(e) => onHoverMove && onHoverMove(e)}
      onMouseLeave={() => onHoverEnd && onHoverEnd()}
      cursor="pointer"
    >
      <rect
        x={x}
        y={y}
        width={NODE_W}
        height={NODE_H}
        className="fill-white stroke-black stroke-[0.5]"
        rx={0}
        ry={0}
      />

      <text
        x={x + NODE_W / 2}
        y={y + NODE_H / 2 + 2}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontSize: `${fontSize}px`,
          pointerEvents: "none",
        }}
        className="fill-black"
      >
        {displayText}
      </text>
    </g>
  );
};

export default Node;
