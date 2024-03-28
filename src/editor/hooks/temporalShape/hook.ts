import { useAtom, useSetAtom } from "jotai";
import pipeElement from "./jotai";
import { IShape } from "@/editor/shapes/type.shape";

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
