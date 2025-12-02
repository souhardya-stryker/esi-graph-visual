import React from "react";

interface NodeData {
  x: number;
  y: number;
}

interface StraightArrowProps {
  fromNode: NodeData;
  toNode: NodeData;
  label?: string;
  startLabel?: string;
  endLabel?: string;
}

export default function StraightArrow({
  fromNode,
  toNode,
  label,
  startLabel,
  endLabel,
}: StraightArrowProps) {
  const NODE_W = 40;
  const NODE_H = 20;

  const goingRight = fromNode.x < toNode.x;

  const x1 = fromNode.x + (goingRight ? NODE_W : 0);
  const y1 = fromNode.y + NODE_H / 2;

  const x2 = toNode.x + (goingRight ? 0 : NODE_W);
  const y2 = toNode.y + NODE_H / 2;

  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  // --------------------------
  // Helper: measure text width
  // --------------------------
  const measureTextBox = (text: string | undefined) => {
    if (!text) return null;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    ctx.font = "10px sans-serif";
    const textWidth = ctx.measureText(text).width;
    const padding = 8;

    return { boxWidth: textWidth + padding };
  };

  const verticalOffset = 8;

  return (
    <>
      {/* MAIN LINE */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        className="stroke-black stroke-[2]"
        markerEnd="url(#arrow)"
      />

      {/* MID LABEL */}
      {label &&
        (() => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) return null;

          ctx.font = "10px sans-serif";
          const textWidth = ctx.measureText(label).width;
          const boxWidth = textWidth + 8;

          const xPos = midX - boxWidth / 2;

          return (
            <foreignObject
              x={xPos}
              y={midY - 8}
              width={boxWidth}
              height={20}
              style={{ overflow: "visible" }}
            >
              <div
                xmlns="http://www.w3.org/1999/xhtml"
                className="bg-sky-50 px-1 text-[10px] flex items-center justify-center whitespace-nowrap"
              >
                {label}
              </div>
            </foreignObject>
          );
        })()}

      {/* START LABEL */}
      {startLabel &&
        (() => {
          const m = measureTextBox(startLabel);
          if (!m) return null;

          const xPos = goingRight ? x1 + 20 : x1 - 60;

          return (
            <foreignObject
              x={xPos}
              y={y1 + verticalOffset}
              width={m.boxWidth}
              height={20}
              style={{ overflow: "visible" }}
            >
              <div
                xmlns="http://www.w3.org/1999/xhtml"
                className="bg-sky-50 px-1 text-[10px] flex items-center justify-center whitespace-nowrap"
              >
                {startLabel}
              </div>
            </foreignObject>
          );
        })()}

      {/* END LABEL */}
      {endLabel &&
        (() => {
          const m = measureTextBox(endLabel);
          if (!m) return null;

          const xPos = goingRight ? x2 - 60 : x2 + 20;

          return (
            <foreignObject
              x={xPos}
              y={y2 + verticalOffset}
              width={m.boxWidth}
              height={20}
              style={{ overflow: "visible" }}
            >
              <div
                xmlns="http://www.w3.org/1999/xhtml"
                className="bg-sky-50 px-1 text-[10px] flex items-center justify-center whitespace-nowrap"
              >
                {endLabel}
              </div>
            </foreignObject>
          );
        })()}
    </>
  );
}
