import { css } from "@stylespixelkit/css";
import { InputSelect } from "./input-select";
import {
  optionsEnviroments,
  useConfiguration,
} from "../hooks/useConfiguration";
import { Section } from "./section";

export const ChangeEnv = () => {
  const { config, change } = useConfiguration();
  return (
    <Section title="Enviroment">
      <InputSelect
        onChange={(value) => change(value)}
        options={optionsEnviroments}
        value={config?.exportMode ?? "EDIT_IMAGE"}
      />
    </Section>
  );
};
