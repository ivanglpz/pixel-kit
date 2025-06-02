/* eslint-disable react-hooks/exhaustive-deps */
import { IShape } from "@/editor/shapes/type.shape";
import { useAtom } from "jotai";
import selectedShapeAtom from "../states/selectedShape";

const useSelectedShape = () => {
  const [shapeSelected, setElement] = useAtom(selectedShapeAtom);

  const handleUpdteShapeSelected = (params: IShape) => {
    setElement((prev) => {
      return Object.assign({}, prev, params);
    });
  };

  const handleSetShapeSelected = (element: IShape) => {
    setElement(element);
  };

  const handleCleanShapeSelected = () => {
    setElement({} as IShape);
  };
  return {
    shapeSelected,
    handleUpdteShapeSelected,
    handleCleanShapeSelected,
    handleSetShapeSelected,
  };
};

export default useSelectedShape;
