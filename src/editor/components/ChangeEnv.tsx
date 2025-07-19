import { useAtomValue } from "jotai";
import {
  optionsEnviroments,
  useConfiguration,
} from "../hooks/useConfiguration";
import TOOL_ATOM from "../states/tool";
import { InputSelect } from "./input-select";

export const StageMode = () => {
  const { config, change } = useConfiguration();
  const tool = useAtomValue(TOOL_ATOM);

  if (tool !== "MOVE") return null;
  return (
    <InputSelect
      labelText="Mode"
      onChange={(value) => change(value)}
      options={optionsEnviroments}
      value={config?.export_mode ?? "EDIT_IMAGE"}
    />
  );
};
