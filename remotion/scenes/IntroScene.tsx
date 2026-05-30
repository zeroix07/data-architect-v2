import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { stiffness: 80, damping: 12 } });
  const subtitleOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" });
  const subtitleY = interpolate(frame, [20, 40], [30, 0], { extrapolateRight: "clamp" });
  const versionOpacity = interpolate(frame, [40, 55], [0, 1], { extrapolateRight: "clamp" });
  const lineWidth = interpolate(frame, [10, 30], [0, 400], { extrapolateRight: "clamp" });
  const bgGlow = interpolate(frame, [0, 60], [0, 0.15], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill className="bg-[#0b0e14] flex items-center justify-center">
      {/* Radial glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: 800,
          height: 800,
          background: `radial-gradient(circle, rgba(59,130,246,${bgGlow}) 0%, transparent 70%)`,
        }}
      />

      {/* Grid background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative flex flex-col items-center gap-6">
        {/* Icon — matches project logo: blue rounded square + white rotated diamond + red dot */}
        <div className="relative" style={{ transform: `scale(${titleSpring})` }}>
          <div
            className="w-20 h-20 rounded-2xl bg-[#3b82f6] flex items-center justify-center shadow-2xl"
            style={{ boxShadow: "0 0 60px rgba(59,130,246,0.3)" }}
          >
            <div className="w-10 h-10 border-[3px] border-white rotate-45" />
          </div>
          <div className="absolute top-0 right-0 -mr-1.5 -mt-1.5 w-5 h-5 bg-red-500 rounded-full border-[3px] border-[#0b0e14]" />
        </div>

        {/* Title */}
        <h1
          className="text-7xl font-bold text-white tracking-tight"
          style={{
            transform: `scale(${titleSpring})`,
            opacity: titleSpring,
          }}
        >
          Ultimate Data Architect
        </h1>

        {/* Line */}
        <div
          className="h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
          style={{ width: lineWidth }}
        />

        {/* Subtitle */}
        <p
          className="text-2xl text-slate-400 font-medium tracking-wide"
          style={{
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
          }}
        >
          Design, Simulate & Deploy Enterprise Data Architectures
        </p>

        {/* Version badge */}
        <div
          className="mt-4 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
          style={{ opacity: versionOpacity }}
        >
          <span className="text-xs font-mono text-blue-400 tracking-wider">v2.4.0</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
