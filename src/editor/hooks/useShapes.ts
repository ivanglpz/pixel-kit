/* eslint-disable react-hooks/exhaustive-deps */
import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import elementsAtom from "../states/shapes";
import { IShape } from "@/editor/shapes/type.shape";

const useShapes = () => {
  const [shapes, setShapes] = useAtom(elementsAtom);

  const handleCreateShape = useCallback((element: IShape) => {
    if (element?.id) {
      setShapes((prev) => {
        return Object.assign({}, prev, {
          [`${element?.id}`]: {
            id: element?.id,
            tool: element?.tool,
            state: atom(element),
          },
        });
      });
    }
  }, []);

  const handleUpdateShape = useCallback((element: IShape) => {
    if (element?.id) {
      setShapes((prev) => {
        return Object.assign({}, prev, { [`${element?.id}`]: element });
      });
    }
  }, []);
  const handleDeleteShapeInShapes = useCallback((id: string) => {
    setShapes((prev) => {
      delete prev[id];
      const data = Object.assign({}, prev);
      return data;
    });
  }, []);
  const handleDeleteManyShapesInShapes = useCallback((ids: string[]) => {
    setShapes((prev) => {
      for (const iterator of ids) {
        delete prev[iterator];
      }
      const data = Object.assign({}, prev);
      return data;
    });
  }, []);

  const handleResetShapes = () => setShapes({});

  return {
    shapes,
    handleCreateShape,
    handleDeleteShapeInShapes,
    handleDeleteManyShapesInShapes,
    handleUpdateShape,
    handleResetShapes,
  };
};

export default useShapes;
