import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

const costItems = [
  { name: "BigQuery", cost: 52, color: "#3b82f6", delay: 10 },
  { name: "Cloud Storage", cost: 23, color: "#06b6d4", delay: 20 },
  { name: "Dataflow", cost: 78, color: "#8b5cf6", delay: 30 },
  { name: "Kafka", cost: 8, color: "#10b981", delay: 38 },
  { name: "Cloud SQL", cost: 55, color: "#f59e0b", delay: 46 },
  { name: "Vertex AI", cost: 95, color: "#ef4444", delay: 54 },
];

export const FinOpsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 15], [-20, 0], { extrapolateRight: "clamp" });

  let runningTotal = 0;
  const totalCost = costItems.reduce((acc, item) => acc + item.cost, 0);
  const counterProgress = interpolate(frame, [60, 100], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const displayCost = Math.round(counterProgress * totalCost);

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
          FinOps Cost Estimation
        </h2>
        <p className="text-sm text-slate-400" style={{ opacity: titleOpacity }}>
          Real-time cost tracking per service
        </p>
      </div>

      {/* Cost counter */}
      <div className="absolute top-40 left-0 right-0 flex justify-center">
        <div
          className="px-10 py-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm"
          style={{
            opacity: interpolate(frame, [50, 65], [0, 1], { extrapolateRight: "clamp" }),
            transform: `scale(${spring({ frame: frame - 50, fps, config: { stiffness: 80, damping: 12 } })})`,
          }}
        >
          <div className="text-center">
            <div className="text-[10px] uppercase text-white/40 font-bold tracking-widest mb-2">
              Estimated Monthly Cost
            </div>
            <div className="text-6xl font-mono font-bold text-emerald-400">
              ${displayCost}
              <span className="text-2xl text-emerald-400/60">.00</span>
              <span className="text-lg text-white/40">/mo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cost items */}
      <div className="absolute top-[420px] left-0 right-0 flex justify-center">
        <div className="grid grid-cols-3 gap-4" style={{ width: 900 }}>
          {costItems.map((item) => {
            const s = spring({ frame: frame - item.delay, fps, config: { stiffness: 100, damping: 14 } });
            const barWidth = interpolate(frame, [item.delay + 10, item.delay + 30], [0, (item.cost / 100) * 100], {
              extrapolateRight: "clamp",
              extrapolateLeft: "clamp",
            });

            return (
              <div
                key={item.name}
                className="px-4 py-3 rounded-lg border border-white/10 bg-[#141A26]"
                style={{ transform: `scale(${s})`, opacity: s }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-slate-300">{item.name}</span>
                  <span className="text-sm font-mono font-bold" style={{ color: item.color }}>
                    ${item.cost}
                  </span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: item.color,
                      boxShadow: `0 0 8px ${item.color}40`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Budget threshold warning */}
      <div
        className="absolute bottom-20 left-0 right-0 flex justify-center"
        style={{
          opacity: interpolate(frame, [90, 105], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <div className="px-4 py-2 rounded-lg border border-amber-500/30 bg-amber-500/10 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-xs text-amber-400 font-medium">Budget threshold: $500/mo</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
