import { IProject } from "@/db/schemas/types";
import { updateProject } from "@/services/projects";
import { useMutation } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { toast } from "sonner";
import { JSON_PROJECTS_ATOM } from "../states/projects";
import { UPDATE_TAB_ATOM } from "../states/tabs";
import { useDelayedExecutor } from "./useDelayExecutor";
import { useReference } from "./useReference";

export const useAutoSave = () => {
  const GET_JSON = useSetAtom(JSON_PROJECTS_ATOM);
  const SET_TAB_PROJECT = useSetAtom(UPDATE_TAB_ATOM);

  const { ref } = useReference({
    type: "STAGE_PREVIEW",
  });
  const mutation = useMutation({
    mutationKey: ["auto_save"],
    mutationFn: async () => {
      const JSON_ = GET_JSON();
      const previewUrl = ref?.current?.toDataURL({
        quality: 0.5,
        pixelRatio: 1,
      });

      const PAYLOAD: Pick<IProject, "_id" | "name" | "previewUrl"> = {
        _id: JSON_.projectId,
        // data: JSON_.data,
        name: JSON_.projectName,
        previewUrl: previewUrl ?? JSON_?.previewUrl ?? "./placeholder.svg",
      };
      updateProject({ ...PAYLOAD, data: JSON_.data });
      return PAYLOAD;
    },
    onSuccess: (data) => {
      toast.success("Project auto-saved");
      SET_TAB_PROJECT(data);
    },
    onError: (err) => console.error("Error saving canvas:", err),
  });
  const debounce = useDelayedExecutor({
    callback: () => {
      mutation.mutate();
    },
    timer: 2000, // opcional
  });
  return {
    debounce,
  };
};
