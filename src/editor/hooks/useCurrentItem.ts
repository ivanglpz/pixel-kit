import { useAtom, useSetAtom } from "jotai";
import currentItemAtom from "../states/currentItem";
import { IShape } from "@/editor/shapes/type.shape";

const useCurrentItem = () => {
  const [temporalShape, setElement] = useAtom(currentItemAtom);
  const setTemporalShape = useSetAtom(currentItemAtom);

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
export default useCurrentItem;
