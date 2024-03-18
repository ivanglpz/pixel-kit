import { IShape } from "@/editor/shapes/type.shape";
import { atom } from "jotai";

const elementSelectedAtom = atom<IShape>({} as IShape);

export default elementSelectedAtom;
