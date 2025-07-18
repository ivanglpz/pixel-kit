import {
  optionsEnviroments,
  useConfiguration,
} from "../hooks/useConfiguration";
import { InputSelect } from "./input-select";

export const ChangeEnv = () => {
  const { config, change } = useConfiguration();
  return (
    <InputSelect
      labelText="Enviroment"
      onChange={(value) => change(value)}
      options={optionsEnviroments}
      value={config?.export_mode ?? "EDIT_IMAGE"}
    />
  );
};
