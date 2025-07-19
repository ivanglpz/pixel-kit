import { Valid } from "@/components/valid";
import { useConfiguration } from "../hooks/useConfiguration";
import { LayerBackground } from "./layer.background";
import { LayerClip } from "./layer.clip";
import { LayerImage } from "./layer.image";
import { LayerPipe } from "./layer.pipe";
import { LayerShapes } from "./layer.shapes";

export type AllLayerProps = {
  type: "edit" | "preview";
};

export const AllLayers = () => {
  const { config } = useConfiguration();

  return (
    <>
      <Valid isValid={config?.show_layer_background}>
        <LayerBackground />
      </Valid>
      <Valid isValid={config?.show_layer_image}>
        <LayerImage />
      </Valid>
      <Valid isValid={config.show_layer_clip}>
        <LayerClip />
      </Valid>
      <LayerShapes />
      <LayerPipe />
    </>
  );
};
