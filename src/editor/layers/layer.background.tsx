import { useAtomValue } from "jotai";
import { useConfiguration } from "../hooks/useConfiguration";
import STAGE_CANVAS_BACKGROUND from "../states/canvas";

export const LayerBackground = () => {
  const background = useAtomValue(STAGE_CANVAS_BACKGROUND);
  const { config } = useConfiguration(); // ✅ Ahora usamos config.expand2K

  return (
    <>
      {/* <Layer id="layer-background-color"> */}
      <div
        // width={width}
        // height={height}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: config.expand_stage_resolution?.width,
          height: config.expand_stage_resolution?.height,
          backgroundColor: background,
        }}
      />
      {/* </Layer> */}
    </>
  );
};
