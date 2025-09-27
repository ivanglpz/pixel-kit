import { IProject } from "@/db/schemas/types";
import { updateProject } from "@/services/projects";
import { useMutation } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { JSON_PROJECTS_ATOM } from "../states/projects";
import { UPDATE_TAB_ATOM } from "../states/tabs";
import { useDelayedExecutor } from "./useDelayExecutor";

export const useAutoSave = () => {
  const GET_JSON = useSetAtom(JSON_PROJECTS_ATOM);
  const SET_TAB_PROJECT = useSetAtom(UPDATE_TAB_ATOM);
  const mutation = useMutation({
    mutationKey: ["auto_save"],
    mutationFn: async () => {
      const JSON_ = GET_JSON();

      const PAYLOAD: Pick<IProject, "_id" | "name" | "data"> = {
        _id: JSON_.projectId,
        data: JSON_.data,
        name: "kepedo",
      };
      updateProject(PAYLOAD);
      return PAYLOAD;
    },
    onSuccess: (data) => {
      SET_TAB_PROJECT(data);
    },
    onError: (err) => console.error("Error saving canvas:", err),
  });
  const debounce = useDelayedExecutor({
    callback: () => {
      mutation.mutate();
    },
    timer: 1000, // opcional
  });
  return {
    debounce,
  };
};
