import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

interface CloudProvider {
  name: string;
  services: string[];
  color: string;
  bgColor: string;
  delay: number;
}

const providers: CloudProvider[] = [
  {
    name: "Google Cloud",
    services: ["BigQuery", "Cloud Storage", "Dataflow", "Vertex AI", "Pub/Sub", "Spanner"],
    color: "#3b82f6",
    bgColor: "rgba(59,130,246,0.1)",
    delay: 0,
  },
  {
    name: "AWS",
    services: ["S3", "EC2", "RDS", "Lambda", "DynamoDB", "Redshift"],
    color: "#f97316",
    bgColor: "rgba(249,115,22,0.1)",
    delay: 20,
  },
  {
    name: "Azure",
    services: ["Blob Storage", "VMs", "SQL DB", "Functions", "Cosmos DB"],
    color: "#0ea5e9",
    bgColor: "rgba(14,165,233,0.1)",
    delay: 40,
  },
  {
    name: "Alibaba Cloud",
    services: ["OSS", "ECS", "RDS", "SLS"],
    color: "#f59e0b",
    bgColor: "rgba(245,158,11,0.1)",
    delay: 55,
  },
  {
    name: "Tencent Cloud",
    services: ["COS", "CVM", "CDB"],
    color: "#8b5cf6",
    bgColor: "rgba(139,92,246,0.1)",
    delay: 65,
  },
];

const ProviderCard: React.FC<{
  provider: CloudProvider;
  frame: number;
  fps: number;
  index: number;
}> = ({ provider, frame, fps, index }) => {
  const s = spring({
    frame: frame - provider.delay,
    fps,
    config: { stiffness: 100, damping: 14 },
  });

  const y = 160 + index * 155;

  return (
    <div
      className="absolute rounded-xl border border-white/10 overflow-hidden"
      style={{
        left: 140,
        top: y,
        width: 1640,
        height: 130,
        transform: `scale(${s})`,
        opacity: s,
        background: `linear-gradient(135deg, ${provider.bgColor}, rgba(26,31,41,0.9))`,
      }}
    >
      <div className="flex items-center h-full px-8 gap-8">
        {/* Provider name */}
        <div className="flex items-center gap-3 min-w-[200px]">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: provider.color, boxShadow: `0 0 12px ${provider.color}40` }}
          />
          <span className="text-xl font-bold text-white">{provider.name}</span>
        </div>

        {/* Services */}
        <div className="flex gap-3 flex-1">
          {provider.services.map((service, i) => {
            const serviceDelay = provider.delay + 10 + i * 5;
            const serviceS = spring({
              frame: frame - serviceDelay,
              fps,
              config: { stiffness: 120, damping: 12 },
            });
            return (
              <div
                key={service}
                className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5"
                style={{
                  transform: `scale(${serviceS})`,
                  opacity: serviceS,
                }}
              >
                <span className="text-xs font-medium text-slate-300">{service}</span>
              </div>
            );
          })}
        </div>

        {/* Node count */}
        <div className="text-right min-w-[100px]">
          <span className="text-2xl font-mono font-bold" style={{ color: provider.color }}>
            {provider.services.length}
          </span>
          <span className="text-xs text-white/40 ml-1">services</span>
        </div>
      </div>
    </div>
  );
};

export const MultiCloudScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 15], [-20, 0], { extrapolateRight: "clamp" });
  const totalCount = providers.reduce((acc, p) => acc + p.services.length, 0);
  const counterOpacity = interpolate(frame, [70, 85], [0, 1], { extrapolateRight: "clamp" });

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

      <div className="absolute top-12 left-0 right-0 flex flex-col items-center gap-3">
        <h2
          className="text-3xl font-bold text-white tracking-wide"
          style={{ opacity: titleOpacity, transform: `translateY(${titleY}px)` }}
        >
          Multi-Cloud Support
        </h2>
        <div
          className="text-sm text-slate-400"
          style={{ opacity: counterOpacity }}
        >
          <span className="text-blue-400 font-mono font-bold text-lg">{totalCount}</span> services across{" "}
          <span className="text-blue-400 font-mono font-bold text-lg">{providers.length}</span> cloud providers
        </div>
      </div>

      {providers.map((provider, i) => (
        <ProviderCard
          key={provider.name}
          provider={provider}
          frame={frame}
          fps={fps}
          index={i}
        />
      ))}
    </AbsoluteFill>
  );
};
