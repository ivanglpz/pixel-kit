import { IProject } from "@/db/schemas/types";
import { updateProject } from "@/services/projects";
import { useMutation } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { toast } from "sonner";
import { GET_EXPORT_ALLSHAPES_ATOM } from "../states/mode";
import { GET_JSON_PROJECTS_ATOM } from "../states/projects";
import { useDelayedExecutor } from "./useDelayExecutor";

export const useAutoSave = () => {
  const GET_JSON = useSetAtom(GET_JSON_PROJECTS_ATOM);
  const GET_PREVIEW = useSetAtom(GET_EXPORT_ALLSHAPES_ATOM);

  const mutation = useMutation({
    mutationFn: async () => {
      const JSON_ = GET_JSON();
      const PREVIEW = await GET_PREVIEW();
      console.log(PREVIEW);

      const PAYLOAD: Pick<IProject, "_id" | "name" | "previewUrl" | "data"> = {
        _id: JSON_.projectId,
        data: JSON_.data,
        name: JSON_.projectName,
        previewUrl: PREVIEW ?? "./placeholder.svg",
      };
      updateProject(PAYLOAD);
    },
    onSuccess: () => {
      toast.success("Project auto-saved");
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
