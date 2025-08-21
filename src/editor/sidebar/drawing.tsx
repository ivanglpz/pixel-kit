import InputColor from "@/editor/components/input-color";
import { css } from "@stylespixelkit/css";
import { useAtom, useAtomValue } from "jotai";
import { Brush, Eye, EyeOff, Minus, PenTool, Ruler } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { InputNumber } from "../components/input-number";
import { IShape } from "../shapes/type.shape";
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
          blur: 0,
          color: "#000",
          opacity: 1,
          x: 5,
          y: 5,
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

  // Manejadores específicos para propiedades de effects
  const handleEffectPropertyChange = (
    index: number,
    property: "x" | "y" | "blur" | "opacity",
    value: number
  ) => {
    const newEffects = [...(shape.effects ?? [])];
    newEffects[index][property] = value;
    setShape({
      ...shape,

      effects: newEffects,
    });
  };

  // Manejadores para line styles
  const handleLineStyleChange = (
    lineJoin: IShape["lineJoin"],
    lineCap: IShape["lineCap"]
  ) => {
    setShape({
      ...shape,

      lineJoin,
      lineCap,
    });
  };
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
              <InputColor
                keyInput={`pixel-kit-shape-stroke-${shape.id}-${shape.tool}-${index}`}
                labelText=""
                color={stroke.color}
                onChangeColor={(e) => handleStrokeColorChange(index, e)}
              />

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
            <InputNumber
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
            />

            {/* Line Style Buttons */}
            <div
              className={css({
                alignItems: "flex-end",
                display: "grid",
                gridTemplateColumns: "3",
              })}
            >
              <button
                onClick={() => handleLineStyleChange("round", "round")}
                className={css({
                  background:
                    shape.lineJoin === "round" && shape.lineCap === "round"
                      ? "bg.muted"
                      : "transparent",
                  borderRadius: "6px",
                  padding: "sm",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "33.5px",
                })}
              >
                <Brush size={16} />
              </button>

              <button
                onClick={() => handleLineStyleChange("miter", "round")}
                className={css({
                  background:
                    shape.lineJoin === "miter" && shape.lineCap === "round"
                      ? "bg.muted"
                      : "transparent",
                  borderRadius: "6px",
                  padding: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "33.5px",
                })}
              >
                <Ruler size={16} />
              </button>

              <button
                onClick={() => handleLineStyleChange("bevel", "square")}
                className={css({
                  background:
                    shape.lineJoin === "bevel" && shape.lineCap === "square"
                      ? "bg.muted"
                      : "transparent",
                  borderRadius: "6px",
                  padding: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "33.5px",
                })}
              >
                <PenTool size={16} />
              </button>
            </div>
          </div>

          {/* Dash */}
          <InputNumber
            iconType="dashed"
            labelText="Dash"
            min={0}
            max={100}
            onChange={(e) =>
              setShape({
                ...shape,

                dash: e,
              })
            }
            value={shape.dash || 0}
          />
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
            <InputColor
              keyInput={`pixel-kit-shape-effect-${shape.id}-${shape.tool}-${index}`}
              labelText=""
              color={effect.color}
              onChangeColor={(e) => handleEffectColorChange(index, e)}
            />

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

          {/* Controles detallados del efecto */}
          <div
            className={css({
              display: "grid",
              gridTemplateColumns: 2,
              gridTemplateRows: 2,
              gap: "lg",
            })}
          >
            {/* TODO: Corregir los manejadores - actualmente todos actualizan 'dash' */}
            <InputNumber
              iconType="x"
              min={0}
              labelText="x"
              max={100}
              onChange={(e) => handleEffectPropertyChange(index, "x", e)} // FIXME: debería actualizar effect.x
              value={effect.x}
            />
            <InputNumber
              iconType="y"
              labelText="y"
              min={0}
              max={100}
              onChange={(e) => handleEffectPropertyChange(index, "y", e)} // FIXME: debería actualizar effect.y
              value={effect.y}
            />
            <InputNumber
              iconType="square"
              labelText="blur"
              min={0}
              max={100}
              onChange={(e) => handleEffectPropertyChange(index, "blur", e)} // FIXME: debería actualizar effect.blur
              value={effect.blur}
            />
            <InputNumber
              iconType="opacity"
              labelText="opacity"
              min={0}
              max={1}
              step={0.1}
              onChange={(e) => handleEffectPropertyChange(index, "opacity", e)} // FIXME: debería actualizar effect.opacity
              value={effect.opacity}
            />
          </div>
        </section>
      ))}
    </div>
  );
};
