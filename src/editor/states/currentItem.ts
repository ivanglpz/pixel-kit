import { IShape } from "@/editor/shapes/type.shape";
import { atom } from "jotai";

const currentItemAtom = atom<IShape>({} as IShape);

export default currentItemAtom;
