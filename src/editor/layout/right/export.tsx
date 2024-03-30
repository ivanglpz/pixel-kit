import { Valid } from "@/components/valid";
import { Button } from "@/editor/components/button";
import { InputSelect } from "@/editor/components/input-select";
import { InputText } from "@/editor/components/input-text";
import { useImageRender } from "@/editor/hooks/image/hook";
import { useReference } from "@/editor/hooks/reference";
import useScreen from "@/editor/hooks/screen";
import { useConfiguration } from "@/editor/hooks/useConfiguration";
import { calculateDimension } from "@/utils/calculateDimension";
import { css } from "@stylespixelkit/css";
import { Stage } from "konva/lib/Stage";
import Link from "next/link";
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

function downloadBase64Image(base64String: string) {
  var link = document.createElement("a");
  link.download = `pixel-kit-edition-${uuidv4()?.slice(0, 4)}.jpg`;
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
    toast.success("Thank you very much for using pixel kit!", {
      description: (
        <div>
          <p>
            Your edition is exporting. If you want to know more about pixel kit
            you can follow me on{" "}
            <Link
              href={"https://twitter.com/ivanglpz"}
              target="_blank"
              className={css({
                textDecoration: "underline",
              })}
            >
              Twitter(X)
            </Link>
          </p>
        </div>
      ),
    });

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
          downloadBase64Image(image);
          setloading(false);
        }, 100);
      });
    }
    if (config.exportMode === "ONLY_IMAGE") {
      destroyTransforms(ref, 2);
      await new Promise(() => {
        setTimeout(() => {
          const base64String = ref?.current?.toDataURL({
            quality: 1,
            pixelRatio: formats[format as keyof typeof formats],
            ...calculateDimension(width, height, img?.width, img?.height),
          });
          if (!base64String) return;

          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;

          const image = new Image();
          image.onload = () => {
            ctx?.drawImage(image, 0, 0, img.width, img.height);

            downloadBase64Image(canvas.toDataURL("image/png", 1));
            setloading(false);
          };

          image.src = base64String;
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
          gap: "md",
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
        <Valid isValid={config?.exportMode === "ONLY_IMAGE"}>
          <InputText
            labelText="Resolution"
            value={`${img.width}x${img?.height}`}
            onChange={() => {}}
          />
        </Valid>
      </div>
      <Button text="Export" onClick={handleExport} isLoading={loading}></Button>
    </div>
  );
};
