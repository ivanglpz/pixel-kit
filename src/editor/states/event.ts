import { atom } from "jotai";

export type IStageEvents = "CREATE" | "COPY" | "IDLE" | "CREATING" | "CLIPING";

export const EVENT_ATOM = atom<IStageEvents>("IDLE");
