import { LayerPipe } from "./layer.pipe";
import { LayerSaelection } from "./layer.selection";
import { LayerShapes } from "./layer.shapes";

export const AllLayers = () => {
  return (
    <>
      <LayerShapes />
      <LayerSaelection />
      <LayerPipe />
    </>
  );
};
