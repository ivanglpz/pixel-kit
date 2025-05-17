import { atomWithStorage } from "jotai/utils";

export type IStageConfig = {
  backgroundColor?: string;
  graphicMapped?: boolean;
};

const StageConfigAtom = atomWithStorage<IStageConfig>("harmony_stage", {
  backgroundColor: "#04080c",
  graphicMapped: true,
});
export default StageConfigAtom;
