import { IProject } from "@/db/schemas/types";
import { uploadPhotoPreview } from "@/services/photo";
import { updateProject } from "@/services/projects";
import { base64ToFile } from "@/utils/base64toFile";
import { optimizeImageFile } from "@/utils/opt-img";
import { useMutation } from "@tanstack/react-query";
import { useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";
import { toast } from "sonner";
import { GENERATE_PREVIEW_ATOM } from "../states/export";
import { GET_JSON_PROJECTS_ATOM } from "../states/projects";
import { TIMER_ATOM } from "../states/timer";

export function useTimerAutoSave() {
  const [timer, setTimer] = useAtom(TIMER_ATOM);

  const GET_JSON = useSetAtom(GET_JSON_PROJECTS_ATOM);
  const GET_PREVIEW = useSetAtom(GENERATE_PREVIEW_ATOM);

  const mutation = useMutation({
    mutationFn: async () => {
      const JSON_ = GET_JSON();
      const PREVIEW = await GET_PREVIEW();
      const formData = new FormData();
      formData.append(
        "image",
        await optimizeImageFile({
          file: base64ToFile(PREVIEW, "preview.png"),
          quality: 25,
        }),
      );
      formData.append("projectId", `${JSON_.projectId}`);

      const response = await uploadPhotoPreview(formData);

      const PAYLOAD: Pick<IProject, "_id" | "name" | "previewUrl" | "data"> = {
        _id: JSON_.projectId,
        data: JSON_.data,
        name: JSON_.projectName,
        previewUrl: response?.url ?? "./default_bg.png",
      };
      updateProject(PAYLOAD);
    },
    onSuccess: () => {
      toast.success("Project auto-saved");
    },
    onError: (err) => console.error("Error saving canvas:", err),
  });

  useEffect(() => {
    if (!timer.IS_RUNNING) return;

    if (timer.REMAINING_MS <= 0) {
      setTimer({
        REMAINING_MS: 0,
        IS_RUNNING: false,
      });
      mutation.mutate();
      return;
    }

    const id = setTimeout(() => {
      setTimer((prev) => ({
        ...prev,
        REMAINING_MS: prev.REMAINING_MS - 1000,
      }));
    }, 1000);

    return () => clearTimeout(id);
  }, [timer.IS_RUNNING, timer.REMAINING_MS, setTimer]);
}
