import dynamic from "next/dynamic";
import useBrowser from "./hooks/useBrowser/hook";
import useStopZoom from "./hooks/useStopZoom/hook";
import { PixelKitLayers } from "./layers";
import LayoutPixelEditor from "./layout";
import PixelKitStage from "./Stage";
import { useConfiguration } from "./hooks/useConfiguration";

const PixelEditor = () => {
  useStopZoom();
  useBrowser();
  useConfiguration({
    type: "EDIT_IMAGE",
  });
  return (
    <LayoutPixelEditor>
      <PixelKitStage>
        <PixelKitLayers />
      </PixelKitStage>
    </LayoutPixelEditor>
  );
};
const ComponentApp = dynamic(Promise.resolve(PixelEditor), {
  ssr: false,
});

export default ComponentApp;
