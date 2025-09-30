import { useAtomValue } from "jotai";
import { Layer, Rect } from "react-konva";
import { useConfiguration } from "../hooks/useConfiguration";
import STAGE_CANVAS_BACKGROUND from "../states/canvas";

export const LayerBackground = () => {
  const background = useAtomValue(STAGE_CANVAS_BACKGROUND);
  const { config } = useConfiguration();

  return (
    <>
      <Layer id="layer-background-color">
        <Rect
          width={config.expand_stage_resolution?.width}
          height={config.expand_stage_resolution?.height}
          x={0}
          y={0}
          fill={background}
        />
      </Layer>
    </>
  );
};
