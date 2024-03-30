import { Button } from "@/editor/components/button";
import { InputSelect } from "@/editor/components/input-select";
import { useImageRender } from "@/editor/hooks/image/hook";
import { useReference } from "@/editor/hooks/reference";
import useScreen from "@/editor/hooks/screen";
import { useConfiguration } from "@/editor/hooks/useConfiguration";
import { calculateDimension } from "@/utils/calculateDimension";
import { css } from "@stylespixelkit/css";
import { Stage } from "konva/lib/Stage";
import { RefObject, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const formats = {
  LOW: 0.8,
  MEDIUM: 1,
  HIGH: 1.8,
  BIG_HIGH: 2.6,
  ULTRA_HIGH: 3.5,
};

function downloadBase64Image(base64String: string, filename: string) {
  var link = document.createElement("a");
  link.download = filename;
  link.href = base64String;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const destroyTransforms = (
  ref: RefObject<Stage> | undefined,
  position: 1 | 2
) => {
  const childrenToDestroy = ref?.current
    ?.getStage?.()
    ?.children?.[
      position
    ].children.filter?.((child) => child.attrs.id === "transformer-editable");
  childrenToDestroy?.forEach?.((child) => {
    child?.destroy?.();
  });
};

export const ExportStage = () => {
  const { ref } = useReference({ type: "STAGE" });
  const { config } = useConfiguration();
  const { img } = useImageRender();
  const [loading, setloading] = useState(false);
  const { height, width } = useScreen();
  const [format, setformat] = useState("HIGH");

  const handleExport = async () => {
    toast.info("Your image is exporting...");
    setloading(true);
    if (config.exportMode === "FULL_SCREEN") {
      destroyTransforms(ref, 1);
      await new Promise(() => {
        setTimeout(() => {
          const image = ref?.current?.toDataURL({
            quality: 1,
            pixelRatio: formats[format as keyof typeof formats],
          });
          if (!image) return;
          downloadBase64Image(
            image,
            `pixel-kit-edition-${uuidv4()?.slice(0, 4)}.jpg`
          );
          setloading(false);
        }, 100);
      });
    }
    if (config.exportMode === "ONLY_IMAGE") {
      destroyTransforms(ref, 2);
      await new Promise(() => {
        setTimeout(() => {
          const image = ref?.current?.toDataURL({
            quality: 1,
            pixelRatio: formats[format as keyof typeof formats],
            ...calculateDimension(width, height, img?.width, img?.height),
          });
          if (!image) return;
          downloadBase64Image(
            image,
            `pixel-kit-edition-${uuidv4()?.slice(0, 4)}.jpg`
          );
          setloading(false);
        }, 100);
      });
    }
  };
  return (
    <div
      className={css({
        padding: "lg",
        display: "flex",
        flexDirection: "column",
        gap: "lg",
        backgroundColor: "primary",
        borderRadius: "lg",
        border: "container",
        alignItems: "flex-start",
        justifyContent: "center",
      })}
    >
      <p
        className={css({
          fontSize: "sm",
          color: "text",
          fontWeight: "bold",
        })}
      >
        Export
      </p>
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          width: "100%",
        })}
      >
        <InputSelect
          labelText="Format Quality"
          options={[
            {
              id: "1",
              label: "Low",
              value: "LOW",
            },
            {
              id: "2",
              label: "Medium",
              value: "MEDIUM",
            },
            {
              id: "3",
              label: "High",
              value: "HIGH",
            },
            {
              id: "4",
              label: "Big High",
              value: "BIG_HIGH",
            },
            {
              id: "4",
              label: "Ultra High",
              value: "ULTRA_HIGH",
            },
          ]}
          onChange={(e) => setformat(e)}
          value={format}
        />
      </div>
      <Button text="Export" onClick={handleExport} isLoading={loading}></Button>
    </div>
  );
};
