// GraphCanvas.tsx
import React from "react";
import Node from "./Node";
import StraightArrow from "./StraightArrow";
import BranchedArrow from "./BranchedArrow";

// -----------------------------
// Type Definitions
// -----------------------------
export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  rectGroup?: string;
}

export interface StraightLink {
  type: "straight";
  from: string;
  to: string;
  label?: string;
  esi?: string;
  startLabel?: string;
  endLabel?: string;
}

export interface BranchedLink {
  type: "branched";
  from: string;
  to: string[];
  midX?: number;
  reverse?: boolean;
  labels?: string[];
  esi?: string;
  startLabel?: string;
  endLabels?: string[];
}

export type Link = StraightLink | BranchedLink;

interface Props {
  sources: GraphNode[];
  destinations: GraphNode[];
  links: Link[];
}

// -----------------------------
// Component
// -----------------------------
export default function GraphCanvas({
  sources = [],
  destinations = [],
  links = [],
}: Props) {
  const NODE_W = 40;
  const NODE_H = 20;
  const RECT_PAD = 30;
  const SVG_PAD = 50;

  const allNodes = [...sources, ...destinations];

  const findNode = (
    idOrLabel: string,
    shifted = true
  ): GraphNode | undefined =>
    (shifted ? shiftedNodes : allNodes).find(
      (n) => n.id === idOrLabel || n.label === idOrLabel
    );

  // -------------------------------
  // 1. Group rectangles by rectGroup
  // -------------------------------
  const groups: Record<string, GraphNode[]> = {};
  allNodes.forEach((n) => {
    if (!n.rectGroup) return;
    if (!groups[n.rectGroup]) groups[n.rectGroup] = [];
    groups[n.rectGroup].push(n);
  });

  const groupRects = Object.entries(groups).map(([groupName, nodes]) => {
    let minGX = Infinity,
      minGY = Infinity,
      maxGX = -Infinity,
      maxGY = -Infinity;

    nodes.forEach((n) => {
      minGX = Math.min(minGX, n.x);
      maxGX = Math.max(maxGX, n.x + NODE_W);
      minGY = Math.min(minGY, n.y);
      maxGY = Math.max(maxGY, n.y + NODE_H);
    });

    return {
      groupName,
      x: minGX - RECT_PAD,
      y: minGY - RECT_PAD,
      w: maxGX - minGX + RECT_PAD * 2.5,
      h: maxGY - minGY + RECT_PAD * 2,
    };
  });

  // -------------------------------
  // 2. Compute SVG bounds
  // -------------------------------
  const minX = Math.min(...groupRects.map((r) => r.x - 100)) - SVG_PAD;
  const minY = Math.min(...groupRects.map((r) => r.y)) - SVG_PAD;
  const maxX = Math.max(...groupRects.map((r) => r.x + r.w + 100)) + SVG_PAD;
  const maxY = Math.max(...groupRects.map((r) => r.y + r.h)) + SVG_PAD;

  const svgWidth = maxX - minX;
  const svgHeight = maxY - minY;

  // -------------------------------
  // 3. Shift nodes and rectangle positions
  // -------------------------------
  const shiftedRects = groupRects.map((r) => ({
    ...r,
    x: r.x - minX,
    y: r.y - minY,
  }));

  const shiftedNodes = allNodes.map((n) => ({
    ...n,
    x: n.x - minX,
    y: n.y - minY,
  }));

  const shiftedSources = shiftedNodes.filter((n) =>
    sources.some((s) => s.id === n.id)
  );
  const shiftedDestinations = shiftedNodes.filter((n) =>
    destinations.some((d) => d.id === n.id)
  );

  // -------------------------------
  // 4. Link boundary rectangles
  // -------------------------------
  const linkRects = links.map((edge, idx) => {
    const involved: GraphNode[] = [];

    const fromN = findNode(edge.from);
    if (fromN) involved.push(fromN);

    if (edge.type === "straight") {
      const toN = findNode(edge.to);
      if (toN) involved.push(toN);
    }

    if (edge.type === "branched") {
      edge.to
        .map((t) => findNode(t))
        .filter(Boolean)
        .forEach((n) => n && involved.push(n));
    }

    if (involved.length === 0) return null;

    let minLX = Infinity,
      minLY = Infinity,
      maxLX = -Infinity,
      maxLY = -Infinity;

    involved.forEach((n) => {
      minLX = Math.min(minLX, n.x);
      maxLX = Math.max(maxLX, n.x + NODE_W);
      minLY = Math.min(minLY, n.y);
      maxLY = Math.max(maxLY, n.y + NODE_H);
    });

    const PAD = 15;

    return {
      id: "L" + idx,
      x: minLX - PAD,
      y: minLY - PAD,
      w: maxLX - minLX + PAD * 1.5,
      h: maxLY - minLY + PAD * 2,
      esi: (edge as any).esi,
    };
  });

  // -------------------------------
  // 5. Render
  // -------------------------------
  return (
    <div className="p-6">
      <svg
        width={svgWidth}
        height={svgHeight}
        className="border border-gray-300 bg-white"
      >
        <defs>
          <marker
            id="arrow"
            markerWidth="6"
            markerHeight="6"
            refX="6"
            refY="3"
            orient="auto-start-reverse"
          >
            <polygon points="0 0, 6 3, 0 6" className="fill-black" />
          </marker>
        </defs>

        {/* ------------------- GROUP RECTANGLES ------------------- */}
        {shiftedRects.map((g) =>
          g.groupName[0] === "S" ? (
            <React.Fragment key={g.groupName}>
              <rect
                x={g.x - 60}
                y={g.y}
                width={g.w}
                height={g.h}
                rx={10}
                ry={10}
                fill="#e5e5e5"
                stroke="#999"
                strokeWidth="1"
              />
              <foreignObject x={g.x - 60} y={g.y} width={g.w} height={g.h}>
                <div
                  xmlns="http://www.w3.org/1999/xhtml"
                  className="w-full h-full flex items-center justify-center text-center p-2 text-sm font-semibold text-gray-700 break-words"
                >
                  Platform
                </div>
              </foreignObject>
            </React.Fragment>
          ) : (
            <rect
              key={g.groupName}
              x={g.x + 50}
              y={g.y}
              width={g.w}
              height={g.h}
              rx={10}
              ry={10}
              fill="#e5e5e5"
              stroke="#999"
              strokeWidth="1"
            />
          )
        )}

        {/* ------------------- LINK RECT BOUNDARIES ------------------- */}
        {linkRects.map(
          (lr) =>
            lr && (
              <React.Fragment key={lr.id}>
                <rect
                  x={lr.x}
                  y={lr.y}
                  width={lr.w}
                  height={lr.h}
                  rx={12}
                  ry={12}
                  fill="#f0f9ff"
                  stroke="#38bdf8"
                  strokeWidth="1"
                  opacity="0.45"
                />
                <foreignObject
                  x={lr.x + lr.w / 2 - 40}
                  y={lr.y - 12}
                  width={80}
                  height={24}
                >
                  <div
                    xmlns="http://www.w3.org/1999/xhtml"
                    className="bg-white text-black text-xs px-2 py-1 rounded-full w-full h-full flex items-center justify-center shadow-sm border border-black"
                  >
                    {lr.esi}
                  </div>
                </foreignObject>
              </React.Fragment>
            )
        )}

        {/* ------------------- NODES ------------------- */}
        {shiftedSources.map((s, i) => (
          <Node key={`s-${i}`} {...s} />
        ))}
        {shiftedDestinations.map((d, i) => (
          <Node key={`d-${i}`} {...d} />
        ))}

        {/* ------------------- LINKS ------------------- */}
        {links.map((edge, idx) => {
          const fromNode = findNode(edge.from);
          if (!fromNode) return null;

          if (edge.type === "straight") {
            const toNode = findNode(edge.to);
            if (!toNode) return null;

            return (
              <StraightArrow
                key={idx}
                fromNode={fromNode}
                toNode={toNode}
                label={edge.label}
                startLabel={edge.startLabel}
                endLabel={edge.endLabel}
              />
            );
          }

          if (edge.type === "branched") {
            const branchNodes = edge.to
              .map((t) => findNode(t))
              .filter(Boolean) as GraphNode[];

            return (
              <BranchedArrow
                key={idx}
                fromNode={fromNode}
                branchNodes={branchNodes}
                midX={edge.midX ? edge.midX - minX : undefined}
                reverse={edge.reverse}
                labels={edge.labels || []}
                startLabel={edge.startLabel}
                endLabels={edge.endLabels || []}
              />
            );
          }

          return null;
        })}
      </svg>
    </div>
  );
}
