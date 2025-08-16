import {
  optionsEnviroments,
  useConfiguration,
} from "../hooks/useConfiguration";
import { InputSelect } from "./input-select";

export const StageMode = () => {
  const { config, change } = useConfiguration();

  return (
    <InputSelect
      labelText="Mode"
      onChange={(value) => change(value)}
      options={optionsEnviroments}
      value={config?.export_mode ?? "EDIT_IMAGE"}
    />
  );
};
