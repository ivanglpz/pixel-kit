/* eslint-disable react-hooks/exhaustive-deps */
import { atom, useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";
import useCanvas from "./useCanvas";
import { IKeyTool } from "../states/tool";
import icons from "@/assets";
import { CLEAR_SHAPES_ATOM } from "../states/shapes";

type Config = {
  showPreviewImage: boolean;
  exportMode: "FREE_DRAW" | "EDIT_IMAGE";
  showFilesBrowser: boolean;
  backgroundColor: string;
  showCanvasConfig: boolean;
  showClipImageConfig: boolean;
  tools: { icon: JSX.Element; keyMethod: IKeyTool; keyBoard: string }[];
  showBackgroundColor: boolean;
  showClipImage: boolean;
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
      {
        icon: icons.group,
        keyMethod: "GROUP",
        keyBoard: "F",
      },
    ],
    showBackgroundColor: false,
    showClipImage: true,
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
    showClipImage: false,
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
  const SET_RESET = useSetAtom(CLEAR_SHAPES_ATOM);
  const { handleConfig } = useCanvas();

  const handleChangeConfig = (type?: Keys | string) => {
    if (!type) return;
    const tconfig = configs[type as Keys];
    setConfig(tconfig);
    SET_RESET();
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
