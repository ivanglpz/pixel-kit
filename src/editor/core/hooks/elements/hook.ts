/* eslint-disable react-hooks/exhaustive-deps */
import { useAtom } from "jotai";
import { useCallback } from "react";
import { IElement, IParamsElement } from "../../elements/type";
import useTool from "../tool/hook";
import elementsAtom from "./jotai";

const useShapes = () => {
  const [shapes, setShapes] = useAtom(elementsAtom);

  const handleCreateShape = useCallback((element: IElement) => {
    if (element?.id) {
      setShapes((prev) => {
        return Object.assign({}, prev, { [`${element?.id}`]: element });
      });
    }
  }, []);

  const handleUpdateShape = useCallback((element: IElement) => {
    if (element?.id) {
      setShapes((prev) => {
        return Object.assign({}, prev, { [`${element?.id}`]: element });
      });
    }
  }, []);
  const handleDeleteShape = useCallback((id: string) => {
    setShapes((prev) => {
      delete prev[id];
      const data = Object.assign({}, prev);
      return data;
    });
  }, []);
  const handleDeleteManyShapes = useCallback((ids: string[]) => {
    setShapes((prev) => {
      for (const iterator of ids) {
        delete prev[iterator];
      }
      const data = Object.assign({}, prev);
      return data;
    });
  }, []);

  const handleDeleteShapesByPage = useCallback((pageId: string) => {
    setShapes((prev) => {
      for (const iterator of Object.values(prev)) {
        if (pageId === iterator.pageId) {
          delete prev[`${iterator.id}`];
        }
      }
      const data = Object.assign({}, prev);
      return data;
    });
  }, []);

  return {
    shapes,
    handleCreateShape,
    handleDeleteShape,
    handleDeleteManyShapes,
    handleDeleteShapesByPage,
    handleUpdateShape,
  };
};

export default useShapes;
