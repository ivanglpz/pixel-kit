import { atom } from "jotai";
import { IElement, IParamsElement } from "../../elements/type";

type IOBCElement = {
  [key: string]: IElement | IParamsElement;
};

const elementsAtom = atom({} as IOBCElement);

export default elementsAtom;
