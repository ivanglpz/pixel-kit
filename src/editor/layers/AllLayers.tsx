import { Valid } from "@/components/valid";
import { LayerImage } from "./image";
import { LayerPipe } from "./pipe";
import { LayerShapes } from "./shapes";
import { useConfiguration } from "../hooks/useConfiguration";
import { LayerBackground } from "./background";
import { LayerClip } from "./clip";

export const AllLayers = () => {
  const { config } = useConfiguration();
  return (
    <>
      <Valid isValid={config?.showBackgroundColor}>
        <LayerBackground />
      </Valid>
      <Valid isValid={config?.showPreviewImage}>
        <LayerImage />
      </Valid>
      <Valid isValid={config.showClipImage}>
        <LayerClip />
      </Valid>
      <LayerShapes />
      <LayerPipe />
    </>
  );
};
