import { Valid } from "@/components/valid";
import { useConfiguration } from "@/editor/hooks/useConfiguration";
import { useReference } from "@/editor/hooks/useReference";
import { SHOW_CLIP_ATOM } from "@/editor/states/clipImage";
import { calculateDimension } from "@/editor/utils/calculateDimension";
import { css } from "@stylespixelkit/css";
import { useAtom, useAtomValue } from "jotai";
import Konva from "konva";
import { Group } from "konva/lib/Group";
import { Stage } from "konva/lib/Stage";
import { File } from "lucide-react";
import Link from "next/link";
import { RefObject, useEffect, useRef, useState } from "react";
import { Stage as StageContainer } from "react-konva";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Button } from "../components/button";
import { Dialog } from "../components/dialog";
import { Input } from "../components/input";
import { constants } from "../constants/color";
import { AllLayers } from "../layers/root.layers";
import { STAGE_DIMENSION_ATOM } from "../states/dimension";
import { typeExportAtom } from "../states/export";
import { IMAGE_RENDER_ATOM } from "../states/image";
import ALL_SHAPES_ATOM from "../states/shapes";

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
  const imageRender = useAtomValue(IMAGE_RENDER_ATOM);

  const [loading, setloading] = useState(false);
  const { height, width } = useAtomValue(STAGE_DIMENSION_ATOM);
  const ALL_SHAPES = useAtomValue(ALL_SHAPES_ATOM);
  const [format, setformat] = useAtom(typeExportAtom);
  const [show, setShow] = useState(false);
  const [showClip, setshowClip] = useAtom(SHOW_CLIP_ATOM);
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
            ...calculateDimension(
              width,
              height,
              imageRender?.width,
              imageRender?.height
            ),
          });
          if (!base64String) return;

          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = imageRender.width;
          canvas.height = imageRender.height;

          const image = new Image();
          image.onload = () => {
            ctx?.drawImage(image, 0, 0, imageRender.width, imageRender.height);

            downloadBase64Image(canvas.toDataURL("image/png", 1));
            setloading(false);
          };

          image.src = base64String;
        }, 100);
      });
    }
  };

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
      <Dialog.Provider visible={show} onClose={() => setShow(false)}>
        <Dialog.Container>
          <Dialog.Header>
            <p
              className={css({
                fontWeight: "bold",
              })}
            >
              Export
            </p>
            <Dialog.Close onClose={() => setShow(false)} />
          </Dialog.Header>
          <Input.Label text="Format" />
          <Input.Container>
            <Input.Select
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
          </Input.Container>
          <Valid isValid={config?.export_mode === "EDIT_IMAGE"}>
            <Input.Label text="Dimensions" />
            <div
              className={css({
                display: "grid",
                gridTemplateColumns: "2",
                gap: "md",
              })}
            >
              <Input.Container>
                <Input.Grid>
                  <Input.IconContainer>
                    <p
                      className={css({
                        fontWeight: 600,
                        fontSize: "x-small",
                      })}
                    >
                      W
                    </p>
                  </Input.IconContainer>
                  <Input.Number
                    step={1}
                    min={0}
                    value={Number(imageRender.width) || 0}
                    onChange={(v) => {}}
                  />
                </Input.Grid>
              </Input.Container>
              <Input.Container>
                <Input.Grid>
                  <Input.IconContainer>
                    <p
                      className={css({
                        fontWeight: 600,
                        fontSize: "x-small",
                      })}
                    >
                      H
                    </p>
                  </Input.IconContainer>
                  <Input.Number
                    step={1}
                    min={0}
                    value={Number(imageRender.height) || 0}
                    onChange={(v) => {}}
                  />
                </Input.Grid>
              </Input.Container>
            </div>
          </Valid>
          <footer
            className={css({
              display: "flex",
              flexDirection: "row",
              gap: "lg",
              justifyContent: "end",
            })}
          >
            <Button.Secondary onClick={() => setShow(false)}>
              Cancel
            </Button.Secondary>
            <Button.Primary onClick={() => handleExport()}>
              <File size={constants.icon.size} />
              Export
            </Button.Primary>
          </footer>
        </Dialog.Container>
      </Dialog.Provider>

      <p
        className={css({
          paddingBottom: "md",
          paddingTop: "sm",
          fontWeight: "bold",
          fontSize: "sm",
        })}
      >
        Export
      </p>
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
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "2",
          gap: "md",
        })}
      >
        <Button.Secondary onClick={() => setShow(false)}>
          Change
        </Button.Secondary>
        <Button.Primary onClick={() => setShow(true)}>
          <File size={constants.icon.size} />
          Export
        </Button.Primary>
        {/* <Valid isValid={config?.show_files_browser}>
          <ImageConfiguration />
        </Valid> */}
        {/* <Valid isValid={!config?.show_files_browser}>
          <div></div>
        </Valid> */}
        {/* <button
          className={css({
            padding: "md",
            borderColor: "green.light.200",
            borderWidth: 1,
            borderRadius: "md",
            backgroundColor: "green.dark.600",
            py: "5",
            px: "10",
            height: "35px",
            width: "100%",
          })}
          onClick={() => setShow(true)}
        >
          <p
            className={css({
              fontSize: "sm",
              color: "black",
              fontWeight: "600",
            })}
          >
            Export
          </p>
        </button> */}
      </div>
    </>
  );
};
