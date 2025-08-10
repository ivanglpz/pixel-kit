import { Button } from "@/editor/components/button";
import InputColor from "@/editor/components/input-color";
import { InputNumber } from "@/editor/components/input-number";
import { InputSelect } from "@/editor/components/input-select";
import { InputTextArea } from "@/editor/components/input-textarea";
import { IShape } from "@/editor/shapes/type.shape";
import { SHAPE_SELECTED_ATOM, SHAPE_UPDATE_ATOM } from "@/editor/states/shape";
import { DELETE_SHAPE_ATOM } from "@/editor/states/shapes";
import { css } from "@stylespixelkit/css";
import { useAtomValue, useSetAtom } from "jotai";
import {
  Brush,
  Eye,
  EyeOff,
  Minus,
  PenTool,
  Plus,
  Ruler,
  Scan,
} from "lucide-react";
import { ChangeEvent, useRef } from "react";

// Función utilitaria para calcular la escala de imagen
const calculateScale = (
  originalWidth: number,
  originalHeight: number,
  containerWidth: number,
  containerHeight: number
): number => {
  const widthScale: number = containerWidth / originalWidth;
  const heightScale: number = containerHeight / originalHeight;
  return Math.min(widthScale, heightScale);
};

// Estilos reutilizables
export const commonStyles = {
  sectionTitle: css({
    paddingBottom: "md",
    paddingTop: "sm",
    fontWeight: "bold",
    fontSize: "sm",
  }),

  labelText: css({
    color: "text",
    fontWeight: "600",
    fontSize: "x-small",
    height: "15px",
  }),

  twoColumnGrid: css({
    display: "grid",
    gridTemplateColumns: "2",
    gap: "lg",
  }),

  threeColumnGrid: css({
    display: "grid",
    gridTemplateColumns: "1fr 33.5px 33.5px",
    alignItems: "end",
    gap: "md",
  }),

  iconButton: css({
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    height: 33.5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }),

  addButton: css({
    color: "white",
    border: "none",
    padding: "sm",
    cursor: "pointer",
    borderRadius: "md",
  }),

  sectionHeader: css({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  }),
};

// Componente Separador
const Separator = () => (
  <div
    className={css({
      marginTop: "md",
      height: 1,
      width: "100%",
      backgroundColor: "gray.700",
    })}
  />
);

// Componente para título de sección con botón opcional
export const SectionHeader = ({
  title,
  onAdd,
}: {
  title: string;
  onAdd?: () => void;
}) => (
  <div className={commonStyles.sectionHeader}>
    <p className={commonStyles.sectionTitle}>{title}</p>
    {onAdd && (
      <button className={commonStyles.addButton} onClick={onAdd}>
        <Plus size={14} />
      </button>
    )}
  </div>
);

