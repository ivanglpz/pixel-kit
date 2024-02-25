import { useAtom } from "jotai";
import { useCallback } from "react";
import StageConfigAtom from "./jotai";
import { IStageConfig } from "./types";

const useStyleConfig = () => {
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

export default useStyleConfig;
