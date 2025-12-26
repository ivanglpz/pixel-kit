import { IProject } from "@/db/schemas/types";
import { uploadPhotoPreview } from "@/services/photo";
import { updateProject } from "@/services/projects";
import { useMutation } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { toast } from "sonner";
import { GET_EXPORT_ALLSHAPES_ATOM } from "../states/mode";
import { GET_JSON_PROJECTS_ATOM } from "../states/projects";
import { useDelayedExecutor } from "./useDelayExecutor";

function base64ToFile(base64: string, fileName: string): File {
  const [header, data] = base64.split(",");
  const mimeMatch = header.match(/:(.*?);/);
  const mimeType = mimeMatch ? mimeMatch[1] : "image/png";

  const binary = atob(data);
  const array = Uint8Array.from(binary, (c) => c.charCodeAt(0));

  return new File([array], fileName, { type: mimeType });
}

export const useAutoSave = () => {
  const GET_JSON = useSetAtom(GET_JSON_PROJECTS_ATOM);
  const GET_PREVIEW = useSetAtom(GET_EXPORT_ALLSHAPES_ATOM);

  const mutation = useMutation({
    mutationFn: async () => {
      const JSON_ = GET_JSON();
      const PREVIEW = await GET_PREVIEW();
      const formData = new FormData();
      formData.append("image", base64ToFile(PREVIEW, "preview.png")); // usar el mismo nombre 'images'
      formData.append("projectId", `${JSON_.projectId}`); // usar el mismo nombre 'images'

      const response = await uploadPhotoPreview(formData);

      const PAYLOAD: Pick<IProject, "_id" | "name" | "previewUrl" | "data"> = {
        _id: JSON_.projectId,
        data: JSON_.data,
        name: JSON_.projectName,
        previewUrl: response?.url ?? "./placeholder.svg",
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
    timer: 5000, // opcional
  });
  return {
    debounce,
  };
};
