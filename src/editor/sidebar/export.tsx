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
import { FCShapeWEvents, IShape } from "../shapes/type.shape";
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

const stageWidth = 210;
const stageHeight = 210;

function downloadBase64Image(base64: string) {
  const link = document.createElement("a");
  link.download = `pixel-kit-edition-${uuidv4().slice(0, 4)}.jpg`;
  link.href = base64;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function computeStageTransform(shape: IShape | null) {
  const contentWidth = Number(shape?.width) || 0;
  const contentHeight = Number(shape?.height) || 0;
  if (!contentWidth || !contentHeight)
    return { scale: 1, offsetX: 0, offsetY: 0 };

  const scale = Math.min(
    stageWidth / contentWidth,
    stageHeight / contentHeight
  );
  const offsetX = (stageWidth - contentWidth * scale) / 2;
  const offsetY = (stageHeight - contentHeight * scale) / 2;

  return {
    scale,
    offsetX,
    offsetY,
    width: contentWidth * scale,
    height: contentHeight * scale,
  };
}

export const ExportStage = () => {
  const { config } = useConfiguration();
  const shape = useAtomValue(SHAPE_SELECTED_ATOM);
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useAtom(typeExportAtom);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);

  const stageRef = useRef<Konva.Stage>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const setImage = useSetAtom(SET_EDIT_IMAGE);

  const handleFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () =>
          typeof reader.result === "string"
            ? resolve(reader.result)
            : reject(new Error("Invalid file"));
        reader.onerror = () => reject(new Error("Error reading file"));
        reader.readAsDataURL(file);
      });

      const { width, height } = await new Promise<{
        width: number;
        height: number;
      }>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = () => reject(new Error("Error loading image"));
        img.src = base64;
      });

      setImage({ base64, name: file.name, width, height, x: 0, y: 0 });
      setShowImageDialog(false);
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleExport = () => {
    toast.success("Thank you very much for using pixel kit!", {
      description: (
        <p>
          Your edition is exporting. You can follow me on{" "}
          <Link
            href="https://twitter.com/ivanglpz"
            target="_blank"
            className={css({ textDecoration: "underline" })}
          >
            Twitter(X)
          </Link>
        </p>
      ),
    });

    setLoading(true);

    const { offsetX, offsetY, width, height } = computeStageTransform(shape);
    const image = stageRef.current?.toDataURL({
      quality: 1,
      pixelRatio: formats[format as keyof typeof formats],
      x: offsetX,
      y: offsetY,
      width,
      height,
    });

    if (image) downloadBase64Image(image);
    setLoading(false);
  };

  useEffect(() => {
    if (!stageRef.current || !shape) return;
    const stage = stageRef.current;
    const { scale, offsetX, offsetY } = computeStageTransform(shape);

    stage.width(stageWidth);
    stage.height(stageHeight);
    stage.scale({ x: scale, y: scale });
    stage.position({ x: offsetX, y: offsetY });
    stage.batchDraw();
  }, [config.export_mode, shape]);

  return (
    <>
      {/* Export Dialog */}
      <Dialog.Provider
        visible={showExportDialog}
        onClose={() => setShowExportDialog(false)}
      >
        <Dialog.Container>
          <Dialog.Header>
            <p className={css({ fontWeight: "bold" })}>Export</p>
            <Dialog.Close onClose={() => setShowExportDialog(false)} />
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
                options={Object.keys(formats).map((key, i) => ({
                  id: String(i),
                  label: key.replace("_", " "),
                  value: key,
                }))}
                onChange={setFormat}
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
            <Button.Secondary onClick={() => setShowExportDialog(false)}>
              Cancel
            </Button.Secondary>
            <Button.Primary onClick={handleExport}>
              {loading ? (
                <Loading color={constants.theme.colors.black} />
              ) : (
                <>
                  <File size={constants.icon.size} /> Export
                </>
              )}
            </Button.Primary>
          </footer>
        </Dialog.Container>
      </Dialog.Provider>

      {/* Image Dialog */}
      <Dialog.Provider
        visible={showImageDialog}
        onClose={() => setShowImageDialog(false)}
      >
        <Dialog.Container>
          <Dialog.Header>
            <p className={css({ fontWeight: "bold" })}>Image</p>
            <Dialog.Close onClose={() => setShowImageDialog(false)} />
          </Dialog.Header>
          <p className={css({ fontSize: "sm", color: "text" })}>
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
            <Button.Secondary onClick={() => setShowImageDialog(false)}>
              Cancel
            </Button.Secondary>
            <Button.Primary onClick={() => inputRef.current?.click()}>
              <File size={constants.icon.size} /> Upload
            </Button.Primary>
          </footer>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFiles}
            className={css({ width: 0, height: 0, display: "none" })}
          />
        </Dialog.Container>
      </Dialog.Provider>

      {/* Preview */}
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
        listening={false}
        className={css({
          backgroundColor: "gray.100",
          borderColor: "border",
          borderWidth: 1,
          _dark: { backgroundColor: "gray.800" },
        })}
      >
        <Layer>
          {shape &&
            (() => {
              const Component = Shapes?.[shape.tool] as FCShapeWEvents;
              return (
                <Component
                  key={`pixel-kit-preview-${shape.id}`}
                  shape={{
                    id: "1",
                    pageId: "one",
                    state: atom({ ...shape, x: 0, y: 0 }),
                    tool: shape.tool,
                  }}
                />
              );
            })()}
        </Layer>
      </StageContainer>
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "2",
          gap: "md",
        })}
      >
        <Button.Secondary onClick={() => setShowImageDialog(true)}>
          Change
        </Button.Secondary>
        <Button.Primary onClick={() => setShowExportDialog(true)}>
          <File size={constants.icon.size} /> Export
        </Button.Primary>
      </div>
    </>
  );
};
