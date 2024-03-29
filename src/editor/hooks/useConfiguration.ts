/* eslint-disable react-hooks/exhaustive-deps */
import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import useShapes from "./shapes/hook";

type Config = {
  showPreviewImage: boolean;
  exportMode: "FULL_SCREEN" | "ONLY_IMAGE";
  showFilesBrowser: boolean;
};

type Keys = "EDIT_IMAGE" | "FREE_DRAW";

const configs: { [key in Keys]: Config } = {
  EDIT_IMAGE: {
    showPreviewImage: true,
    exportMode: "ONLY_IMAGE",
    showFilesBrowser: true,
  },
  FREE_DRAW: {
    showPreviewImage: false,
    showFilesBrowser: false,
    exportMode: "FULL_SCREEN",
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

  useEffect(() => {
    if (!type) return;
    setConfig(configs[type]);
    handleResetShapes();
  }, [type]);

  return {
    config,
  };
};
