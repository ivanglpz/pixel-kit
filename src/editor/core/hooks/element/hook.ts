/* eslint-disable react-hooks/exhaustive-deps */
import { useAtom } from "jotai";
import { IElement, IParamsElement } from "../../elements/type";
import elementSelectedAtom from "./jotai";

const useSelectedShape = () => {
  const [element, setElement] = useAtom(elementSelectedAtom);

  const handleChangeElement = (params: IElement | IParamsElement) => {
    setElement((prev) => {
      return Object.assign({}, prev, params);
    });
  };

  const handleSetElement = (element: IElement | IParamsElement) => {
    setElement(element);
  };
  const handleEmptyElement = () => {
    setElement({} as IElement | IParamsElement);
  };
  return {
    element,
    handleChangeElement,
    handleEmptyElement,
    handleSetElement,
  };
};

export default useSelectedShape;
