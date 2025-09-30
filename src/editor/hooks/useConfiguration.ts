import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { CONFIG_ATOM, MODE, MODE_ATOM } from "../states/mode";
import { RESET_PAGE_ID_ATOM } from "../states/pages";

type Props = {
  type?: MODE;
};

export const useConfiguration = (props?: Props) => {
  const type = props?.type;
  const config = useAtomValue(CONFIG_ATOM);
  const setMode = useSetAtom(MODE_ATOM);
  const setResetPage = useSetAtom(RESET_PAGE_ID_ATOM);
  // const SET_RESET = useSetAtom(CLEAR_SHAPES_ATOM);

  const change = (type?: MODE | string) => {
    if (!type) return;
    setMode(type as MODE);
    setResetPage();
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
