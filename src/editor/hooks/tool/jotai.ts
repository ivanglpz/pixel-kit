import { atom } from "jotai";
import { IKeyTool } from "./types";

const toolEditorAtom = atom("MOVE" as IKeyTool);

export default toolEditorAtom;
