/* eslint-disable react-hooks/exhaustive-deps */
import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import useShapes from "./useShapes";
import useCanvas from "./useCanvas";
import { IKeyTool } from "../states/tool";
import icons from "@/assets";

type Config = {
  showPreviewImage: boolean;
  exportMode: "FREE_DRAW" | "EDIT_IMAGE";
  showFilesBrowser: boolean;
  backgroundColor: string;
  showCanvasConfig: boolean;
  showClipImageConfig: boolean;
  tools: { icon: JSX.Element; keyMethod: IKeyTool; keyBoard: string }[];
  showBackgroundColor: boolean;
};

type Keys = "EDIT_IMAGE" | "FREE_DRAW";

const configs: { [key in Keys]: Config } = {
  EDIT_IMAGE: {
    showPreviewImage: true,
    exportMode: "EDIT_IMAGE",
    showFilesBrowser: true,
    backgroundColor: "#FFFFFF",
    showCanvasConfig: true,
    showClipImageConfig: true,
    tools: [
      {
        icon: icons.cursor,
        keyMethod: "MOVE",
        keyBoard: "Q",
      },

      {
        icon: icons.box,
        keyMethod: "BOX",
        keyBoard: "W",
      },
      {
        icon: icons.circle,
        keyMethod: "CIRCLE",
        keyBoard: "E",
      },
      {
        icon: icons.line,
        keyMethod: "LINE",
        keyBoard: "R",
      },
      {
        icon: icons.image,
        keyMethod: "IMAGE",
        keyBoard: "A",
      },
      {
        icon: icons.text,
        keyMethod: "TEXT",
        keyBoard: "S",
      },

      {
        icon: icons.peentool,
        keyMethod: "DRAW",
        keyBoard: "D",
      },
    ],
    showBackgroundColor: false,
  },
  FREE_DRAW: {
    showPreviewImage: false,
    showFilesBrowser: false,
    exportMode: "FREE_DRAW",
    backgroundColor: "#ffffff",
    showCanvasConfig: true,
    showClipImageConfig: false,
    tools: [
      {
        icon: icons.cursor,
        keyMethod: "MOVE",
        keyBoard: "Q",
      },
      {
        icon: icons.line,
        keyMethod: "LINE",
        keyBoard: "W",
      },
      {
        icon: icons.text,
        keyMethod: "TEXT",
        keyBoard: "E",
      },
      {
        icon: icons.peentool,
        keyMethod: "DRAW",
        keyBoard: "R",
      },
    ],
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
