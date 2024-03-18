import { IShape } from "@/editor/shapes/type.shape";
import { atom } from "jotai";

const pipeElement = atom<IShape>({} as IShape);

export default pipeElement;
