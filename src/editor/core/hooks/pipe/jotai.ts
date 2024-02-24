import { atom } from "jotai";
import { IElement, IParamsElement } from "../../elements/type";

const pipeElement = atom<IElement>({} as IElement);

export default pipeElement;
