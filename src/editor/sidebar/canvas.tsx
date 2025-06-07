import PixelKitInputColor from "@/editor/components/input-color";
import { Section } from "@/editor/components/section";
import { useCanvas } from "@/editor/hooks";
import { FC } from "react";

const StageConfig: FC = () => {
  const { config, handleConfig } = useCanvas();

  return (
    <Section title="Canvas">
      <PixelKitInputColor
        color={config?.backgroundColor}
        onChangeColor={(backgroundColor) =>
          handleConfig({
            backgroundColor,
          })
        }
        labelText="Background"
        primaryColors
        keyInput="canvas-bg"
      />
    </Section>
  );
};

export default StageConfig;
