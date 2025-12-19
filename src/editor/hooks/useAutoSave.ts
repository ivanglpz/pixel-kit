import { useMutation } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { toast } from "sonner";
import { GET_JSON_PROJECTS_ATOM } from "../states/projects";
import { useDelayedExecutor } from "./useDelayExecutor";
import { useReference } from "./useReference";

export const useAutoSave = () => {
  const GET_JSON = useSetAtom(GET_JSON_PROJECTS_ATOM);

  const { ref } = useReference({
    type: "STAGE_PREVIEW",
  });
  const mutation = useMutation({
    mutationKey: ["auto_save"],
    mutationFn: async () => {
      const JSON_ = GET_JSON();
      console.log(JSON_);

      // const previewUrl = ref?.current?.toDataURL({
      //   quality: 0.5,
      //   pixelRatio: 1,
      // });
      // const PAYLOAD: Pick<IProject, "_id" | "name" | "previewUrl" | "data"> = {
      //   _id: JSON_.projectId,
      //   data: JSON_.data,
      //   name: JSON_.projectName,
      //   previewUrl: previewUrl ?? JSON_?.previewUrl ?? "./placeholder.svg",
      // };
      // updateProject(PAYLOAD);
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
