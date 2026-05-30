import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

interface NodeData {
  id: string;
  label: string;
  type: "cloud" | "on-premise" | "open-source";
  x: number;
  y: number;
  color: string;
  delay: number;
}

interface EdgeData {
  from: string;
  to: string;
  delay: number;
}

const nodes: NodeData[] = [
  { id: "api", label: "API Gateway", type: "cloud", x: 120, y: 280, color: "#3b82f6", delay: 0 },
  { id: "kafka", label: "Kafka", type: "open-source", x: 420, y: 180, color: "#06b6d4", delay: 15 },
  { id: "dataflow", label: "Dataflow", type: "cloud", x: 420, y: 400, color: "#3b82f6", delay: 20 },
  { id: "bq", label: "BigQuery", type: "cloud", x: 720, y: 280, color: "#3b82f6", delay: 35 },
  { id: "redis", label: "Redis", type: "on-premise", x: 720, y: 480, color: "#eab308", delay: 40 },
  { id: "looker", label: "Looker", type: "cloud", x: 1020, y: 280, color: "#3b82f6", delay: 50 },
];

const edges: EdgeData[] = [
  { from: "api", to: "kafka", delay: 25 },
  { from: "api", to: "dataflow", delay: 30 },
  { from: "kafka", to: "bq", delay: 45 },
  { from: "dataflow", to: "bq", delay: 45 },
  { from: "bq", to: "looker", delay: 60 },
  { from: "dataflow", to: "redis", delay: 50 },
];

const nodeMap = new Map(nodes.map((n) => [n.id, n]));

const AnimatedNode: React.FC<{ node: NodeData; frame: number; fps: number }> = ({
  node,
  frame,
  fps,
}) => {
  const s = spring({ frame: frame - node.delay, fps, config: { stiffness: 120, damping: 14 } });
  const borderColor =
    node.type === "cloud"
      ? "border-l-orange-500"
      : node.type === "on-premise"
      ? "border-l-yellow-500"
      : "border-l-cyan-500";

  return (
    <div
      className={`absolute px-5 py-3.5 rounded-lg border border-white/10 border-l-4 ${borderColor} bg-[#141A26] shadow-2xl`}
      style={{
        left: node.x,
        top: node.y,
        transform: `scale(${s})`,
        opacity: s,
        minWidth: 160,
      }}
    >
      <div className="text-[9px] uppercase text-white/40 font-bold tracking-widest mb-1">
        {node.type}
      </div>
      <div className="text-sm font-bold text-white">{node.label}</div>
      <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
    </div>
  );
};

export const CanvasScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 15], [-20, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill className="bg-[#0b0e14]">
      {/* Grid background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Header */}
      <div className="absolute top-12 left-0 right-0 flex justify-center">
        <h2
          className="text-3xl font-bold text-white tracking-wide"
          style={{ opacity: titleOpacity, transform: `translateY(${titleY}px)` }}
        >
          Visual Architecture Canvas
        </h2>
      </div>

      {/* Canvas area */}
      <div className="absolute inset-0 top-28 flex items-center justify-center">
        <div className="relative" style={{ width: 1200, height: 600 }}>
          {/* Edges */}
          <svg className="absolute inset-0 w-full h-full" style={{ overflow: "visible" }}>
            {edges.map((edge) => {
              const fromNode = nodeMap.get(edge.from)!;
              const toNode = nodeMap.get(edge.to)!;
              const edgeOpacity = interpolate(
                frame,
                [edge.delay, edge.delay + 15],
                [0, 1],
                { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
              );
              const x1 = fromNode.x + 80;
              const y1 = fromNode.y + 25;
              const x2 = toNode.x;
              const y2 = toNode.y + 25;
              const midX = (x1 + x2) / 2;

              return (
                <g key={`${edge.from}-${edge.to}`} style={{ opacity: edgeOpacity }}>
                  <path
                    d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeDasharray="6,4"
                    style={{
                      filter: "drop-shadow(0 0 4px rgba(59,130,246,0.3))",
                    }}
                  />
                  {/* Arrow */}
                  <circle cx={x2} cy={y2} r="4" fill="#3b82f6" />
                </g>
              );
            })}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => (
            <AnimatedNode key={node.id} node={node} frame={frame} fps={fps} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
