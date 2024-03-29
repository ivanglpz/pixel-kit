import { useAtom } from "jotai";
import { DrawingBeforeStartAtom } from "./state";

export const useBeforeStartDrawing = () => {
  const [state, setState] = useAtom(DrawingBeforeStartAtom);

  const handleChangeColor = (color: string) => {
    setState((prev) => ({ ...prev, color }));
  };
  const handleThickness = (thickness: number) => {
    setState((prev) => ({ ...prev, thickness }));
  };
  const handleChangeLine = (
    key: keyof typeof state,
    value: string | number | boolean
  ) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  return {
    ...state,
    state,
    handleChangeColor,
    handleThickness,
    handleChangeLine,
    handleDash: handleChangeLine,
  };
};
