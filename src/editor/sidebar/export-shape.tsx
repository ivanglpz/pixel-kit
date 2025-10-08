import { useConfiguration } from "@/editor/hooks/useConfiguration";
import { css } from "@stylespixelkit/css";
import { atom, useAtom, useAtomValue } from "jotai";
import Konva from "konva";
import { File } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Layer, Stage as StageContainer } from "react-konva";
import { toast } from "sonner";
import { Button } from "../components/button";
import { Dialog } from "../components/dialog";
import { Input } from "../components/input";
import { Loading } from "../components/loading";
import { constants } from "../constants/color";
import { formats } from "../constants/formats";
import { stagePreview } from "../constants/stage-preview";
import { Shapes } from "../shapes/shapes";
import { FCShapeWEvents } from "../shapes/type.shape";
import { typeExportAtom } from "../states/export";
import { SHAPE_SELECTED_ATOM } from "../states/shape";
import { downloadBase64Image } from "../utils/downloadBase64";
import { computeStageTransform } from "../utils/stageTransform";

export const ExportShape = () => {
  const { config } = useConfiguration();
  const shape = useAtomValue(SHAPE_SELECTED_ATOM);
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useAtom(typeExportAtom);
  const [showExportDialog, setShowExportDialog] = useState(false);

  const stageRef = useRef<Konva.Stage>(null);

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

    const { offsetX, offsetY, width, height } = computeStageTransform({
      width: shape?.width || 0,
      height: shape?.height || 0,
    });
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

    stage.width(stagePreview.width);
    stage.height(stagePreview.height);
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
        id="preview-shape"
        ref={stageRef}
        width={stagePreview.width}
        height={stagePreview.height}
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
                    // pageId: "one",
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
        <Button.Primary onClick={() => setShowExportDialog(true)}>
          <File size={constants.icon.size} /> Export
        </Button.Primary>
      </div>
    </>
  );
};
