import { atom } from "jotai";
import { IShape, IParamsElement } from "../../elements/type";

const elementSelectedAtom = atom<IShape | IParamsElement>({});

export default elementSelectedAtom;
