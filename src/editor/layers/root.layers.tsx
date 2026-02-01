import { LayerPublicShapes } from "../public/layers/shapes";
import { LayerPipe } from "./layer.pipe";
import { LayerSaelection } from "./layer.selection";

export const AllLayers = () => {
  return (
    <>
      <LayerPublicShapes />
      <LayerSaelection />
      <LayerPipe />
    </>
  );
};
