import { Valid } from "@/components/valid";
import { Button } from "@/editor/components/button";
import { InputSelect } from "@/editor/components/input-select";
import { InputText } from "@/editor/components/input-text";
import { useConfiguration } from "@/editor/hooks/useConfiguration";
import { useImageRender } from "@/editor/hooks/useImageRender";
import { useReference } from "@/editor/hooks/useReference";
import { showClipAtom } from "@/editor/states/clipImage";
import { calculateDimension } from "@/editor/utils/calculateDimension";
import { css } from "@stylespixelkit/css";
import { useAtom, useAtomValue } from "jotai";
import Konva from "konva";
import { Group } from "konva/lib/Group";
import { Stage } from "konva/lib/Stage";
import Link from "next/link";
import { RefObject, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Stage as StageContainer } from "react-konva";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { AllLayers } from "../layers/root.layers";
import { STAGE_DIMENSION_ATOM } from "../states/dimension";
import { typeExportAtom } from "../states/export";
import ALL_SHAPES_ATOM from "../states/shapes";
import { ImageConfiguration } from "./imageConfig";

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

const getBoundingBox = (
  ref: RefObject<Stage> | RefObject<Group> | undefined,
  props: {
    pixelRatio?: number;
    mimeType?: string;
    quality?: number;
  }
) => {
  const childrens = ref?.current?.getStage?.()?.children;
  if (!childrens) return;
  const layerShapes = childrens?.find((e) => e?.attrs?.id === "layer-shapes");
  if (!layerShapes) return;

  layerShapes?.children
    ?.filter?.((child) => child?.attrs?.id === "transformer-editable")
    ?.forEach?.((child) => {
      child?.destroy?.();
    });
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  layerShapes.scale({ x: 1, y: 1 });
  layerShapes.position({ x: 0, y: 0 });

  ref?.current.scale({ x: 1, y: 1 });
  ref?.current.position({ x: 0, y: 0 });

  layerShapes?.children.forEach((node) => {
    const box = node.getClientRect({ relativeTo: layerShapes });
    minX = Math.min(minX, box.x);
    minY = Math.min(minY, box.y);
    maxX = Math.max(maxX, box.x + box.width);
    maxY = Math.max(maxY, box.y + box.height);
  });
  return layerShapes?.toDataURL({
    ...props,
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  });
};

const destroyTransforms = (
  ref: RefObject<Stage> | RefObject<Group> | undefined
) => {
  const childrens = ref?.current?.getStage?.()?.children;
  if (!childrens) return;
  const layerShapes = childrens?.find((e) => e?.attrs?.id === "layer-shapes");
  if (!layerShapes) return;

  layerShapes?.children
    ?.filter?.((child) => child?.attrs?.id === "transformer-editable")
    ?.forEach?.((child) => {
      child?.destroy?.();
    });
};

export const ExportStage = () => {
  const { ref } = useReference({ type: "STAGE" });
  const { config } = useConfiguration();
  const { img } = useImageRender();
  const [loading, setloading] = useState(false);
  const { height, width } = useAtomValue(STAGE_DIMENSION_ATOM);
  const ALL_SHAPES = useAtomValue(ALL_SHAPES_ATOM);
  const [format, setformat] = useAtom(typeExportAtom);
  const [showExport, setShowExport] = useState(false);
  const [showClip, setshowClip] = useAtom(showClipAtom);
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
    if (config?.export_mode === "DESIGN_MODE") {
      destroyTransforms(ref);
      const image = getBoundingBox(ref, {
        quality: 1,
        pixelRatio: formats[format as keyof typeof formats],
      });

      await new Promise(() => {
        setTimeout(() => {
          // const image = ref?.current?.toDataURL({
          //   quality: 1,
          //   pixelRatio: formats[format as keyof typeof formats],
          //   width,
          //   height,
          //   ...dimension,
          // });
          if (!image) return;
          downloadBase64Image(image);
          setloading(false);
        }, 100);
      });
    }
    if (config?.export_mode === "FREE_DRAW") {
      destroyTransforms(ref);
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
    if (config?.export_mode === "EDIT_IMAGE") {
      setshowClip(false);
      destroyTransforms(ref);
      // destroyTransforms(ref, 2);
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

  const Container = document.getElementById("pixel-app");

  const stageWidth = 210;
  const stageHeight = 210;
  const stageRef = useRef<Konva.Stage>(null);

  useEffect(() => {
    if (!stageRef.current) return;
    const stage = stageRef.current;
    const childrens = stage?.children;
    if (!childrens) return;

    // Usar las dimensiones estáticas del stage (o las de config)
    const contentWidth = width;
    const contentHeight = height;

    // 1. Escalar proporcionalmente para que encaje en 210x210
    const scale = Math.min(
      stageWidth / contentWidth,
      stageHeight / contentHeight
    );

    stage.width(stageWidth);
    stage.height(stageHeight);
    stage.scale({ x: scale, y: scale });

    // 2. Centrarlo simplemente (sin minX/minY)
    const offsetX = (stageWidth - contentWidth * scale) / 2;
    const offsetY = (stageHeight - contentHeight * scale) / 2;

    stage.position({ x: offsetX, y: offsetY });
    stage.batchDraw();
  }, [width, height, config.export_mode, showClip, ALL_SHAPES]);

  return (
    <>
      <Valid isValid={showExport}>
        {Container
          ? createPortal(
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
                    backgroundColor: "primary",
                    borderRadius: "lg",
                    border: "container",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    width: 300,
                    // minHeight: 320,
                    gap: "lg",
                  })}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className={css({
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      alignItems: "center",
                    })}
                  >
                    <p
                      className={css({
                        fontSize: "md",
                        color: "text",
                        fontWeight: "bold",
                      })}
                    >
                      Export
                    </p>
                    <button
                      className={css({
                        padding: "sm",
                        cursor: "pointer",
                      })}
                      onClick={() => setShowExport(false)}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z"
                          fill="white"
                        />
                      </svg>
                    </button>
                  </div>

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
                      width: "100%",
                      height: "100%",
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
                    <Valid isValid={config?.export_mode === "EDIT_IMAGE"}>
                      <InputText
                        labelText="Resolution"
                        value={`${img.width}x${img?.height}`}
                        onChange={() => {}}
                        disable
                      />
                    </Valid>
                  </div>
                  <Button
                    text="Export Now"
                    onClick={() => handleExport()}
                    isLoading={loading}
                    fullWidth={false}
                  ></Button>
                </div>
              </main>,
              Container
            )
          : null}
      </Valid>
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "2",
          gap: "md",
        })}
      >
        <Valid isValid={config?.show_files_browser}>
          <ImageConfiguration />
        </Valid>
        <Button
          text="Export"
          onClick={() => setShowExport(true)}
          type="success"
        ></Button>
      </div>
      <StageContainer
        id="preview-stage"
        ref={stageRef}
        width={stageWidth}
        height={stageHeight}
        listening={false} //
        className={css({
          backgroundColor: "gray.100",
          borderColor: "border",
          borderWidth: 1,
          _dark: {
            backgroundColor: "gray.800",
          },
        })}
      >
        <AllLayers />
      </StageContainer>
    </>
  );
};
