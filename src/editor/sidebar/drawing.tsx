import { Valid } from "@/components/valid";
import { css } from "@stylespixelkit/css";
import { useAtom, useAtomValue } from "jotai";
import { Blend, Eye, EyeOff, Minus, Square, SquareDashed } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Input } from "../components/input";
import { constants } from "../constants/color";
import { DRAW_START_CONFIG_ATOM } from "../states/drawing";
import TOOL_ATOM from "../states/tool";
import { commonStyles, SectionHeader } from "./sidebar-right-shape";

export const Drawing = () => {
  const tool = useAtomValue(TOOL_ATOM);

  const [shape, setShape] = useAtom(DRAW_START_CONFIG_ATOM);

  if (!["DRAW", "LINE"].includes(tool)) return null;

  // Manejadores para strokes
  const handleAddStroke = () => {
    setShape({
      ...shape,

      strokes: [
        ...(shape.strokes || []),
        { color: "#000000", visible: true, id: uuidv4() },
      ],
    });
  };

  const handleStrokeColorChange = (index: number, color: string) => {
    const newStrokes = [...shape.strokes];
    newStrokes[index].color = color;
    setShape({
      ...shape,

      strokes: newStrokes,
    });
  };

  const handleStrokeVisibilityToggle = (index: number) => {
    const newStrokes = [...shape.strokes];
    newStrokes[index].visible = !newStrokes[index].visible;
    setShape({
      ...shape,

      strokes: newStrokes,
    });
  };

  const handleStrokeRemove = (index: number) => {
    const newStrokes = [...shape.strokes];
    newStrokes.splice(index, 1);
    setShape({
      ...shape,

      strokes: newStrokes,
    });
  };

  // Manejadores para effects
  const handleAddEffect = () => {
    setShape({
      ...shape,

      effects: [
        ...(shape.effects || []),
        {
          type: "shadow",
          visible: true,
          color: "#000",
          id: uuidv4(),
        },
      ],
    });
  };

  const handleEffectColorChange = (index: number, color: string) => {
    const newEffects = [...(shape.effects ?? [])];
    newEffects[index].color = color;
    setShape({
      ...shape,

      effects: newEffects,
    });
  };

  const handleEffectVisibilityToggle = (index: number) => {
    const newEffects = [...(shape.effects ?? [])];
    newEffects[index].visible = !newEffects[index].visible;
    setShape({
      ...shape,

      effects: newEffects,
    });
  };

  const handleEffectRemove = (index: number) => {
    const newEffects = [...(shape.effects ?? [])];
    newEffects.splice(index, 1);
    setShape({
      ...shape,

      effects: newEffects,
    });
  };

  // Manejadores para line styles
  // const handleLineStyleChange = (
  //   lineJoin: IShape["lineJoin"],
  //   lineCap: IShape["lineCap"]
  // ) => {
  //   setShape({
  //     ...shape,

  //     lineJoin,
  //     lineCap,
  //   });
  // };
  return (
    <div
      className={`${css({
        display: "flex",
        flexDirection: "column",
        gap: "lg",
      })} `}
    >
      {" "}
      {/* SECCIÓN: STROKE - Bordes */}
      <SectionHeader title="Stroke" onAdd={handleAddStroke} />
      {shape.strokes?.length ? (
        <>
          {/* Lista de strokes */}
          {shape.strokes.map((stroke, index) => (
            <div
              key={`pixel-kit-shape-stroke-${shape.id}-${shape.tool}-${index}`}
              className={commonStyles.threeColumnGrid}
            >
              <Input.Container
                id={`pixel-kit-shape-stroke-${shape.id}-${shape.tool}-${index}`}
              >
                <Input.Grid>
                  <Input.IconContainer>
                    <Input.Color
                      id={`pixel-kit-shape-stroke-${shape.id}-${shape.tool}-${index}`}
                      value={stroke.color}
                      onChange={(e) => handleStrokeColorChange(index, e)}
                    />
                    {/* <Scaling size={constants.icon.size} /> */}
                  </Input.IconContainer>
                  <Input.Label
                    text={`#${stroke.color?.replace(/#/, "") ?? "ffffff"}`}
                  />
                </Input.Grid>
              </Input.Container>
              {/* <InputColor
                keyInput={`pixel-kit-shape-stroke-${shape.id}-${shape.tool}-${index}`}
                labelText=""
                color={stroke.color}
                onChangeColor={(e) => handleStrokeColorChange(index, e)}
              /> */}

              {/* Botón visibility toggle */}
              <button
                onClick={() => handleStrokeVisibilityToggle(index)}
                className={commonStyles.iconButton}
              >
                {stroke.visible ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>

              {/* Botón remove */}
              <button
                onClick={() => handleStrokeRemove(index)}
                className={commonStyles.iconButton}
              >
                <Minus size={18} />
              </button>
            </div>
          ))}

          {/* Configuraciones de stroke */}
          <div className={commonStyles.twoColumnGrid}>
            {/* Stroke Weight */}
            {/* <InputNumber
              iconType="width"
              min={0}
              max={9999}
              step={1}
              labelText="Weight"
              value={shape.strokeWidth || 0}
              onChange={(v) =>
                setShape({
                  ...shape,

                  strokeWidth: v,
                })
              }
            /> */}

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
                  min={0}
                  max={9999}
                  step={1}
                  value={shape.strokeWidth || 0}
                  onChange={(v) =>
                    setShape({
                      ...shape,

                      strokeWidth: v,
                    })
                  }
                />
              </Input.Grid>
            </Input.Container>
            {/* Line Style Buttons */}
            {/* <div
              className={css({
                alignItems: "flex-end",
                display: "grid",
                gridTemplateColumns: "3",
              })}
            >
              <button
                onClick={() => handleLineStyleChange("round", "round")}
                className={css({
                  cursor: "pointer",
                  width: 30,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderRadius: "md",
                })}
                style={{
                  backgroundColor:
                    shape.lineJoin === "round" && shape.lineCap === "round"
                      ? constants.theme.colors.background
                      : "transparent",
                  borderColor:
                    shape.lineJoin === "round" && shape.lineCap === "round"
                      ? constants.theme.colors.primary
                      : "transparent", // ← usa el semantic token
                }}
              >
                <Brush
                  size={constants.icon.size}
                  strokeWidth={constants.icon.strokeWidth}
                  color={
                    shape.lineJoin === "round" && shape.lineCap === "round"
                      ? constants.theme.colors.primary
                      : constants.theme.colors.white
                  }
                />
              </button>
              <button
                onClick={() => handleLineStyleChange("miter", "round")}
                className={css({
                  cursor: "pointer",
                  width: 30,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderRadius: "md",
                })}
                style={{
                  backgroundColor:
                    shape.lineJoin === "miter" && shape.lineCap === "round"
                      ? constants.theme.colors.background
                      : "transparent",
                  borderColor:
                    shape.lineJoin === "miter" && shape.lineCap === "round"
                      ? constants.theme.colors.primary
                      : "transparent", // ← usa el semantic token
                }}
              >
                <PenTool
                  size={constants.icon.size}
                  strokeWidth={constants.icon.strokeWidth}
                  color={
                    shape.lineJoin === "miter" && shape.lineCap === "round"
                      ? constants.theme.colors.primary
                      : constants.theme.colors.white
                  }
                />
              </button>
              <button
                onClick={() => handleLineStyleChange("miter", "butt")}
                className={css({
                  cursor: "pointer",
                  width: 30,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderRadius: "md",
                })}
                style={{
                  backgroundColor:
                    shape.lineJoin === "miter" && shape.lineCap === "butt"
                      ? constants.theme.colors.background
                      : "transparent",
                  borderColor:
                    shape.lineJoin === "miter" && shape.lineCap === "butt"
                      ? constants.theme.colors.primary
                      : "transparent", // ← usa el semantic token
                }}
              >
                <Ruler
                  size={constants.icon.size}
                  strokeWidth={constants.icon.strokeWidth}
                  color={
                    shape.lineJoin === "miter" && shape.lineCap === "butt"
                      ? constants.theme.colors.primary
                      : constants.theme.colors.white
                  }
                />
              </button>
            </div> */}
          </div>
          <Input.Container>
            <Input.Grid>
              <Input.IconContainer>
                <SquareDashed size={constants.icon.size} />
              </Input.IconContainer>
              <Input.Number
                min={0}
                step={1}
                onChange={(e) =>
                  setShape({
                    ...shape,

                    dash: e,
                  })
                }
                value={shape.dash || 0}
              />
            </Input.Grid>
          </Input.Container>
        </>
      ) : null}
      {/* SECCIÓN: EFFECTS - Efectos */}
      <SectionHeader title="Effects" onAdd={handleAddEffect} />
      {/* Lista de efectos */}
      {shape.effects?.map?.((effect, index) => (
        <section
          key={`pixel-kit-shape-effect-${shape.id}-${shape.tool}-${index}`}
          className={css({
            display: "flex",
            flexDirection: "column",
            gap: "lg",
          })}
        >
          {/* Controles principales del efecto */}
          <div className={commonStyles.threeColumnGrid}>
            <Input.Container
              id={`pixel-kit-shape-effect-${shape.id}-${shape.tool}-${index}`}
            >
              <Input.Grid>
                <Input.IconContainer>
                  <Input.Color
                    id={`pixel-kit-shape-effect-${shape.id}-${shape.tool}-${index}`}
                    value={effect.color}
                    onChange={(e) => handleEffectColorChange(index, e)}
                  />
                  {/* <Scaling size={constants.icon.size} /> */}
                </Input.IconContainer>
                <Input.Label
                  text={`#${effect.color?.replace(/#/, "") ?? "ffffff"}`}
                />
              </Input.Grid>
            </Input.Container>
            {/* <InputColor
              keyInput={`pixel-kit-shape-effect-${shape.id}-${shape.tool}-${index}`}
              labelText=""
              color={effect.color}
              onChangeColor={(e) => handleEffectColorChange(index, e)}
            /> */}

            {/* Botón visibility toggle */}
            <button
              onClick={() => handleEffectVisibilityToggle(index)}
              className={commonStyles.iconButton}
            >
              {effect.visible ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>

            {/* Botón remove */}
            <button
              onClick={() => handleEffectRemove(index)}
              className={commonStyles.iconButton}
            >
              <Minus size={18} />
            </button>
          </div>
        </section>
      ))}
      {/* Controles detallados del efecto */}
      <Valid isValid={shape.effects.length > 0}>
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
              <Input.Number
                step={1}
                value={shape.shadowOffsetX || 0}
                onChange={(v) => {
                  setShape({ ...shape, shadowOffsetX: v });
                }}
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
                  Y
                </p>
              </Input.IconContainer>
              <Input.Number
                step={1}
                value={shape.shadowOffsetY}
                onChange={(e) => {
                  setShape({ ...shape, shadowOffsetY: e });
                }}
              />
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
              <Input.Number
                step={1}
                onChange={(e) => {
                  setShape({ ...shape, shadowBlur: e });
                }}
                value={shape.shadowBlur}
              />
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
              <Input.Number
                step={1}
                onChange={(e) => {
                  setShape({ ...shape, shadowOpacity: e });
                }}
                value={shape.shadowOpacity}
              />
            </Input.Grid>
          </Input.Container>
        </div>
      </Valid>
    </div>
  );
};
