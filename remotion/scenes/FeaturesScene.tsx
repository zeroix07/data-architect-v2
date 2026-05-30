import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

interface Feature {
  title: string;
  description: string;
  icon: string;
  color: string;
  delay: number;
}

const features: Feature[] = [
  {
    title: "Simulation Mode",
    description: "Visualize real-time data flow with animated edges and green indicators",
    icon: "⚡",
    color: "#10b981",
    delay: 0,
  },
  {
    title: "Failover / DR",
    description: "Disaster recovery simulation with primary/DR boundary awareness",
    icon: "🛡",
    color: "#f59e0b",
    delay: 15,
  },
  {
    title: "Compliance Engine",
    description: "6 rules: orphan nodes, circular deps, budget, redundant storage",
    icon: "✓",
    color: "#3b82f6",
    delay: 30,
  },
  {
    title: "Version History",
    description: "Named snapshots with save, restore, and delete capabilities",
    icon: "⏱",
    color: "#8b5cf6",
    delay: 45,
  },
  {
    title: "Undo / Redo",
    description: "50-step history with Ctrl+Z / Ctrl+Y keyboard shortcuts",
    icon: "↩",
    color: "#06b6d4",
    delay: 55,
  },
  {
    title: "Export & Share",
    description: "Download as .darch JSON, PNG, or SVG for team collaboration",
    icon: "📤",
    color: "#ec4899",
    delay: 65,
  },
];

export const FeaturesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 15], [-20, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill className="bg-[#0b0e14]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="absolute top-12 left-0 right-0 flex flex-col items-center gap-2">
        <h2
          className="text-3xl font-bold text-white tracking-wide"
          style={{ opacity: titleOpacity, transform: `translateY(${titleY}px)` }}
        >
          Powerful Features
        </h2>
        <p className="text-sm text-slate-400" style={{ opacity: titleOpacity }}>
          Everything you need to design production-ready architectures
        </p>
      </div>

      <div className="absolute top-44 left-0 right-0 flex justify-center">
        <div className="grid grid-cols-3 gap-5" style={{ width: 1400 }}>
          {features.map((feature) => {
            const s = spring({
              frame: frame - feature.delay,
              fps,
              config: { stiffness: 100, damping: 14 },
            });

            return (
              <div
                key={feature.title}
                className="p-6 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent"
                style={{
                  transform: `scale(${s})`,
                  opacity: s,
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                    style={{
                      backgroundColor: `${feature.color}15`,
                      border: `1px solid ${feature.color}30`,
                    }}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                <div
                  className="mt-4 h-0.5 rounded-full"
                  style={{
                    width: `${interpolate(frame - feature.delay, [20, 40], [0, 100], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })}%`,
                    backgroundColor: feature.color,
                    opacity: 0.5,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
