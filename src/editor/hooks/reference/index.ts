/* eslint-disable react-hooks/exhaustive-deps */
import { atom, useAtom } from "jotai";
import Konva from "konva";
import { RefObject, useEffect } from "react";

type IKType = "STAGE" | "CONTAINER";

type IGPayload<T extends IKType, R> = {
  type: T;
  ref?: RefObject<R>;
};

type IListItems =
  | IGPayload<"STAGE", Konva.Stage>
  | IGPayload<"CONTAINER", Konva.Stage>;

type IPayload = IListItems;

type IReference = {
  [key in IPayload["type"]]: IPayload["ref"];
};

export const referenceAtom = atom({} as IReference);

export const useReference = (payload: IPayload) => {
  const [refs, setRefs] = useAtom(referenceAtom);
  const { ref, type } = payload;

  const handleSetRef = (payload: IPayload) => {
    const { ref, type } = payload;
    if (ref && type) {
      setRefs((prev) => ({ ...prev, [type]: ref }));
    }
  };
  useEffect(() => {
    if (ref && type) {
      setRefs((prev) => ({ ...prev, [type]: ref }));
    }
  }, [ref, type]);

  return {
    ref: refs[type],
    handleSetRef,
  };
};
