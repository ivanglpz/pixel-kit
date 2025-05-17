import { Valid } from "@/components/valid";
import { LayerImage } from "./image";
import { LayerPipe } from "./pipe";
import { LayerShapes } from "./shapes";
import { useConfiguration } from "../hooks/useConfiguration";
import { LayerBackground } from "./background";

export const PixelKitLayers = () => {
  const { config } = useConfiguration();
  return (
    <>
      <Valid isValid={config?.showBackgroundColor}>
        <LayerBackground />
      </Valid>
      <Valid isValid={config?.showPreviewImage}>
        <LayerImage />
      </Valid>
      <LayerShapes />
      <LayerPipe />
    </>
  );
};
