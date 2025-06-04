import { useAtom } from "jotai";
import { useMemo } from "react";
import TOOL_ATOM, { IKeyMethods } from "../states/tool";

const keyMove: IKeyMethods[] = ["BOX", "CIRCLE", "LINE", "IMAGE", "TEXT"];

const useTool = () => {
  const [tool, setTool] = useAtom(TOOL_ATOM);

  const isMoving = useMemo(() => tool === "MOVE", [tool]);

  const isGoingToCreateAShape = useMemo(
    () => tool !== "MOVE" && tool !== "WRITING" && tool !== "LINE",
    [tool]
  );

  const isNotWriting = useMemo(() => tool !== "WRITING", [tool]);
  const isDrawing = useMemo(() => tool === "DRAW", [tool]);
  const isAddingElements = useMemo(
    () => keyMove?.includes(tool as IKeyMethods),
    [tool]
  );

  return {
    tool: tool as IKeyMethods,
    setTool,
    isMoving,
    isGoingToCreateAShape,
    isNotWriting,
    isDrawing,
    isAddingElements,
  };
};

export default useTool;
