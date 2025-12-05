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
  onHoverStart?: (text: string, e: React.MouseEvent) => void;
  onHoverMove?: (e: React.MouseEvent) => void;
  onHoverEnd?: () => void;
}

export default function StraightArrow({
  fromNode,
  toNode,
  label,
  startLabel,
  endLabel,
  onHoverStart,
  onHoverMove,
  onHoverEnd,
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

  const verticalOffset = 8;


  const measureTextBox = (text: string | undefined) => {
    if (!text) return { boxWidth: 0 };
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return { boxWidth: 0 };
    ctx.font = "10px sans-serif";
    const textWidth = ctx.measureText(text).width;
    return { boxWidth: textWidth + 8 };
  };

  const renderLabelBox = (
    text: string | undefined,
    x: number,
    y: number
  ) => {
    if (!text) return null;
    const { boxWidth } = measureTextBox(text);
    const maxWidth = 60; // max width before truncating

    const displayText =
      boxWidth > maxWidth ? text.slice(0, 10) + "…" : text; // ellipsis logic

    return (
      <foreignObject
        x={x}
        y={y}
        width={Math.min(boxWidth, maxWidth)}
        height={20}
        style={{ overflow: "visible" }}
      >
        <div
          className="bg-sky-50 px-1 text-[10px] flex items-center justify-center whitespace-nowrap overflow-hidden text-ellipsis"
          onMouseEnter={(e) => onHoverStart?.(text || "", e)}
          onMouseMove={(e) => onHoverMove?.(e)}
          onMouseLeave={() => onHoverEnd?.()}
        >
            {displayText}
        </div>
      </foreignObject>
    );
  };

  return (
    <>
      {/* MAIN LINE */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        className="stroke-black stroke-2"
        markerEnd="url(#arrow)"
      />

      {/* MID LABEL */}
      {label && renderLabelBox(label, midX - 30, midY - 8)}

      {/* START LABEL */}
      {startLabel &&
        renderLabelBox(startLabel,
          goingRight ? x1 + 20 : x1 - 60,
          y1 + verticalOffset
        )}

      {/* END LABEL */}
      {endLabel &&
        renderLabelBox(endLabel,
          goingRight ? x2 - 60 : x2 + 20,
          y2 + verticalOffset
        )}
    </>
  );
}
