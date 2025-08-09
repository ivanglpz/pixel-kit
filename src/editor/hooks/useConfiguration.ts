/* eslint-disable react-hooks/exhaustive-deps */
import icons from "@/assets";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { IStageEvents } from "../states/event";
import { IKeyTool } from "../states/tool";

export type MODE = "EDIT_IMAGE" | "FREE_DRAW" | "DESIGN_MODE";

type Config = {
  show_layer_image: boolean;
  export_mode: MODE;
  mode: MODE;
  show_files_browser: boolean;
  background_color: string;
  show_canvas_config: boolean;
  show_clip_config: boolean;
  tools: {
    icon?: JSX.Element;
    keyMethod?: IKeyTool;
    keyBoard?: string;
    eventStage?: IStageEvents;
    isSeparation?: boolean;
    showClip?: boolean;
  }[];
  show_layer_background: boolean;
  show_layer_clip: boolean;
  expand_stage: boolean;
  expand_stage_resolution?: {
    width: number;
    height: number;
  };
  scrollInsideStage: boolean;
};

const configs: { [key in MODE]: Config } = {
  DESIGN_MODE: {
    show_layer_image: false,
    export_mode: "DESIGN_MODE",
    mode: "DESIGN_MODE",
    show_files_browser: false,
    background_color: "#FFFFFF",
    show_canvas_config: true,
    show_clip_config: false,
    expand_stage: true,
    expand_stage_resolution: {
      width: 3840,
      height: 2160,
    },
    tools: [
      {
        icon: icons.cursor,
        keyMethod: "MOVE",
        keyBoard: "Q",
        eventStage: "IDLE",
      },
      {
        isSeparation: true,
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
        isSeparation: true,
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
    show_layer_background: true,
    show_layer_clip: false,
    scrollInsideStage: false,
  },
  EDIT_IMAGE: {
    show_layer_image: true,
    export_mode: "EDIT_IMAGE",
    mode: "EDIT_IMAGE",
    show_files_browser: true,
    background_color: "#FFFFFF",
    show_canvas_config: false,
    show_clip_config: true,
    expand_stage: false,
    tools: [
      {
        icon: icons.cursor,
        keyMethod: "MOVE",
        keyBoard: "Q",
        eventStage: "IDLE",
      },
      {
        isSeparation: true,
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
        isSeparation: true,
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
      {
        icon: icons.clip,
        keyMethod: "CLIP",
        keyBoard: "Z",
        eventStage: "IDLE",
        showClip: true,
      },
    ],
    show_layer_background: false,
    show_layer_clip: true,
    scrollInsideStage: true,
  },
  FREE_DRAW: {
    show_layer_image: false,
    export_mode: "FREE_DRAW",
    mode: "FREE_DRAW",
    show_files_browser: false,
    background_color: "#FFFFFF",
    show_canvas_config: true,
    show_clip_config: false,
    expand_stage: true,
    expand_stage_resolution: {
      width: 3840,
      height: 2160,
    },
    tools: [
      {
        icon: icons.cursor,
        keyMethod: "MOVE",
        keyBoard: "Q",
        eventStage: "IDLE",
      },

      // {
      //   icon: icons.box,
      //   keyMethod: "BOX",
      //   keyBoard: "W",
      //   eventStage: "CREATE",
      // },

      // {
      //   icon: icons.circle,
      //   keyMethod: "CIRCLE",
      //   keyBoard: "E",
      //   eventStage: "CREATE",
      // },
      // {
      //   icon: icons.line,
      //   keyMethod: "LINE",
      //   keyBoard: "R",
      //   eventStage: "CREATE",
      // },
      {
        icon: icons.image,
        keyMethod: "IMAGE",
        keyBoard: "W",
        eventStage: "CREATE",
      },
      // {
      //   icon: icons.text,
      //   keyMethod: "TEXT",
      //   keyBoard: "S",
      //   eventStage: "CREATE",
      // },

      {
        icon: icons.peentool,
        keyMethod: "DRAW",
        keyBoard: "E",
        eventStage: "CREATE",
      },
      // {
      //   icon: icons.group,
      //   keyMethod: "GROUP",
      //   keyBoard: "F",
      //   eventStage: "CREATE",
      // },
    ],
    show_layer_background: true,
    show_layer_clip: false,
    scrollInsideStage: false,
  },
};

export const optionsEnviroments = Object.keys(configs)?.map((e, index) => ({
  id: e + index,
  label: e,
  value: e,
}));

export const MODE_ATOM = atom<MODE>("DESIGN_MODE");
const configAtom = atom((get) => configs[get(MODE_ATOM)]);

type Props = {
  type?: MODE;
};

export const useConfiguration = (props?: Props) => {
  const type = props?.type;
  const config = useAtomValue(configAtom);
  const setMode = useSetAtom(MODE_ATOM);
  // const SET_RESET = useSetAtom(CLEAR_SHAPES_ATOM);

  const change = (type?: MODE | string) => {
    if (!type) return;
    setMode(type as MODE);
    // const tconfig = configs[type as MODE];
    // setConfig(tconfig);
    // SET_RESET();
    // setBackground({
    //   backgroundColor:
    //     tconfig?.background_color ?? configs?.DESIGN_MODE?.background_color,
    // });
  };
  useEffect(() => {
    change(type);
  }, [type]);

  return {
    config,
    change,
    type,
  };
};
