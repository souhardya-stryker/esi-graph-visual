import React from "react";

export interface Point {
  x: number;
  y: number;
}

export interface EdgeData {
  points: Point[];
  color?: string;
  width?: number;
  directed?: boolean;
}

interface EdgeProps {
  edge: EdgeData;
}

const Edge: React.FC<EdgeProps> = ({ edge }) => {
  const pts = edge.points || [];

  if (pts.length === 2) {
    const [a, b] = pts;

    return (
      <line
        x1={a.x}
        y1={a.y}
        x2={b.x}
        y2={b.y}
        stroke={edge.color || "black"}
        strokeWidth={edge.width || 2}
        markerEnd={edge.directed ? "url(#arrow)" : undefined}
      />
    );
  }

  // Multi-segment → polyline
  return (
    <polyline
      points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
      fill="none"
      stroke={edge.color || "black"}
      strokeWidth={edge.width || 2}
      markerEnd={edge.directed ? "url(#arrow)" : undefined}
    />
  );
};

export default Edge;
