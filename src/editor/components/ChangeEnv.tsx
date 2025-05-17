import { css } from "@stylespixelkit/css";
import { InputSelect } from "./input-select";
import {
  optionsEnviroments,
  useConfiguration,
} from "../hooks/useConfiguration";

export const ChangeEnv = () => {
  const { config, change } = useConfiguration();
  return (
    <div
      className={css({
        position: "fixed",
        bottom: 18,
        right: 23,
        zIndex: 9999999,
        minWidth: 150,
      })}
    >
      <InputSelect
        labelText="Enviroment"
        onChange={(value) => change(value)}
        options={optionsEnviroments}
        value={config?.exportMode ?? "EDIT_IMAGE"}
      />
    </div>
  );
};
