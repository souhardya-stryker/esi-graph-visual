import React from "react";

export interface NodeProps {
  x: number;
  y: number;
  label: string | number;
}

const Node: React.FC<NodeProps> = ({ x, y, label }) => {
  return (
    <>
      <rect
        x={x}
        y={y}
        width={40}
        height={20}
        className="fill-white stroke-black stroke-[0.5]"
        rx={0}
        ry={0}
      />
      <text
        x={x + 20}
        y={y + 15}
        className="text-sm"
        textAnchor="middle"
      >
        {label}
      </text>
    </>
  );
};

export default Node;
