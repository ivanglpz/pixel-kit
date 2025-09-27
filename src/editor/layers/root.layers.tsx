import { useConfiguration } from "../hooks/useConfiguration";
import { LayerBackground } from "./layer.background";
import { LayerPipe } from "./layer.pipe";
import { LayerShapes } from "./layer.shapes";

export const AllLayers = () => {
  const { config } = useConfiguration();

  return (
    <>
      {/* <Valid isValid={config?.show_layer_background}> */}
      <LayerBackground />
      {/* </Valid> */}

      <LayerShapes />
      <LayerPipe />
    </>
  );
};
