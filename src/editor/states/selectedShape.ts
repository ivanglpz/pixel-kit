import { IShape } from "@/editor/shapes/type.shape";
import { atom } from "jotai";

const selectedShapeAtom = atom<IShape>({} as IShape);

export default selectedShapeAtom;
