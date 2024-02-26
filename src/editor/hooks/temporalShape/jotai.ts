import { atom } from "jotai";
import { IShape, IParamsElement } from "../../elements/type";

const pipeElement = atom<IShape>({} as IShape);

export default pipeElement;
