import GraphCanvas from "./components/GraphCanvas";
import GraphLoader from "./components/GraphLoader";

const USE_API: boolean = false;

// Types
interface NodeItem {
  id: string;
  label: string;
  x: number;
  y: number;
  rectGroup?: string;
}

interface StraightLink {
  type: "straight";
  from: string;
  to: string;
  esi: string;
  label: string;
  startLabel?: string;
  endLabel?: string;
  reverse?: boolean;
}

interface BranchedLink {
  type: "branched";
  from: string;
  to: string[];
  midX: number;
  esi: string;
  labels: string[];
  startLabel?: string;
  endLabels?: string[];
  reverse?: boolean;
}

type LinkItem = StraightLink | BranchedLink;

const sources: NodeItem[] = [
  { id: "SRC1", label: "JDBC", x: 50, y: 100, rectGroup: "S: S1" },
  { id: "SRC2", label: "SRC2", x: 50, y: 175, rectGroup: "S: S1" },
  { id: "SRC3", label: "SRC3", x: 50, y: 300, rectGroup: "S: S1" },
  { id: "SRC4", label: "SRC4", x: 50, y: 375, rectGroup: "S: S1" },
  { id: "SRC5", label: "SRC5", x: 50, y: 425, rectGroup: "S: S1" },
  { id: "SRC6", label: "SRC6", x: 50, y: 475, rectGroup: "S: S1" },
  { id: "SRC7", label: "SRC7", x: 50, y: 550, rectGroup: "S: S1" },
  { id: "SRC8", label: "SRC8", x: 370, y: 550 },
  { id: "SRC9", label: "SRC9", x: 715, y: 250 },
  { id: "SRC10", label: "SRC46584410", x: 715, y: 425 }
];

const destinations: NodeItem[] = [
  { id: "DST1", label: "DST1", x: 600, y: 100, rectGroup: "D: CRM (SALESFORCECOM)" },
  { id: "DST2", label: "DST2", x: 600, y: 175, rectGroup: "D: CRM (SALESFORCECOM)" },
  { id: "DST3", label: "DST3", x: 600, y: 225, rectGroup: "D: CRM (SALESFORCECOM)" },
  { id: "DST4", label: "DST4", x: 600, y: 300, rectGroup: "D: CRM (SALESFORCECOM)" },
  { id: "DST5", label: "DST5", x: 600, y: 375, rectGroup: "D: CRM (SALESFORCECOM)" },
  { id: "DST6", label: "DST6", x: 250, y: 550, rectGroup: "D: D2" },
  { id: "DST7", label: "DST7", x: 600, y: 550, rectGroup: "D: CRM (SALESFORCECOM)" },
  { id: "DST8", label: "DST8", x: 1000, y: 250, rectGroup: "D: D3" },
  { id: "DST9", label: "DST9", x: 1000, y: 425, rectGroup: "D: D3" },
];

const links: LinkItem[] = [
  {
    type: "straight",
    from: "SRC1",
    to: "DST1",
    esi: "ESI-1241",
    label: "< Producthgdhtkddfh >",
    startLabel: "SI-1115",
    endLabel: "SI-11122365",
  },
  {
    type: "branched",
    from: "SRC2",
    to: ["DST2", "DST3"],
    midX: 250,
    esi: "ESI-1241",
    labels: ["L2", "L3"],
    startLabel: "SI-1116",
    endLabels: ["SI-1117", "SI-1118"],
  },
  {
    type: "straight",
    from: "DST4",
    to: "SRC3",
    reverse: true,
    esi: "ESI-1241",
    label: "L4",
    startLabel: "SI-1115",
    endLabel: "SI-1112",
  },
  {
    type: "branched",
    from: "DST5",
    to: ["SRC4", "SRC5", "SRC6"],
    midX: 450,
    reverse: true,
    esi: "ESI-1241",
    labels: ["Producthgdhtkddfh", "L6", "L7"],
    startLabel: "SI-1116",
    endLabels: ["SI-1117", "SI-1118", "SI-1119"],
  },
  {
    type: "straight",
    from: "SRC7",
    to: "DST6",
    esi: "ESI-1241",
    label: "L8",
  },
  {
    type: "straight",
    from: "SRC8",
    to: "DST7",
    esi: "ESI-1241",
    label: "L9",
  },
  {
    type: "straight",
    from: "SRC9",
    to: "DST8",
    esi: "ESI-1241",
    label: "< Product>",
    startLabel: "SI-1115",
    endLabel: "SI-1112",
  },
  {
    type: "straight",
    from: "SRC10",
    to: "DST9",
    esi: "ESI-1241",
    label: "< Product >",
    startLabel: "SI-1115",
    endLabel: "SI-1112",
  },
];

export default function Page(): JSX.Element {
  if (USE_API) {
    return <GraphLoader />;
  }

  return (
    <GraphCanvas
      sources={sources}
      destinations={destinations}
      links={links}
    />
  );
}
