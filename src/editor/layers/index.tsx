import { LayerImage } from "./image";
import { LayerPipe } from "./pipe";
import { LayerShapes } from "./shapes";

export const PixelKitLayers = () => {
  return (
    <>
      <LayerImage />
      <LayerShapes />
      <LayerPipe />
    </>
  );
};
