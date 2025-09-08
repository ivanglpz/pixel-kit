import { useConfiguration } from "../hooks/useConfiguration";
import { OPTIONS_CONFIG } from "../states/mode";
import { InputSelect } from "./input-select";

export const StageMode = () => {
  const { config, change } = useConfiguration();

  return (
    <InputSelect
      labelText="Mode"
      onChange={(value) => change(value)}
      options={OPTIONS_CONFIG}
      value={config?.export_mode ?? "EDIT_IMAGE"}
    />
  );
};
