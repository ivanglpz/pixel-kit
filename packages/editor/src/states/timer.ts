import { atom } from "jotai";
type TimerState = {
  REMAINING_MS: number;
  IS_RUNNING: boolean;
};
export const TIMER_ATOM = atom<TimerState>({
  REMAINING_MS: 0,
  IS_RUNNING: false,
});

export const START_TIMER_ATOM = atom(null, (_, set) => {
  set(TIMER_ATOM, {
    REMAINING_MS: 3000,
    IS_RUNNING: true,
  });
});
