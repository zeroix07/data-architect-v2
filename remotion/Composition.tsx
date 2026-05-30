import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { IntroScene } from "./scenes/IntroScene";
import { CanvasScene } from "./scenes/CanvasScene";
import { MultiCloudScene } from "./scenes/MultiCloudScene";
import { FinOpsScene } from "./scenes/FinOpsScene";
import { TerraformScene } from "./scenes/TerraformScene";
import { FeaturesScene } from "./scenes/FeaturesScene";
import { OutroScene } from "./scenes/OutroScene";

export const DataArchitectDemo: React.FC = () => {
  return (
    <AbsoluteFill className="bg-[#0b0e14]">
      <Sequence from={0} durationInFrames={90}>
        <IntroScene />
      </Sequence>
      <Sequence from={90} durationInFrames={210}>
        <CanvasScene />
      </Sequence>
      <Sequence from={300} durationInFrames={150}>
        <MultiCloudScene />
      </Sequence>
      <Sequence from={450} durationInFrames={120}>
        <FinOpsScene />
      </Sequence>
      <Sequence from={570} durationInFrames={120}>
        <TerraformScene />
      </Sequence>
      <Sequence from={690} durationInFrames={120}>
        <FeaturesScene />
      </Sequence>
      <Sequence from={810} durationInFrames={90}>
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
