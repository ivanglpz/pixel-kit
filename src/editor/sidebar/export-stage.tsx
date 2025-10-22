import { useConfiguration } from "@/editor/hooks/useConfiguration";
import { css } from "@stylespixelkit/css";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { Layer, Stage as StageContainer } from "react-konva";
import { stagePreview } from "../constants/stage-preview";
import { useReference } from "../hooks/useReference";
import { useStagePreview } from "../hooks/useStagePreview";
import { Shapes } from "../shapes/shapes";
import ALL_SHAPES_ATOM from "../states/shapes";

export const ExportStage = () => {
  const ALL_SHAPES = useAtomValue(ALL_SHAPES_ATOM);
  const { config } = useConfiguration();

  const { stageRef } = useStagePreview({
    type: "STAGE",
  });
  const { handleSetRef } = useReference({
    type: "STAGE_PREVIEW",
    ref: stageRef,
  });

  useEffect(() => {
    if (stageRef?.current) {
      handleSetRef({
        type: "STAGE_PREVIEW",
        ref: stageRef,
      });
    }
  }, [stageRef, config.expand_stage]);
  return (
    <>
      <p
        className={css({
          paddingBottom: "md",
          paddingTop: "sm",
          fontWeight: "bold",
          fontSize: "sm",
        })}
      >
        Stage
      </p>
      <StageContainer
        id="preview-stage"
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
          {ALL_SHAPES.map((e, index) => {
            const Component = Shapes?.[e.tool];
            return (
              <Component
                key={`pixel-kit-stage-preview-${e.id}-${index}`}
                shape={e}
              />
            );
          })}
        </Layer>
      </StageContainer>
    </>
  );
};
