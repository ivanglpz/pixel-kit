/* eslint-disable react-hooks/exhaustive-deps */
import { useAtom } from "jotai";
import { IElement } from "../../elements/type";
import elementSelectedAtom from "./jotai";

const useSelectedShape = () => {
  const [shapeSelected, setElement] = useAtom(elementSelectedAtom);

  const handleUpdteShapeSelected = (params: IElement) => {
    setElement((prev) => {
      return Object.assign({}, prev, params);
    });
  };

  const handleSetShapeSelected = (element: IElement) => {
    setElement(element);
  };

  const handleCleanShapeSelected = () => {
    setElement({} as IElement);
  };
  return {
    shapeSelected,
    handleUpdteShapeSelected,
    handleCleanShapeSelected,
    handleSetShapeSelected,
  };
};

export default useSelectedShape;
