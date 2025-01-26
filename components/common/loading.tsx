import { TextShimmerWave } from "../ui/text-shimmer-wave";
import React from "react";

type LoadingProps = {
  text?: string;
};

const Loading: React.FC<LoadingProps> = ({ text = "Loading..." }) => {
  return (
    <TextShimmerWave className="font-mono text-sm" duration={1}>
      {text}
    </TextShimmerWave>
  );
};

export default Loading;
