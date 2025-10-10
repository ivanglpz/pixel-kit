import { LayerPipe } from "./layer.pipe";
import { LayerShapes } from "./layer.shapes";

export const AllLayers = () => {
  return (
    <>
      <LayerShapes />
      <LayerPipe />
    </>
  );
};
