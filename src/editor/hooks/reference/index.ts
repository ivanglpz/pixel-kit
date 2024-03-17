import { atom, useAtom } from "jotai";
import Konva from "konva";
import { RefObject, useEffect } from "react";

type IKType = "STAGE";

type IGPayload<T extends IKType, R> = {
  type: T;
  ref?: RefObject<R>;
};

type IListItems = IGPayload<"STAGE", Konva.Stage>;

type IPayload = IListItems;

type IReference = {
  [key in IPayload["type"]]: IPayload["ref"];
};

export const referenceAtom = atom({} as IReference);

export const useReference = (payload: IPayload) => {
  const [refs, setRefs] = useAtom(referenceAtom);
  const { ref, type } = payload;

  useEffect(() => {
    if (refs[type]) return;

    setRefs((prev) => ({ ...prev, [type]: ref }));
  }, [refs, ref, type, setRefs]);

  return {
    ref: refs[type],
  };
};
