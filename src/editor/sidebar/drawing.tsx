import { css } from "@stylespixelkit/css";
import { useAtomValue } from "jotai";
import { Blend, Square, SquareDashed } from "lucide-react";
import { Input } from "../components/input";
import { constants } from "../constants/color";
import { DRAW_START_CONFIG_ATOM } from "../states/drawing";
import TOOL_ATOM from "../states/tool";
import {
  commonStyles,
  SectionHeader,
  ShapeAtomButtonStroke,
  ShapeInputColor,
} from "./sidebar-right-shape";

export const Drawing = () => {
  const tool = useAtomValue(TOOL_ATOM);

  const shape = useAtomValue(DRAW_START_CONFIG_ATOM);

  if (!["DRAW", "LINE"].includes(tool)) return null;

  return (
    <div
      className={`${css({
        display: "flex",
        flexDirection: "column",
        gap: "lg",
      })} `}
    >
      <SectionHeader title="Stroke"></SectionHeader>

      <section className={commonStyles.container}>
        <ShapeInputColor
          shape={shape}
          type="strokeColor"
          isGlobalUpdate={false}
        />
        <div className={commonStyles.twoColumnGrid}>
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
              <Input.withPause>
                <Input.withChange
                  shape={shape}
                  type="strokeWidth"
                  isGlobalUpdate={false}
                >
                  <Input.Number
                    min={0}
                    max={9999}
                    step={["DRAW", "ICON"].includes(shape.tool) ? 0.1 : 1}
                  />
                </Input.withChange>
              </Input.withPause>
            </Input.Grid>
          </Input.Container>
          <div
            className={css({
              alignItems: "flex-end",
              display: "grid",
              gridTemplateColumns: "3",
            })}
          >
            <ShapeAtomButtonStroke
              values={["round", "round"]}
              shape={shape}
              type="brush"
            />
            <ShapeAtomButtonStroke
              values={["miter", "round"]}
              shape={shape}
              type="penTool"
            />
            <ShapeAtomButtonStroke
              values={["miter", "butt"]}
              shape={shape}
              type="ruler"
            />
          </div>
        </div>
        {["FRAME", "IMAGE", "DRAW"].includes(shape.tool) ? (
          <Input.Container>
            <Input.Grid>
              <Input.IconContainer>
                <SquareDashed size={constants.icon.size} />
              </Input.IconContainer>
              <Input.withPause>
                <Input.withChange
                  shape={shape}
                  type="dash"
                  isGlobalUpdate={false}
                >
                  <Input.Number min={0} step={1} />
                </Input.withChange>
              </Input.withPause>
            </Input.Grid>
          </Input.Container>
        ) : null}
      </section>

      <SectionHeader title="Shadow"></SectionHeader>

      <section className={commonStyles.container}>
        <ShapeInputColor shape={shape} type="shadowColor" />
        <div
          className={css({
            display: "grid",
            flexDirection: "column",
            gap: "md",
            gridTemplateColumns: "2",
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
                  X
                </p>
              </Input.IconContainer>
              <Input.withPause>
                <Input.withChange
                  shape={shape}
                  type="shadowOffsetX"
                  isGlobalUpdate={false}
                >
                  <Input.Number step={1} />
                </Input.withChange>
              </Input.withPause>
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
                  Y
                </p>
              </Input.IconContainer>
              <Input.withPause key={"test"}>
                <Input.withChange
                  shape={shape}
                  type="shadowOffsetY"
                  isGlobalUpdate={false}
                >
                  <Input.Number step={1} />
                </Input.withChange>
              </Input.withPause>
            </Input.Grid>
          </Input.Container>
          <Input.Container>
            <Input.Grid>
              <Input.IconContainer>
                <Square
                  size={constants.icon.size}
                  strokeWidth={constants.icon.strokeWidth}
                />
              </Input.IconContainer>
              <Input.withPause>
                <Input.withChange
                  shape={shape}
                  type="shadowBlur"
                  isGlobalUpdate={false}
                >
                  <Input.Number min={0} step={1} />
                </Input.withChange>
              </Input.withPause>
            </Input.Grid>
          </Input.Container>
          <Input.Container>
            <Input.Grid>
              <Input.IconContainer>
                <Blend
                  size={constants.icon.size}
                  strokeWidth={constants.icon.strokeWidth}
                />
              </Input.IconContainer>
              <Input.withPause>
                <Input.withChange
                  shape={shape}
                  type="shadowOpacity"
                  isGlobalUpdate={false}
                >
                  <Input.Number min={0} max={1} step={0.1} />
                </Input.withChange>
              </Input.withPause>
            </Input.Grid>
          </Input.Container>
        </div>
      </section>
    </div>
  );
};
