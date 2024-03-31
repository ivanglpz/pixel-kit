/* eslint-disable react-hooks/exhaustive-deps */
import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import useShapes from "./shapes/hook";
import useCanvas from "./canvas/hook";

type Config = {
  showPreviewImage: boolean;
  exportMode: "FULL_SCREEN" | "ONLY_IMAGE";
  showFilesBrowser: boolean;
  backgroundColor: string;
  showCanvasConfig: boolean;
};

type Keys = "EDIT_IMAGE" | "FREE_DRAW";

const configs: { [key in Keys]: Config } = {
  EDIT_IMAGE: {
    showPreviewImage: true,
    exportMode: "ONLY_IMAGE",
    showFilesBrowser: true,
    backgroundColor: "#212121",
    showCanvasConfig: false,
  },
  FREE_DRAW: {
    showPreviewImage: false,
    showFilesBrowser: false,
    exportMode: "FULL_SCREEN",
    backgroundColor: "#ffffff",
    showCanvasConfig: true,
  },
};

const configAtom = atom(configs.EDIT_IMAGE);

type Props = {
  type?: Keys;
};

export const useConfiguration = (props?: Props) => {
  const type = props?.type;
  const [config, setConfig] = useAtom(configAtom);
  const { handleResetShapes } = useShapes();
  const { handleConfig } = useCanvas();
  useEffect(() => {
    if (!type) return;
    const tconfig = configs[type];
    setConfig(tconfig);
    handleResetShapes();
    handleConfig({ backgroundColor: tconfig.backgroundColor });
  }, [type]);

  return {
    config,
  };
};
