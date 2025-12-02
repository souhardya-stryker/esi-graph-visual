import React from "react";

interface NodeData {
  x: number;
  y: number;
}

interface BranchedArrowProps {
  fromNode: NodeData;
  branchNodes?: NodeData[];
  midX?: number;
  reverse?: boolean;
  labels?: string[];
  startLabel?: string;
  endLabels?: string[];
}

export default function BranchedArrow({
  fromNode,
  branchNodes = [],
  midX,
  reverse = false,
  labels = [],
  startLabel = "",
  endLabels = [],
}: BranchedArrowProps) {
  const NODE_W = 40;
  const NODE_H = 20;

  const goingRight = !reverse;

  const trunkStartX = goingRight ? fromNode.x + NODE_W : fromNode.x;
  const trunkY = fromNode.y + NODE_H / 2;

  // Compute midX if not provided
  let computedMidX = midX;
  if (computedMidX == null) {
    const avgTargetX =
      branchNodes.reduce((sum, n) => sum + n.x, 0) /
      Math.max(1, branchNodes.length);

    computedMidX = goingRight
      ? trunkStartX + Math.max(80, (avgTargetX - trunkStartX) / 2)
      : trunkStartX - Math.max(80, (trunkStartX - avgTargetX) / 2);
  }

  const arrowHead = "url(#arrow)";

  // ---------------------------
  // Helper: auto-size label box
  // ---------------------------
  const makeLabelBox = (
    text: string | undefined,
    x: number,
    y: number
  ): JSX.Element | null => {
    if (!text) return null;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.font = "10px sans-serif";
    const textWidth = ctx.measureText(text).width;
    const padding = 8;
    const boxWidth = textWidth + padding;

    return (
      <foreignObject
        x={x - boxWidth / 2}
        y={y}
        width={boxWidth}
        height={20}
        style={{ overflow: "visible" }}
      >
        <div
          
          className="bg-sky-50 px-1 text-[10px] flex items-center justify-center whitespace-nowrap"
        >
          {text}
        </div>
      </foreignObject>
    );
  };

  return (
    <>
      {/* Horizontal trunk */}
      <line
        x1={trunkStartX}
        y1={trunkY}
        x2={computedMidX}
        y2={trunkY}
        className="stroke-black stroke-[2]"
      />

      {/* START LABEL under trunk */}
      {startLabel &&
        makeLabelBox(
          startLabel,
          goingRight ? trunkStartX + 40 : trunkStartX - 40,
          trunkY + 8
        )}

      {/* Branches */}
      {branchNodes.map((bn, i) => {
        if (!bn) return null;

        const destX = goingRight ? bn.x : bn.x + NODE_W;
        const destY = bn.y + NODE_H / 2;

        const midBranchX = (computedMidX + destX) / 2;
        const midBranchY = destY;

        const branchLabel = labels[i];
        const endLabel = endLabels[i];

        return (
          <g key={i}>
            {/* vertical line */}
            <line
              x1={computedMidX}
              y1={trunkY}
              x2={computedMidX}
              y2={destY}
              className="stroke-black stroke-[2]"
            />

            {/* horizontal line */}
            <line
              x1={computedMidX}
              y1={destY}
              x2={destX}
              y2={destY}
              className="stroke-black stroke-[2]"
              markerEnd={arrowHead}
            />

            {/* MID BRANCH LABEL */}
            {branchLabel &&
              (() => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                if (!ctx) return null;

                ctx.font = "10px sans-serif";
                const textWidth = ctx.measureText(branchLabel).width;
                const padding = 8;
                const width = textWidth + padding;

                const x = midBranchX - width / 2;

                return (
                  <foreignObject
                    x={x}
                    y={midBranchY - 8}
                    width={width}
                    height={20}
                    style={{ overflow: "visible" }}
                  >
                    <div
                      xmlns="http://www.w3.org/1999/xhtml"
                      className="bg-sky-50 px-1 text-[10px] flex items-center justify-center whitespace-nowrap"
                    >
                      {branchLabel}
                    </div>
                  </foreignObject>
                );
              })()}

            {/* End label below each branch */}
            {endLabel &&
              makeLabelBox(
                endLabel,
                goingRight ? destX - 40 : destX + 40,
                destY + 8
              )}
          </g>
        );
      })}
    </>
  );
}
