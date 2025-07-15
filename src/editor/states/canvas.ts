import { atomWithStorage } from "jotai/utils";

export type IStageConfig = {
  backgroundColor?: string;
  graphicMapped?: boolean;
};

const StageConfigAtom = atomWithStorage<IStageConfig>(
  "pixel-kit-canvas-config",
  {
    backgroundColor: "#000000",
    graphicMapped: true,
  }
);
export default StageConfigAtom;
