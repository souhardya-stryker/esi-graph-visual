// components/GraphLoader.tsx
import { useEffect, useState } from "react";
import GraphCanvas from "./GraphCanvas";

// ---------------------------
// Types matching GraphCanvas
// ---------------------------
interface NodeData {
  id: string;
  label: string;
  x: number;
  y: number;
  rectGroup?: string;
}

interface LinkStraight {
  type: "straight";
  from: string;
  to: string;
  esi?: string;
  label?: string;
  startLabel?: string;
  endLabel?: string;
}

interface LinkBranched {
  type: "branched";
  from: string;
  to: string[];
  midX?: number;
  reverse?: boolean;
  esi?: string;
  labels?: string[];
  startLabel?: string;
  endLabels?: string[];
}

type LinkData = LinkStraight | LinkBranched;

interface ApiResponse {
  sources: NodeData[];
  destinations: NodeData[];
  links: LinkData[];
}

export default function GraphLoader() {
  const [loading, setLoading] = useState(true);
  const [sources, setSources] = useState<NodeData[]>([]);
  const [destinations, setDestinations] = useState<NodeData[]>([]);
  const [links, setLinks] = useState<LinkData[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      try {
        const resp = await fetch("/api/graph");
        const data: ApiResponse = await resp.json();

        setSources(data.sources || []);
        setDestinations(data.destinations || []);
        setLinks(data.links || []);
      } catch (err) {
        console.error("Graph API failed:", err);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  // ---------------------------
  // Loading UI
  // ---------------------------
  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-6">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        <p className="text-gray-600 text-sm">Building graph…</p>
        <div className="w-2/3 h-64 bg-gray-100 rounded-xl mt-4" />
      </div>
    );
  }

  return (
    <GraphCanvas
      sources={sources}
      destinations={destinations}
      links={links}
    />
  );
}
