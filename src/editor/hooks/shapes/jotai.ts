import { atom } from "jotai";
import { IShape } from "../../elements/type";

type IOBCElement = {
  [key: string]: IShape;
};

const elementsAtom = atom({} as IOBCElement);

export default elementsAtom;
