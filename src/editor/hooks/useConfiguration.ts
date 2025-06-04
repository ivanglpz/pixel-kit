/* eslint-disable react-hooks/exhaustive-deps */
import icons from "@/assets";
import { atom, useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";
import { IStageEvents } from "../states/event";
import { CLEAR_SHAPES_ATOM } from "../states/shapes";
import { IKeyTool } from "../states/tool";
import useCanvas from "./useCanvas";

type Config = {
  showPreviewImage: boolean;
  exportMode: "FREE_DRAW" | "EDIT_IMAGE";
  showFilesBrowser: boolean;
  backgroundColor: string;
  showCanvasConfig: boolean;
  showClipImageConfig: boolean;
  tools: {
    icon: JSX.Element;
    keyMethod: IKeyTool;
    keyBoard: string;
    eventStage: IStageEvents;
  }[];
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
        eventStage: "IDLE",
      },

      {
        icon: icons.box,
        keyMethod: "BOX",
        keyBoard: "W",
        eventStage: "CREATE",
      },

      {
        icon: icons.circle,
        keyMethod: "CIRCLE",
        keyBoard: "E",
        eventStage: "CREATE",
      },
      {
        icon: icons.line,
        keyMethod: "LINE",
        keyBoard: "R",
        eventStage: "CREATE",
      },
      {
        icon: icons.image,
        keyMethod: "IMAGE",
        keyBoard: "A",
        eventStage: "CREATE",
      },
      {
        icon: icons.text,
        keyMethod: "TEXT",
        keyBoard: "S",
        eventStage: "CREATE",
      },

      {
        icon: icons.peentool,
        keyMethod: "DRAW",
        keyBoard: "D",
        eventStage: "CREATE",
      },
      {
        icon: icons.group,
        keyMethod: "GROUP",
        keyBoard: "F",
        eventStage: "CREATE",
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
        eventStage: "IDLE",
      },

      {
        icon: icons.box,
        keyMethod: "BOX",
        keyBoard: "W",
        eventStage: "CREATE",
      },

      {
        icon: icons.circle,
        keyMethod: "CIRCLE",
        keyBoard: "E",
        eventStage: "CREATE",
      },
      {
        icon: icons.line,
        keyMethod: "LINE",
        keyBoard: "R",
        eventStage: "CREATE",
      },
      {
        icon: icons.image,
        keyMethod: "IMAGE",
        keyBoard: "A",
        eventStage: "CREATE",
      },
      {
        icon: icons.text,
        keyMethod: "TEXT",
        keyBoard: "S",
        eventStage: "CREATE",
      },

      {
        icon: icons.peentool,
        keyMethod: "DRAW",
        keyBoard: "D",
        eventStage: "CREATE",
      },
      {
        icon: icons.group,
        keyMethod: "GROUP",
        keyBoard: "F",
        eventStage: "CREATE",
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
