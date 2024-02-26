/* eslint-disable react-hooks/exhaustive-deps */
import { useAtom } from "jotai";
import { IShape } from "../../elements/type";
import elementSelectedAtom from "./jotai";

const useSelectedShape = () => {
  const [shapeSelected, setElement] = useAtom(elementSelectedAtom);

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
