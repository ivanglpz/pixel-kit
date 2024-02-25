import { useAtom } from "jotai";
import { useMemo } from "react";
import toolEditorAtom from "./jotai";
import { IKeyMethods } from "./types";

const keyMove: IKeyMethods[] = ["BOX", "CIRCLE", "LINE", "IMAGE", "TEXT"];

const useTool = () => {
  const [tool, setTool] = useAtom(toolEditorAtom);

  const isMoving = useMemo(() => tool === "MOVE", [tool]);

  const isGoingToCreateAShape = useMemo(
    () => tool !== "MOVE" && tool !== "WRITING",
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
