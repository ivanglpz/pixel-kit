import { IShape } from "@/editor/shapes/type.shape";
import { Atom, atom } from "jotai";
import { IKeyMethods } from "../tool/types";

type IOBCElement = {
  [key: string]: {
    id: string;
    tool: IKeyMethods;
    state: Atom<IShape>;
  };
};

const elementsAtom = atom({} as IOBCElement);

export default elementsAtom;
