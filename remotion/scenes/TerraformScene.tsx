import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

const terraformLines = [
  { text: 'terraform {', indent: 0, delay: 0, type: "keyword" },
  { text: '  required_providers {', indent: 1, delay: 5, type: "keyword" },
  { text: '    google = {', indent: 2, delay: 10, type: "property" },
  { text: '      source  = "hashicorp/google"', indent: 3, delay: 15, type: "string" },
  { text: '      version = "~> 5.0"', indent: 3, delay: 18, type: "string" },
  { text: '    }', indent: 2, delay: 21, type: "bracket" },
  { text: '    aws = {', indent: 2, delay: 24, type: "property" },
  { text: '      source  = "hashicorp/aws"', indent: 3, delay: 28, type: "string" },
  { text: '      version = "~> 5.0"', indent: 3, delay: 31, type: "string" },
  { text: '    }', indent: 2, delay: 34, type: "bracket" },
  { text: '  }', indent: 1, delay: 37, type: "bracket" },
  { text: '}', indent: 0, delay: 40, type: "bracket" },
  { text: '', indent: 0, delay: 42, type: "text" },
  { text: 'resource "google_bigquery_dataset" "ds_1" {', indent: 0, delay: 44, type: "resource" },
  { text: '  dataset_id = "ds_node_1"', indent: 1, delay: 48, type: "property" },
  { text: '  location   = "US"', indent: 1, delay: 51, type: "property" },
  { text: '}', indent: 0, delay: 54, type: "bracket" },
  { text: '', indent: 0, delay: 56, type: "text" },
  { text: 'resource "aws_s3_bucket" "s3_1" {', indent: 0, delay: 58, type: "resource" },
  { text: '  bucket = "data-lake-${var.project_id}"', indent: 1, delay: 62, type: "property" },
  { text: '}', indent: 0, delay: 65, type: "bracket" },
];

const getColor = (type: string) => {
  switch (type) {
    case "keyword":
      return "#c084fc";
    case "property":
      return "#60a5fa";
    case "string":
      return "#34d399";
    case "bracket":
      return "#94a3b8";
    case "resource":
      return "#f472b6";
    default:
      return "#e2e8f0";
  }
};

export const TerraformScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 15], [-20, 0], { extrapolateRight: "clamp" });

  const visibleLines = terraformLines.filter((line) => frame >= line.delay);

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
          Auto-Generated Terraform
        </h2>
        <p className="text-sm text-slate-400" style={{ opacity: titleOpacity }}>
          Multi-cloud IaC generated from your architecture graph
        </p>
      </div>

      {/* Code editor */}
      <div className="absolute top-40 left-[140px] right-[140px] bottom-40">
        <div className="h-full rounded-xl border border-white/10 bg-[#0d1117] overflow-hidden shadow-2xl">
          {/* Title bar */}
          <div className="h-10 border-b border-white/10 bg-[#161b22] flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="ml-3 text-xs text-white/40 font-mono">main.tf</span>
          </div>

          {/* Code content */}
          <div className="p-6 font-mono text-sm leading-7 overflow-hidden">
            {visibleLines.map((line, i) => {
              const lineOpacity = interpolate(
                frame,
                [line.delay, line.delay + 5],
                [0, 1],
                { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
              );
              return (
                <div key={i} className="flex" style={{ opacity: lineOpacity }}>
                  <span className="text-white/20 w-10 text-right mr-4 select-none text-xs leading-7">
                    {i + 1}
                  </span>
                  <span style={{ color: getColor(line.type) }}>{line.text || "\u00A0"}</span>
                </div>
              );
            })}

            {/* Cursor */}
            {visibleLines.length > 0 && (
              <div
                className="inline-block w-0.5 h-5 bg-white/80 ml-10"
                style={{
                  opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0,
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Provider badges */}
      <div
        className="absolute bottom-16 left-0 right-0 flex justify-center gap-4"
        style={{
          opacity: interpolate(frame, [70, 85], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        {[
          { name: "GCP", color: "#3b82f6" },
          { name: "AWS", color: "#f97316" },
          { name: "Azure", color: "#0ea5e9" },
        ].map((p) => (
          <div
            key={p.name}
            className="px-3 py-1 rounded-full border border-white/10 bg-white/5"
          >
            <span className="text-xs font-mono font-bold" style={{ color: p.color }}>
              {p.name}
            </span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
