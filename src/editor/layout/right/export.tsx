import { Valid } from "@/components/valid";
import { Button } from "@/editor/components/button";
import { InputSelect } from "@/editor/components/input-select";
import { InputText } from "@/editor/components/input-text";
import { Section } from "@/editor/components/section";
import { useImageRender } from "@/editor/hooks/image/hook";
import { useReference } from "@/editor/hooks/reference";
import useScreen from "@/editor/hooks/screen";
import { useConfiguration } from "@/editor/hooks/useConfiguration";
import { showClipAtom } from "@/editor/jotai/clipImage";
import { calculateDimension } from "@/utils/calculateDimension";
import { css } from "@stylespixelkit/css";
import { useSetAtom } from "jotai";
import { Group } from "konva/lib/Group";
import { Stage } from "konva/lib/Stage";
import Link from "next/link";
import { RefObject, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { ImageConfiguration } from "../left/image";

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
  ref: RefObject<Stage> | RefObject<Group> | undefined,
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
  const [showExport, setShowExport] = useState(false);
  const setshowClip = useSetAtom(showClipAtom);

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
      setshowClip(false);
      destroyTransforms(ref, 1);
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
    <>
      <Valid isValid={showExport}>
        {createPortal(
          <main
            className={css({
              position: "absolute",
              top: 0,
              zIndex: 9999,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            })}
            onClick={() => setShowExport(false)}
          >
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
                justifyContent: "space-between",
                width: 320,
                minHeight: 280,
              })}
              onClick={(e) => e.stopPropagation()}
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
              <p
                className={css({
                  color: "text",
                  fontSize: "sm",
                  opacity: 0.7,
                })}
              >
                Export your edit to the quality you prefer the most.
              </p>
              <div
                className={css({
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  width: "100%",
                  height: "100%",
                  flex: 1,
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
                    disable
                  />
                </Valid>
                <Button
                  text="Export Now"
                  onClick={() => handleExport()}
                  isLoading={loading}
                ></Button>
              </div>
            </div>
          </main>,
          document.body
        )}
      </Valid>
      <Section title="Export">
        <Valid isValid={config?.showFilesBrowser}>
          <ImageConfiguration />
        </Valid>
        <Button
          text="Export"
          onClick={() => setShowExport(true)}
          type="success"
        ></Button>
      </Section>
    </>
  );
};
