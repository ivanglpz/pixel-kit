/* eslint-disable react-hooks/exhaustive-deps */
import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import useShapes from "./useShapes";
import useCanvas from "./useCanvas";
import { IKeyTool } from "../states/tool";

type Config = {
  showPreviewImage: boolean;
  exportMode: "FREE_DRAW" | "EDIT_IMAGE";
  showFilesBrowser: boolean;
  backgroundColor: string;
  showCanvasConfig: boolean;
  showClipImageConfig: boolean;
  tools: IKeyTool[];
  showBackgroundColor: boolean;
};

type Keys = "EDIT_IMAGE" | "FREE_DRAW";

const configs: { [key in Keys]: Config } = {
  EDIT_IMAGE: {
    showPreviewImage: true,
    exportMode: "EDIT_IMAGE",
    showFilesBrowser: true,
    backgroundColor: "#212121",
    showCanvasConfig: false,
    showClipImageConfig: true,
    tools: ["MOVE", "BOX", "CIRCLE", "LINE", "IMAGE", "TEXT", "DRAW"],
    showBackgroundColor: false,
  },
  FREE_DRAW: {
    showPreviewImage: false,
    showFilesBrowser: false,
    exportMode: "FREE_DRAW",
    backgroundColor: "#ffffff",
    showCanvasConfig: true,
    showClipImageConfig: false,
    tools: ["MOVE", "LINE", "TEXT", "DRAW"],
    showBackgroundColor: true,
  },
};

export const optionsEnviroments = Object.keys(configs)?.map((e, index) => ({
  id: e + index,
  label: e,
  value: e,
}));

const configAtom = atom(configs.EDIT_IMAGE);

type Props = {
  type?: Keys;
};

export const useConfiguration = (props?: Props) => {
  const type = props?.type;
  const [config, setConfig] = useAtom(configAtom);
  const { handleResetShapes } = useShapes();
  const { handleConfig } = useCanvas();

  const handleChangeConfig = (type?: Keys | string) => {
    if (!type) return;
    const tconfig = configs[type as Keys];
    setConfig(tconfig);
    handleResetShapes();
    handleConfig({
      backgroundColor:
        tconfig?.backgroundColor ?? configs?.EDIT_IMAGE?.backgroundColor,
    });
  };
  useEffect(() => {
    handleChangeConfig();
  }, [type]);

  return {
    config,
    change: handleChangeConfig,
    type,
  };
};
