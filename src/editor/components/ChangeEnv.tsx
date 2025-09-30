import { useConfiguration } from "../hooks/useConfiguration";
import { OPTIONS_CONFIG } from "../states/mode";
import { Input } from "./input";

export const StageMode = () => {
  const { config, change } = useConfiguration();

  return (
    <>
      <Input.Container>
        <Input.withPause>
          <Input.Select
            onChange={(value) => change(value)}
            options={OPTIONS_CONFIG}
            value={config?.export_mode ?? "EDIT_IMAGE"}
          />
        </Input.withPause>
      </Input.Container>
    </>
  );
};
