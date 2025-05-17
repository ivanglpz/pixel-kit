import { useAtom } from "jotai";
import { useCallback } from "react";
import StageConfigAtom, { IStageConfig } from "../states/canvas";

const useCanvas = () => {
  const [config, setConfig] = useAtom(StageConfigAtom);

  const handleConfig = useCallback(
    (params: IStageConfig) => {
      setConfig((prev) => {
        return Object.assign({}, prev, params);
      });
    },
    [setConfig]
  );

  return {
    config,
    handleConfig,
  };
};

export default useCanvas;
