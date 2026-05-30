import React from "react";
import { Composition } from "remotion";
import { DataArchitectDemo } from "./Composition";
import "./index.css";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DataArchitectDemo"
        component={DataArchitectDemo}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
