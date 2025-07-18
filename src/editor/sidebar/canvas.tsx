import PixelKitInputColor from "@/editor/components/input-color";
import { useCanvas } from "@/editor/hooks";
import { FC } from "react";

const StageConfig: FC = () => {
  const { config, handleConfig } = useCanvas();

  return (
    <PixelKitInputColor
      color={config?.backgroundColor}
      onChangeColor={(backgroundColor) =>
        handleConfig({
          backgroundColor,
        })
      }
      labelText="Canvas color"
      primaryColors
      keyInput="canvas-bg"
    />
  );
};

export default StageConfig;
