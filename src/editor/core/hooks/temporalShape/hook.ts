/* eslint-disable react-hooks/exhaustive-deps */
import { useAtom, useSetAtom } from "jotai";
import { IElement, IParamsElement } from "../../elements/type";
import pipeElement from "./jotai";

const useTemporalShape = () => {
  const [temporalShape, setElement] = useAtom(pipeElement);
  const setTemporalShape = useSetAtom(pipeElement);

  const handleUpdateTemporalShape = (params: IElement) => {
    setElement((prev) => {
      return Object.assign({}, prev, params);
    });
  };
  const handleCreateTemporalShape = (value: IElement) => {
    setTemporalShape(value);
  };

  const handleCleanTemporalShape = () => {
    setElement({} as IElement);
  };
  return {
    temporalShape,
    handleUpdateTemporalShape,
    handleCleanTemporalShape,
    handleCreateTemporalShape,
  };
};
export default useTemporalShape;
