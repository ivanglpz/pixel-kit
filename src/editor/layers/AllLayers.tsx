import { Valid } from "@/components/valid";
import { useConfiguration } from "../hooks/useConfiguration";
import { LayerBackground } from "./background";
import { LayerClip } from "./clip";
import { LayerImage } from "./image";
import { LayerPipe } from "./pipe";
import { LayerShapes } from "./shapes";

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
