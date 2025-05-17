import dynamic from "next/dynamic";
import useBrowser from "./hooks/useBrowser";
import useStopZoom from "./hooks/useStopZoom";
import { PixelKitLayers } from "./layers";
import LayoutPixelEditor from "./layout";
import PixelKitStage from "./stage";
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
