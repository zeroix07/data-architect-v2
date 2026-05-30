import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgGlow = interpolate(frame, [0, 40], [0, 0.2], { extrapolateRight: "clamp" });
  const titleS = spring({ frame, fps, config: { stiffness: 80, damping: 12 } });
  const subtitleOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: "clamp" });
  const subtitleY = interpolate(frame, [15, 30], [20, 0], { extrapolateRight: "clamp" });
  const ctaS = spring({ frame: frame - 30, fps, config: { stiffness: 100, damping: 14 } });
  const badgeOpacity = interpolate(frame, [45, 60], [0, 1], { extrapolateRight: "clamp" });
  const lineWidth = interpolate(frame, [10, 30], [0, 300], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill className="bg-[#0b0e14] flex items-center justify-center">
      {/* Radial glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: 1000,
          height: 1000,
          background: `radial-gradient(circle, rgba(59,130,246,${bgGlow}) 0%, transparent 70%)`,
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative flex flex-col items-center gap-6">
        {/* Icon — matches project logo */}
        <div className="relative" style={{ transform: `scale(${titleS})` }}>
          <div
            className="w-16 h-16 rounded-xl bg-[#3b82f6] flex items-center justify-center"
            style={{ boxShadow: "0 0 40px rgba(59,130,246,0.3)" }}
          >
            <div className="w-8 h-8 border-[3px] border-white rotate-45" />
          </div>
          <div className="absolute top-0 right-0 -mr-1 -mt-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#0b0e14]" />
        </div>

        <h1
          className="text-6xl font-bold text-white tracking-tight"
          style={{
            transform: `scale(${titleS})`,
            opacity: titleS,
          }}
        >
          Start Building Today
        </h1>

        <div
          className="h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
          style={{ width: lineWidth }}
        />

        <p
          className="text-xl text-slate-400 font-medium"
          style={{
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
          }}
        >
          Design production-ready data architectures in minutes
        </p>

        {/* CTA Button */}
        <div
          className="mt-4"
          style={{
            transform: `scale(${ctaS})`,
            opacity: ctaS,
          }}
        >
          <div
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-lg shadow-2xl"
            style={{
              boxShadow: "0 0 30px rgba(59,130,246,0.3)",
            }}
          >
            Get Started Free
          </div>
        </div>

        {/* Version + links */}
        <div
          className="mt-6 flex items-center gap-6"
          style={{ opacity: badgeOpacity }}
        >
          <span className="text-xs font-mono text-white/30">v2.4.0</span>
          <span className="text-xs text-white/20">|</span>
          <span className="text-xs text-white/30">github.com/data-architect</span>
          <span className="text-xs text-white/20">|</span>
          <span className="text-xs text-white/30">MIT License</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
