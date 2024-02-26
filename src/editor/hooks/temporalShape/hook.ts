/* eslint-disable react-hooks/exhaustive-deps */
import { useAtom, useSetAtom } from "jotai";
import { IShape, IParamsElement } from "../../elements/type";
import pipeElement from "./jotai";

const useTemporalShape = () => {
  const [temporalShape, setElement] = useAtom(pipeElement);
  const setTemporalShape = useSetAtom(pipeElement);

  const handleUpdateTemporalShape = (params: IShape) => {
    setElement((prev) => {
      return Object.assign({}, prev, params);
    });
  };
  const handleCreateTemporalShape = (value: IShape) => {
    setTemporalShape(value);
  };

  const handleCleanTemporalShape = () => {
    setElement({} as IShape);
  };
  return {
    temporalShape,
    handleUpdateTemporalShape,
    handleCleanTemporalShape,
    handleCreateTemporalShape,
  };
};
export default useTemporalShape;
