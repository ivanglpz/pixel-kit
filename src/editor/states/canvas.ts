import { atomWithStorage } from "jotai/utils";

export type IStageConfig = {
  backgroundColor?: string;
  graphicMapped?: boolean;
};

const STAGE_CANVAS_BACKGROUND = atomWithStorage<IStageConfig>(
  "pixel-kit-canvas-config",
  {
    backgroundColor: "#000000",
  }
);
export default STAGE_CANVAS_BACKGROUND;
