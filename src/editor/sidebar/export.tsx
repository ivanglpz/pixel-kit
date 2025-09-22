import { useConfiguration } from "@/editor/hooks/useConfiguration";
import { css } from "@stylespixelkit/css";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import Konva from "konva";
import { File } from "lucide-react";
import Link from "next/link";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Layer, Stage as StageContainer } from "react-konva";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Button } from "../components/button";
import { Dialog } from "../components/dialog";
import { Input } from "../components/input";
import { Loading } from "../components/loading";
import { constants } from "../constants/color";
import { Shapes } from "../shapes/shapes";
import { FCShapeWEvents } from "../shapes/type.shape";
import { typeExportAtom } from "../states/export";
import { SET_EDIT_IMAGE } from "../states/image";
import { SHAPE_SELECTED_ATOM } from "../states/shape";

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

const stageWidth = 210;
const stageHeight = 210;

export const ExportStage = () => {
  const { config } = useConfiguration();
  const shape = useAtomValue(SHAPE_SELECTED_ATOM);
  const [loading, setloading] = useState(false);
  const [format, setformat] = useAtom(typeExportAtom);
  const [show, setShow] = useState(false);
  const [showImage, setShowImage] = useState(false);

  const stageRef = useRef<Konva.Stage>(null);

  const setImage = useSetAtom(SET_EDIT_IMAGE);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Convertir archivo a base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            reject(new Error("FileReader result is not a string"));
          }
        };
        reader.onerror = () => reject(new Error("Error reading file"));
        reader.readAsDataURL(file);
      });

      // Crear objeto Image para obtener dimensiones
      const { width, height } = await new Promise<{
        width: number;
        height: number;
      }>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = () => reject(new Error("Error loading image"));
        img.src = base64;
      });

      // Setear en jotai
      setImage({
        base64,
        name: file.name,
        width,
        height,
        x: 0,
        y: 0,
      });
      setShowImage(false);
    } catch (error) {
      console.error("Error loading image:", error);
    } finally {
      // Resetear input
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

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
    // Usar las dimensiones estáticas del stage (o las de config)
    const contentWidth = Number(shape?.width) || 0;
    const contentHeight = Number(shape?.height) || 0;

    // 1. Escalar proporcionalmente para que encaje en 210x210
    const scale = Math.min(
      stageWidth / contentWidth,
      stageHeight / contentHeight
    );

    // 2. Centrarlo simplemente (sin minX/minY)
    const offsetX = (stageWidth - contentWidth * scale) / 2;
    const offsetY = (stageHeight - contentHeight * scale) / 2;
    const width = contentWidth * scale;
    const height = contentHeight * scale;
    const image = stageRef?.current?.toDataURL({
      quality: 1,
      pixelRatio: formats[format as keyof typeof formats],
      x: offsetX,
      y: offsetY,
      width,
      height,
      // ...dimension,
    });
    if (!image) return;
    downloadBase64Image(image);
    setloading(false);
  };

  useEffect(() => {
    if (!stageRef.current) return;
    const stage = stageRef.current;
    const childrens = stage?.children;
    if (!childrens) return;

    // Usar las dimensiones estáticas del stage (o las de config)
    const contentWidth = Number(shape?.width) || 0;
    const contentHeight = Number(shape?.height) || 0;

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
  }, [config.export_mode, shape, stageRef]);

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
          <section
            className={css({
              display: "flex",
              flexDirection: "column",
              gap: "md",
            })}
          >
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
          </section>

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
              {loading ? (
                <Loading color={constants.theme.colors.black} />
              ) : (
                <>
                  <File size={constants.icon.size} />
                  Export
                </>
              )}
            </Button.Primary>
          </footer>
        </Dialog.Container>
      </Dialog.Provider>
      <Dialog.Provider visible={showImage} onClose={() => setShowImage(false)}>
        <Dialog.Container>
          <Dialog.Header>
            <p
              className={css({
                fontWeight: "bold",
              })}
            >
              Image
            </p>
            <Dialog.Close onClose={() => setShowImage(false)} />
          </Dialog.Header>
          <p
            className={css({
              fontSize: "sm",
              color: "text",
              fontWeight: "normal",
            })}
          >
            Please upload an image here to edit it.
          </p>

          <footer
            className={css({
              display: "flex",
              flexDirection: "row",
              gap: "lg",
              justifyContent: "end",
            })}
          >
            <Button.Secondary onClick={() => setShowImage(false)}>
              Cancel
            </Button.Secondary>
            <Button.Primary onClick={() => inputRef.current?.click()}>
              <File size={constants.icon.size} />
              Upload
            </Button.Primary>
          </footer>
          <input
            ref={inputRef}
            type="file"
            color="white"
            accept="image/*"
            onChange={handleFiles}
            className={css({
              width: 0,
              height: 0,
              display: "none",
            })}
          />
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
        <Layer>
          {[shape]?.map((item) => {
            if (!item) return null;
            const Component = Shapes?.[item?.tool] as FCShapeWEvents;
            return (
              <Component
                shape={{
                  id: "1",
                  pageId: "one",
                  state: atom({
                    ...item,
                    x: 0,
                    y: 0,
                  }),
                  tool: item?.tool,
                }}
                key={`pixel-kit-preview-${item?.id}`}
              />
            );
          })}
        </Layer>
      </StageContainer>
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "2",
          gap: "md",
        })}
      >
        <Button.Secondary onClick={() => setShowImage(true)}>
          Change
        </Button.Secondary>
        <Button.Primary onClick={() => setShow(true)}>
          <File size={constants.icon.size} />
          Export
        </Button.Primary>
      </div>
    </>
  );
};
