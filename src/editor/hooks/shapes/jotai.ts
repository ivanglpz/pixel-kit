import { IShape } from "@/editor/shapes/type.shape";
import { atom } from "jotai";

type IOBCElement = {
  [key: string]: IShape;
};

const elementsAtom = atom({} as IOBCElement);

export default elementsAtom;
