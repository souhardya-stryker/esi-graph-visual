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
  const [error, setError] = useState("");
  const [sources, setSources] = useState<NodeData[]>([]);
  const [destinations, setDestinations] = useState<NodeData[]>([]);
  const [links, setLinks] = useState<LinkData[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const resp = await fetch("/api/graph");

        if (!resp.ok) {
          setError(`Backend returned HTTP ${resp.status}`);
          return;
        }

        const data: ApiResponse = await resp.json();

        const hasGraph =
          data.sources?.length > 0 &&
          data.destinations?.length > 0 &&
          data.links?.length > 0;

        if (!hasGraph) {
          setError("No graph data available.");
          return;
        }

        // Valid data → store and show graph
        setSources(data.sources);
        setDestinations(data.destinations);
        setLinks(data.links);
      } catch (err) {
        setError("Unable to contact backend.");
      } finally {
        // Loader must stop ONLY after response or error is processed
        setLoading(false);
      }
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

  // ---------------------------
  // Error / Empty State UI
  // ---------------------------
  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-red-600 font-semibold">{error}</p>
        <p className="text-gray-500 text-sm">
          Try some other EA solution diagrams or come back later.
        </p>
        <div className="w-2/3 h-64 bg-gray-100 rounded-xl mt-4 opacity-50" />
      </div>
    );
  }

  // ---------------------------
  // Final: Render actual graph
  // ---------------------------
  return (
    <GraphCanvas
      sources={sources}
      destinations={destinations}
      links={links}
    />
  );
}