export const LayoutShapeConfig = () => {
  // Hooks de estado
  const shape = useAtomValue(SHAPE_SELECTED_ATOM);
  const inputRef = useRef<HTMLInputElement>(null);
  const DELETE_SHAPE = useSetAtom(DELETE_SHAPE_ATOM);
  const shapeUpdate = useSetAtom(SHAPE_UPDATE_ATOM);

  // Si no hay shape seleccionado, no renderizar nada
  if (shape === null) return null;
  console.log(shape, "shape");

  // Opciones para selects
  const fontFamilyOptions = [
    { id: "font-Roboto", label: "Roboto", value: "Roboto" },
    { id: "font-Arial", label: "Arial", value: "Arial" },
  ];

  const fontWeightOptions = [
    { id: "font-weight-lighter", label: "Lighter", value: "lighter" },
    { id: "font-weight-normal", label: "Normal", value: "normal" },
    { id: "font-weight-medium", label: "Medium", value: "500" },
    { id: "font-weight-semi-bold", label: "Semi Bold", value: "600" },
    { id: "font-weight-bold", label: "Bold", value: "bold" },
    { id: "font-weight-bolder", label: "Bolder", value: "bolder" },
  ];

  // Manejadores de eventos
  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const image = new Image();
      image.onload = () => {
        const scale: number = calculateScale(
          image.width,
          image.height,
          shape.width ?? 500,
          shape.height ?? 500
        );
        const newWidth: number = image.width * scale;
        const newHeight: number = image.height * scale;

        shapeUpdate({
          src: reader?.result as string,
          width: newWidth,
          height: newHeight,
        });
      };
      image.src = reader?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = () => {
    // Implementación pendiente
    // DELETE_SHAPE({ id });
  };

  // Manejadores para fills
  const handleAddFill = () => {
    shapeUpdate({
      fills: [
        ...(shape.fills || []),
        { color: "#ffffff", opacity: 1, visible: true },
      ],
    });
  };

  const handleFillColorChange = (index: number, color: string) => {
    const newFills = [...shape.fills];
    newFills[index].color = color;
    shapeUpdate({ fills: newFills });
  };

  const handleFillVisibilityToggle = (index: number) => {
    const newFills = [...shape.fills];
    newFills[index].visible = !newFills[index].visible;
    shapeUpdate({ fills: newFills });
  };

  const handleFillRemove = (index: number) => {
    const newFills = [...shape.fills];
    newFills.splice(index, 1);
    shapeUpdate({ fills: newFills });
  };

  // Manejadores para strokes
  const handleAddStroke = () => {
    shapeUpdate({
      strokes: [...(shape.strokes || []), { color: "#000000", visible: true }],
    });
  };

  const handleStrokeColorChange = (index: number, color: string) => {
    const newStrokes = [...shape.strokes];
    newStrokes[index].color = color;
    shapeUpdate({ strokes: newStrokes });
  };

  const handleStrokeVisibilityToggle = (index: number) => {
    const newStrokes = [...shape.strokes];
    newStrokes[index].visible = !newStrokes[index].visible;
    shapeUpdate({ strokes: newStrokes });
  };

  const handleStrokeRemove = (index: number) => {
    const newStrokes = [...shape.strokes];
    newStrokes.splice(index, 1);
    shapeUpdate({ strokes: newStrokes });
  };

  // Manejadores para effects
  const handleAddEffect = () => {
    shapeUpdate({
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
        },
      ],
    });
  };

  const handleEffectColorChange = (index: number, color: string) => {
    const newEffects = [...(shape.effects ?? [])];
    newEffects[index].color = color;
    shapeUpdate({ effects: newEffects });
  };

  const handleEffectVisibilityToggle = (index: number) => {
    const newEffects = [...(shape.effects ?? [])];
    newEffects[index].visible = !newEffects[index].visible;
    shapeUpdate({ effects: newEffects });
  };

  const handleEffectRemove = (index: number) => {
    const newEffects = [...(shape.effects ?? [])];
    newEffects.splice(index, 1);
    shapeUpdate({ effects: newEffects });
  };

  // Manejadores específicos para propiedades de effects
  const handleEffectPropertyChange = (
    index: number,
    property: "x" | "y" | "blur" | "opacity",
    value: number
  ) => {
    const newEffects = [...(shape.effects ?? [])];
    newEffects[index][property] = value;
    shapeUpdate({ effects: newEffects });
  };

  // Manejador para border radius individual
  const handleBorderRadiusChange = (index: number, value: number) => {
    const currentRadii = shape.bordersRadius || [0, 0, 0, 0];
    const newRadii = [...currentRadii];
    newRadii[index] = value || 0;
    shapeUpdate({ bordersRadius: newRadii });
  };

  // Manejadores para line styles
  const handleLineStyleChange = (
    lineJoin: IShape["lineJoin"],
    lineCap: IShape["lineCap"]
  ) => {
    shapeUpdate({ lineJoin, lineCap });
  };

  return (
    <div
      className={`${css({ display: "flex", flexDirection: "column", gap: "md" })} scrollbar_container`}
    >
      {/* SECCIÓN: SHAPE - Información general */}
      <p className={commonStyles.sectionTitle}>Shape</p>

      {/* Posición */}
      <p className={commonStyles.labelText}>Position</p>
      <div className={commonStyles.twoColumnGrid}>
        <InputNumber
          iconType="x"
          value={shape.x}
          onChange={(v) => shapeUpdate({ x: v })}
        />
        <InputNumber
          iconType="y"
          labelText=""
          value={shape.y}
          onChange={(v) => shapeUpdate({ y: v })}
        />
      </div>

      <Separator />

      {/* SECCIÓN: LAYOUT - Dimensiones */}
      <p className={commonStyles.sectionTitle}>Layout</p>

      <p className={commonStyles.labelText}>Dimensions</p>
      <div className={commonStyles.twoColumnGrid}>
        <InputNumber
          iconType="width"
          value={Number(shape.width) || 0}
          onChange={(v) => shapeUpdate({ width: v })}
        />
        <InputNumber
          iconType="height"
          labelText=""
          value={Number(shape.height) || 0}
          onChange={(v) => shapeUpdate({ height: v })}
        />
      </div>

      <Separator />

      {/* SECCIÓN: APPEARANCE - Apariencia */}
      <p className={commonStyles.sectionTitle}>Appearance</p>

      {/* Opacidad y Border Radius */}
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "1fr 33.5px",
          alignItems: "end",
          gap: "md",
        })}
      >
        <div className={commonStyles.twoColumnGrid}>
          <InputNumber
            iconType="opacity"
            labelText="Opacity"
            min={0}
            max={1}
            step={0.1}
            value={shape.opacity}
            onChange={(e) => shapeUpdate({ opacity: e })}
          />
          <InputNumber
            iconType="br"
            labelText="Corner Radius"
            min={0}
            max={9999}
            step={1}
            type={shape.isAllBorderRadius ? "text" : "number"}
            value={shape.isAllBorderRadius ? "Mixed" : shape.borderRadius || 0}
            onChange={(e) => shapeUpdate({ borderRadius: e })}
          />
        </div>

        {/* Botón toggle para border radius individual */}
        <button
          className={css({
            backgroundColor: shape.isAllBorderRadius
              ? "gray.800"
              : "transparent",
            border: "none",
            cursor: "pointer",
            height: 33.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          })}
          onClick={() =>
            shapeUpdate({ isAllBorderRadius: !shape.isAllBorderRadius })
          }
        >
          <Scan size={14} />
        </button>
      </div>

      {/* Border Radius Individual */}
      {shape.isAllBorderRadius && (
        <div className={commonStyles.twoColumnGrid}>
          <InputNumber
            iconType="br"
            labelText="T.Left"
            value={shape.bordersRadius?.[0] || 0}
            onChange={(e) => handleBorderRadiusChange(0, e)}
          />
          <InputNumber
            iconType="br"
            labelText="T.Right"
            value={shape.bordersRadius?.[1] || 0}
            onChange={(e) => handleBorderRadiusChange(1, e)}
          />
          <InputNumber
            iconType="br"
            labelText="B.Left"
            value={shape.bordersRadius?.[3] || 0}
            onChange={(e) => handleBorderRadiusChange(3, e)}
          />
          <InputNumber
            iconType="br"
            labelText="B.Right"
            value={shape.bordersRadius?.[2] || 0}
            onChange={(e) => handleBorderRadiusChange(2, e)}
          />
        </div>
      )}

      <Separator />

      {/* SECCIÓN: TYPOGRAPHY - Tipografía */}
      <SectionHeader title="Typography" />

      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "2",
          gap: "lg",
          gridTemplateRows: "auto auto auto",
        })}
      >
        {/* Font Family */}
        <div className={css({ gridColumn: "2" })}>
          <InputSelect
            value={shape.fontFamily ?? "Roboto"}
            onChange={(e) =>
              shapeUpdate({ fontFamily: e as IShape["fontFamily"] })
            }
            options={fontFamilyOptions}
          />
        </div>

        {/* Font Weight */}
        <InputSelect
          labelText=""
          value={shape.fontWeight ?? "normal"}
          onChange={(e) =>
            shapeUpdate({ fontWeight: e as IShape["fontWeight"] })
          }
          options={fontWeightOptions}
        />

        {/* Font Size */}
        <InputNumber
          iconType="font"
          labelText=""
          min={12}
          max={72}
          step={4}
          onChange={(e) => shapeUpdate({ fontSize: e })}
          value={shape.fontSize || 0}
        />

        {/* Text Content */}
        <div className={css({ gridColumn: 2, gridRow: 3 })}>
          <InputTextArea
            labelText=""
            onChange={(e) => shapeUpdate({ text: e })}
            value={shape.text || ""}
          />
        </div>
      </div>

      <Separator />

      {/* SECCIÓN: FILL - Rellenos */}
      <SectionHeader title="Fill" onAdd={handleAddFill} />

      {/* Lista de fills */}
      {shape.fills?.length
        ? shape.fills.map((fill, index) => (
            <div
              key={`pixel-kit-shape-fill-${shape.id}-${shape.tool}-${index}`}
              className={commonStyles.threeColumnGrid}
            >
              <InputColor
                keyInput={`pixel-kit-shape-fill-${shape.id}-${shape.tool}-${index}`}
                labelText=""
                color={fill.color}
                onChangeColor={(e) => handleFillColorChange(index, e)}
              />

              {/* Botón visibility toggle */}
              <button
                onClick={() => handleFillVisibilityToggle(index)}
                className={commonStyles.iconButton}
              >
                {fill.visible ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>

              {/* Botón remove */}
              <button
                onClick={() => handleFillRemove(index)}
                className={commonStyles.iconButton}
              >
                <Minus size={18} />
              </button>
            </div>
          ))
        : null}

      <Separator />

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
              onChange={(v) => shapeUpdate({ strokeWidth: v })}
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
            onChange={(e) => shapeUpdate({ dash: e })}
            value={shape.dash || 0}
          />
        </>
      ) : null}

      <Separator />

      {/* SECCIÓN: IMAGE - Imagen */}
      <p
        className={css({
          color: "text",
          fontWeight: "600",
          fontSize: "sm",
        })}
      >
        Image
      </p>

      <Button text="Browser Files" onClick={() => inputRef.current?.click()} />

      {/* Input oculto para archivos */}
      <input
        ref={inputRef}
        type="file"
        color="white"
        accept="image/*"
        onChange={handleFiles}
        className={css({
          backgroundColor: "red",
          width: 0,
          height: 0,
          opacity: 0,
          display: "none",
        })}
      />

      <Separator />

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
