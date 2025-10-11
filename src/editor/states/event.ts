import { atom } from "jotai";
import { PROJECT_ATOM } from "./projects";

export type IStageEvents =
  | "CREATE"
  | "COPY"
  | "IDLE"
  | "CREATING"
  // | "CLIPING"
  | "COPYING"
  | "COPY"
  | "MULTI_SELECT"
  | "SELECT_AREA";

export const EVENT_ATOM = atom(
  (get) => get(get(PROJECT_ATOM).EVENT),
  (_get, _set, newTool: IStageEvents) => {
    const toolAtom = _get(PROJECT_ATOM).EVENT;
    _set(toolAtom, newTool);
  }
);
