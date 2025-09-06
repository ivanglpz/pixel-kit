/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { Valid } from "@/components/valid";
import InputColor from "@/editor/components/input-color";
import { InputNumber } from "@/editor/components/input-number";
import { InputSelect } from "@/editor/components/input-select";
import { InputTextArea } from "@/editor/components/input-textarea";
import { IShape } from "@/editor/shapes/type.shape";
import { SHAPE_SELECTED_ATOM, SHAPE_UPDATE_ATOM } from "@/editor/states/shape";
import { css } from "@stylespixelkit/css";
import { useAtomValue, useSetAtom } from "jotai";
import {
  ArrowDown,
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  Brush,
  CornerRightDown,
  Expand,
  Eye,
  EyeOff,
  ImageIcon,
  Minus,
  PenTool,
  Plus,
  Ruler,
  Scan,
  Sliders,
  Smile,
} from "lucide-react";
import React, { ChangeEvent, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Dialog } from "../components/dialog";
import { Input } from "../components/input";
import { ListIcons } from "../components/list-icons";
import { constants } from "../constants/color";
import { useDelayedExecutor } from "../hooks/useDelayExecutor";
import { AlignItems, JustifyContent } from "../shapes/layout-flex";
import { UPDATE_UNDO_REDO } from "../states/undo-redo";

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
  container: css({
    display: "flex",
    flexDirection: "column",
    gap: "md",
  }),
  sectionTitle: css({
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
    gap: "md",
  }),
  two2ColumnGrid: css({
    display: "grid",
    gridTemplateColumns: "1fr 35px",
    gap: "md",
  }),
  threeColumnGrid: css({
    display: "grid",
    gridTemplateColumns: "1fr 33.5px 33.5px",
    alignItems: "end",
    gap: "md",
  }),
  fourColumnGrid: css({
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr",
    gap: "md",
  }),
  iconButton: css({
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "29px",
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
      height: 1,
      width: "100%",
      backgroundColor: "gray.700",
    })}
  />
);

interface LayoutGridProps {
  flexDirection: "row" | "column";
  justifyContent: JustifyContent;
  alignItems: AlignItems;
  onLayoutChange: (
    justifyContent: JustifyContent,
    alignItems: AlignItems
  ) => void;
}

const LayoutGrid: React.FC<LayoutGridProps> = ({
  flexDirection,
  justifyContent,
  alignItems,
  onLayoutChange,
}) => {
  const justifyContentValues: JustifyContent[] = [
    "flex-start",
    "center",
    "flex-end",
  ];
  const alignItemsValues: AlignItems[] = ["flex-start", "center", "flex-end"];

  const getGridValues = (row: number, col: number) => {
    if (flexDirection === "row") {
      return {
        justify: justifyContentValues[col],
        align: alignItemsValues[row],
      };
    } else {
      return {
        justify: justifyContentValues[row],
        align: alignItemsValues[col],
      };
    }
  };

  const handleGridClick = (row: number, col: number) => {
    const { justify, align } = getGridValues(row, col);
    onLayoutChange(justify, align);
  };

  const handleGridDoubleClick = (row: number, col: number) => {
    if (flexDirection === "row") {
      onLayoutChange("space-between", alignItemsValues[row]);
    } else {
      onLayoutChange("space-between", alignItemsValues[col]);
    }
  };

  const isSpaceBetweenActive = (row: number, col: number) => {
    return (
      justifyContent === "space-between" &&
      ((flexDirection === "row" && alignItemsValues[row] === alignItems) ||
        (flexDirection === "column" && alignItemsValues[col] === alignItems))
    );
  };

  const isCellSelected = (row: number, col: number) => {
    const { justify, align } = getGridValues(row, col);
    return justifyContent === justify && alignItems === align;
  };

  const getSquareColor = (row: number, col: number) => {
    if (isSpaceBetweenActive(row, col) || isCellSelected(row, col)) {
      return constants.theme.colors.primary;
    }
    return "transparent";
  };

  return (
    <div
      className={css({
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "repeat(3, 1fr)",
        gap: "sm",
        aspectRatio: "1",
        border: "1px solid",
        borderColor: "border.muted",
        borderRadius: "md",
        padding: "md",
        backgroundColor: "bg.muted",
      })}
    >
      {Array.from({ length: 9 }, (_, index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        return (
          <button
            key={`grid-${row}-${col}`}
            onClick={() => handleGridClick(row, col)}
            onDoubleClick={() => handleGridDoubleClick(row, col)}
            className={css({
              borderRadius: "4",
              border: "1px solid",
              borderColor: "border.elevated",
              cursor: "pointer",
              aspectRatio: "1",
              transition: "all 0.2s ease",
            })}
            style={{
              backgroundColor: getSquareColor(row, col),
            }}
          />
        );
      })}
    </div>
  );
};

// Componente para título de sección con botón opcional
export const SectionHeader = ({
  title,
  onAdd,
  onImage,
  onIcon,
}: {
  title: string;
  onAdd?: () => void;
  onImage?: VoidFunction;
  onIcon?: VoidFunction;
}) => (
  <div className={commonStyles.sectionHeader}>
    <p className={commonStyles.sectionTitle}>{title}</p>
    <div
      className={css({
        display: "flex",
        flexDir: "row",
        gap: "md",
      })}
    >
      {onIcon && (
        <button className={commonStyles.addButton} onClick={onIcon}>
          <Smile size={14} />
        </button>
      )}
      {onImage && (
        <button className={commonStyles.addButton} onClick={onImage}>
          <ImageIcon size={14} />
        </button>
      )}
      {onAdd && (
        <button className={commonStyles.addButton} onClick={onAdd}>
          <Plus size={14} />
        </button>
      )}
    </div>
  </div>
);

export const LayoutShapeConfig = () => {
  // Hooks de estado
  const [showIcons, setshowIcons] = useState(false);
  const shape = useAtomValue(SHAPE_SELECTED_ATOM);
  const inputRef = useRef<HTMLInputElement>(null);
  const shapeUpdate = useSetAtom(SHAPE_UPDATE_ATOM);
  const setUpdateUndoRedo = useSetAtom(UPDATE_UNDO_REDO);
  const { execute, isRunning } = useDelayedExecutor({
    callback: () => {
      setUpdateUndoRedo();
    },
    timer: 500, // opcional
  });

  // Si no hay shape seleccionado, no renderizar nada
  if (shape === null) return null;

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

  const createImageFromSVG = (svgString: string, svgName: string) => {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas?.getContext?.("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      shapeUpdate({
        fills: [
          {
            color: "#fff",
            id: uuidv4(),
            image: {
              src:
                "data:image/svg+xml;charset=utf-8," +
                encodeURIComponent(svgString),
              width: img.width,
              height: img.height,
              name: svgName,
            },
            opacity: 1,
            type: "image",
            visible: true,
          },
          ...(shape.fills || []),
        ],
      });
      execute(); // Ejecutar después del cambio
    };
    const dataImage =
      "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);
    img.src = dataImage;
  };

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
          width: newWidth,
          height: newHeight,
          fills: [
            {
              id: uuidv4(),
              color: "#ffffff",
              opacity: 1,
              visible: true,
              type: "image",
              image: {
                src: reader?.result as string,
                width: image.width,
                height: image.height,
                name: file.name,
              },
            },
            ...(shape.fills || []),
          ],
        });
        execute(); // Ejecutar después del cambio
      };
      image.src = reader?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Manejadores para fills
  const handleAddFill = () => {
    shapeUpdate({
      fills: [
        ...(shape.fills || []),
        {
          id: uuidv4(),
          color: "#ffffff",
          opacity: 1,
          visible: true,
          type: "fill",
          image: {
            src: "",
            width: 100,
            height: 100,
            name: "fill",
          },
        },
      ],
    });
    execute(); // Ejecutar después del cambio
  };

  const handleFillColorChange = (index: number, color: string) => {
    const newFills = [...shape.fills];
    newFills[index].color = color;
    shapeUpdate({ fills: newFills });
    execute(); // Ejecutar después del cambio
  };

  const handleFillVisibilityToggle = (index: number) => {
    const newFills = [...shape.fills];
    newFills[index].visible = !newFills[index].visible;
    shapeUpdate({ fills: newFills });
    execute(); // Ejecutar después del cambio
  };

  const handleFillRemove = (index: number) => {
    const newFills = [...shape.fills];
    newFills.splice(index, 1);
    shapeUpdate({ fills: newFills });
    execute(); // Ejecutar después del cambio
  };

  // Manejadores para strokes
  const handleAddStroke = () => {
    shapeUpdate({
      strokes: [
        ...(shape.strokes || []),
        {
          id: uuidv4(),
          color: "#000000",
          visible: true,
        },
      ],
    });
    execute(); // Ejecutar después del cambio
  };

  const handleStrokeColorChange = (index: number, color: string) => {
    const newStrokes = [...shape.strokes];
    newStrokes[index].color = color;
    shapeUpdate({ strokes: newStrokes });
    execute(); // Ejecutar después del cambio
  };

  const handleStrokeVisibilityToggle = (index: number) => {
    const newStrokes = [...shape.strokes];
    newStrokes[index].visible = !newStrokes[index].visible;
    shapeUpdate({ strokes: newStrokes });
    execute(); // Ejecutar después del cambio
  };

  const handleStrokeRemove = (index: number) => {
    const newStrokes = [...shape.strokes];
    newStrokes.splice(index, 1);
    shapeUpdate({ strokes: newStrokes });
    execute(); // Ejecutar después del cambio
  };

  // Manejadores para effects
  const handleAddEffect = () => {
    shapeUpdate({
      effects: [
        ...(shape.effects || []),
        {
          id: uuidv4(),
          type: "shadow",
          visible: true,
          color: "#000",
        },
      ],
    });
    execute(); // Ejecutar después del cambio
  };

  const handleEffectColorChange = (index: number, color: string) => {
    const newEffects = [...(shape.effects ?? [])];
    newEffects[index].color = color;
    shapeUpdate({ effects: newEffects });
    execute(); // Ejecutar después del cambio
  };

  const handleEffectVisibilityToggle = (index: number) => {
    const newEffects = [...(shape.effects ?? [])];
    newEffects[index].visible = !newEffects[index].visible;
    shapeUpdate({ effects: newEffects });
    execute(); // Ejecutar después del cambio
  };

  const handleEffectRemove = (index: number) => {
    const newEffects = [...(shape.effects ?? [])];
    newEffects.splice(index, 1);
    shapeUpdate({ effects: newEffects });
    execute(); // Ejecutar después del cambio
  };

  // Manejadores para line styles
  const handleLineStyleChange = (
    lineJoin: IShape["lineJoin"],
    lineCap: IShape["lineCap"]
  ) => {
    shapeUpdate({ lineJoin, lineCap });
    execute(); // Ejecutar después del cambio
  };

  // Manejadores para layouts (agregar con los demás manejadores)
  const handleAddLayout = () => {
    shapeUpdate({
      layouts: [
        ...(shape.layouts || []),
        {
          id: uuidv4(),
          visible: true,
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          flexWrap: "nowrap",
          gap: 10,
          // padding: 10,
        },
      ],
    });
    execute(); // Ejecutar después del cambio
  };

  const handleLayoutVisibilityToggle = (index: number) => {
    const newLayouts = [...(shape.layouts || [])];
    newLayouts[index].visible = !newLayouts[index].visible;
    shapeUpdate({ layouts: newLayouts });
    execute(); // Ejecutar después del cambio
  };

  const handleLayoutRemove = (index: number) => {
    const newLayouts = [...(shape.layouts || [])];
    newLayouts.splice(index, 1);
    shapeUpdate({ layouts: newLayouts });
    execute(); // Ejecutar después del cambio
  };

  const handleLayoutPropertyChangelAYD = (
    index: number,
    values: {
      justifyContent: JustifyContent;
      alignItems: AlignItems;
    }
  ) => {
    const newLayouts = [...(shape.layouts || [])];
    newLayouts[index] = {
      ...newLayouts[index],
      justifyContent: values.justifyContent,
      alignItems: values.alignItems,
    };
    shapeUpdate({ layouts: newLayouts });
    execute(); // Ejecutar después del cambio
  };

  const handleLayoutPropertyChange = (
    index: number,
    property: string,
    value: string | number
  ) => {
    const newLayouts = [...(shape.layouts || [])];
    newLayouts[index] = { ...newLayouts[index], [property]: value };
    shapeUpdate({ layouts: newLayouts });
    execute(); // Ejecutar después del cambio
  };

  return (
    <div
      className={`${css({
        display: "flex",
        flexDirection: "column",
        gap: "lg",
      })} scrollbar_container`}
    >
      {showIcons ? (
        <Dialog onClose={() => setshowIcons(false)}>
          <ListIcons
            onClose={() => setshowIcons(false)}
            onCreate={(svg, name) => {
              createImageFromSVG(svg, name);
              setshowIcons(false);
            }}
          />
        </Dialog>
      ) : null}

      {/* SECCIÓN: SHAPE - Información general */}
      <section className={commonStyles.container}>
        <div
          className={css({
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          })}
        >
          <p className={commonStyles.sectionTitle}>Shape</p>
          {isRunning ? (
            <div className="lds-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          ) : null}
        </div>

        {/* Posición */}
        <p className={commonStyles.labelText}>Position</p>
        <div className={commonStyles.twoColumnGrid}>
          <InputNumber
            iconType="x"
            value={shape.x}
            onChange={(v) => {
              shapeUpdate({ x: v });
              execute(); // Ejecutar después del cambio
            }}
          />
          <InputNumber
            iconType="y"
            labelText=""
            value={shape.y}
            onChange={(v) => {
              shapeUpdate({ y: v });
              execute(); // Ejecutar después del cambio
            }}
          />
        </div>

        <p className={commonStyles.labelText}>Rotation</p>
        <div className={commonStyles.twoColumnGrid}>
          <InputNumber
            iconType="rotate"
            min={0}
            max={360}
            step={1}
            value={shape.rotation}
            onChange={(v) => {
              shapeUpdate({ rotation: v });
              execute(); // Ejecutar después del cambio
            }}
          />
        </div>
      </section>

      <Separator />

      {/* SECCIÓN: LAYOUT - Dimensiones */}
      <section className={commonStyles.container}>
        <p className={commonStyles.sectionTitle}>Dimensions</p>

        {Boolean(shape.parentId) ? (
          <>
            <div className={commonStyles.two2ColumnGrid}>
              <InputNumber
                iconType="width"
                value={Number(shape.width) || 0}
                onChange={(v) => {
                  shapeUpdate({ width: v });
                  execute(); // Ejecutar después del cambio
                }}
              />
              <button
                onClick={() => {
                  shapeUpdate({
                    fillContainerWidth: !shape.fillContainerWidth,
                  });
                  execute(); // Ejecutar después del cambio
                }}
                className={css({
                  background: "bg.muted",
                  borderRadius: "6px",
                  padding: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                })}
              >
                <ArrowLeftRight
                  size={14}
                  color={
                    shape.fillContainerWidth
                      ? constants.theme.colors.primary
                      : constants.theme.colors["gray.200"]
                  }
                  strokeWidth={2.5}
                />
              </button>
            </div>
            <div className={commonStyles.two2ColumnGrid}>
              <InputNumber
                iconType="height"
                labelText=""
                value={Number(shape.height) || 0}
                onChange={(v) => {
                  shapeUpdate({ height: v });
                  execute(); // Ejecutar después del cambio
                }}
              />
              <button
                onClick={() => {
                  shapeUpdate({
                    fillContainerHeight: !shape.fillContainerHeight,
                  });
                  execute(); // Ejecutar después del cambio
                }}
                className={css({
                  background: "bg.muted",
                  borderRadius: "6px",
                  padding: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                })}
              >
                <ArrowUpDown
                  size={14}
                  strokeWidth={2.5}
                  color={
                    shape.fillContainerHeight
                      ? constants.theme.colors.primary
                      : constants.theme.colors["gray.200"]
                  }
                />
              </button>
            </div>
          </>
        ) : null}

        {!Boolean(shape.parentId) ? (
          <div className={commonStyles.twoColumnGrid}>
            <InputNumber
              iconType="width"
              value={Number(shape.width) || 0}
              onChange={(v) => {
                shapeUpdate({ width: v });
                execute(); // Ejecutar después del cambio
              }}
            />
            <InputNumber
              iconType="height"
              labelText=""
              value={Number(shape.height) || 0}
              onChange={(v) => {
                shapeUpdate({ height: v });
                execute(); // Ejecutar después del cambio
              }}
            />
          </div>
        ) : null}

        {/* NEW: Min/Max Dimensions Section */}
        <p className={commonStyles.labelText}>Min/Max Dimensions</p>
        <div
          className={css({
            display: "flex",
            flexDirection: "column",
            gap: "lg",
          })}
        >
          <InputNumber
            iconType="width"
            labelText="Min W"
            min={0}
            max={9999}
            step={1}
            value={shape.minWidth || 0}
            onChange={(v) => {
              shapeUpdate({ minWidth: v });
              execute();
            }}
          />
          <InputNumber
            iconType="height"
            labelText="Min H"
            min={0}
            max={9999}
            step={1}
            value={shape.minHeight || 0}
            onChange={(v) => {
              shapeUpdate({ minHeight: v });
              execute();
            }}
          />
          <InputNumber
            iconType="width"
            labelText="Max W"
            min={0}
            max={9999}
            step={1}
            value={shape.maxWidth || 0}
            onChange={(v) => {
              shapeUpdate({ maxWidth: v });
              execute();
            }}
          />
          <InputNumber
            iconType="height"
            labelText="Max H"
            min={0}
            max={9999}
            step={1}
            value={shape.maxHeight || 0}
            onChange={(v) => {
              shapeUpdate({ maxHeight: v });
              execute();
            }}
          />
        </div>

        {/* NEW: Padding Section */}
        <div
          className={css({
            display: "flex",
            flexDir: "column",
            gap: "md",
          })}
        >
          <Input.Label text="Padding" />
          <div
            className={css({
              display: "grid",
              gridTemplateColumns: "1fr 30px",
              gap: "md",
            })}
          >
            <Input.Container>
              <Input.Grid>
                <Input.IconContainer>
                  <Expand size={constants.icon.size} />
                </Input.IconContainer>
                {shape.isAllPadding ? (
                  <Input.Number
                    min={0}
                    max={9999}
                    step={1}
                    value={shape.padding}
                    onChange={(e) => {
                      shapeUpdate({
                        padding: e,
                      });
                      execute();
                    }}
                  />
                ) : null}
                {!shape.isAllPadding ? <Input.Label text="Mixed" /> : null}
              </Input.Grid>
            </Input.Container>
            <button
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
              onClick={() => {
                shapeUpdate({
                  isAllPadding: !shape.isAllPadding,
                });
                execute();
              }}
              style={{
                backgroundColor: !shape.isAllPadding
                  ? constants.theme.colors.background
                  : "transparent",
                borderColor: !shape.isAllPadding
                  ? constants.theme.colors.primary
                  : "transparent", // ← usa el semantic token
              }}
            >
              <Sliders
                size={constants.icon.size}
                strokeWidth={2.5}
                color={
                  !shape.isAllPadding
                    ? constants.theme.colors.primary
                    : constants.theme.colors.white
                }
              />
            </button>
          </div>
          {/* Botón toggle para padding individual */}
        </div>

        {/* Individual Padding Controls */}
        {!shape.isAllPadding && (
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
                  <ArrowUp size={constants.icon.size} />
                </Input.IconContainer>
                <Input.Number
                  min={0}
                  max={9999}
                  step={1}
                  value={shape.paddingTop || 0}
                  onChange={(e) => {
                    shapeUpdate({ paddingTop: e });
                    execute();
                  }}
                />
              </Input.Grid>
            </Input.Container>
            <Input.Container>
              <Input.Grid>
                <Input.IconContainer>
                  <ArrowRight size={constants.icon.size} />
                </Input.IconContainer>
                <Input.Number
                  min={0}
                  max={9999}
                  step={1}
                  value={shape.paddingRight || 0}
                  onChange={(e) => {
                    shapeUpdate({ paddingRight: e });
                    execute();
                  }}
                />
              </Input.Grid>
            </Input.Container>
            <Input.Container>
              <Input.Grid>
                <Input.IconContainer>
                  <ArrowDown size={constants.icon.size} />
                </Input.IconContainer>
                <Input.Number
                  min={0}
                  max={9999}
                  step={1}
                  value={shape.paddingBottom || 0}
                  onChange={(e) => {
                    shapeUpdate({ paddingBottom: e });
                    execute();
                  }}
                />
              </Input.Grid>
            </Input.Container>
            <Input.Container>
              <Input.Grid>
                <Input.IconContainer>
                  <ArrowLeft size={constants.icon.size} />
                </Input.IconContainer>
                <Input.Number
                  min={0}
                  max={9999}
                  step={1}
                  value={shape.paddingLeft || 0}
                  onChange={(e) => {
                    shapeUpdate({ paddingLeft: e });
                    execute();
                  }}
                />
              </Input.Grid>
            </Input.Container>
          </div>
        )}
      </section>

      <Separator />

      {shape?.tool === "GROUP" ? (
        <>
          <section className={commonStyles.container}>
            <SectionHeader title="Layouts" onAdd={handleAddLayout} />

            {/* Lista de layouts */}
            {shape.layouts?.length
              ? shape.layouts.map((layout, index) => (
                  <div
                    key={`pixel-kit-shape-layout-${shape.id}-${shape.tool}-${index}`}
                    className={css({
                      display: "flex",
                      flexDirection: "column",
                      gap: "md",
                    })}
                  >
                    {/* Header del layout con visibility y remove */}
                    <div
                      className={css({
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      })}
                    >
                      <div
                        className={css({
                          display: "flex",
                          alignItems: "center",
                          gap: "sm",
                          color: "text",
                          fontSize: "sm",
                          fontWeight: "500",
                        })}
                      >
                        Layout {index + 1}
                      </div>
                      <div
                        className={css({
                          display: "flex",
                          flexDirection: "row",
                          gap: "lg",
                        })}
                      >
                        {/* Botón visibility toggle */}
                        <button
                          onClick={() => handleLayoutVisibilityToggle(index)}
                          className={commonStyles.iconButton}
                        >
                          {layout.visible ? (
                            <Eye size={18} />
                          ) : (
                            <EyeOff size={18} />
                          )}
                        </button>
                        {/* Botón remove */}
                        <button
                          onClick={() => handleLayoutRemove(index)}
                          className={commonStyles.iconButton}
                        >
                          <Minus size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Controles del layout - solo si está visible */}
                    {layout.visible && (
                      <>
                        {/* Flex Direction y Flex Wrap */}
                        {/* NUEVO: Layout Grid Visual */}
                        <div className={commonStyles.twoColumnGrid}>
                          <LayoutGrid
                            flexDirection={layout.flexDirection}
                            justifyContent={layout.justifyContent}
                            alignItems={layout.alignItems}
                            onLayoutChange={(justifyContent, alignItems) => {
                              handleLayoutPropertyChangelAYD(index, {
                                alignItems,
                                justifyContent,
                              });
                            }}
                          />
                          <section
                            className={css({
                              display: "flex",
                              flexDirection: "column",
                              gap: "lg",
                            })}
                          >
                            <div
                              className={css({
                                display: "flex",
                                flexDirection: "row",
                                gap: "sm",
                              })}
                            >
                              <button
                                onClick={() =>
                                  handleLayoutPropertyChange(
                                    index,
                                    "flexDirection",
                                    "column"
                                  )
                                }
                                className={`${commonStyles.iconButton} ${css({
                                  padding: "md",
                                  backgroundColor:
                                    layout.flexDirection === "column"
                                      ? "gray.500"
                                      : "transparent",
                                })}`}
                              >
                                <ArrowDown size={14} />
                              </button>
                              <button
                                onClick={() =>
                                  handleLayoutPropertyChange(
                                    index,
                                    "flexDirection",
                                    "row"
                                  )
                                }
                                className={`${commonStyles.iconButton} ${css({
                                  padding: "md",
                                  backgroundColor:
                                    layout.flexDirection === "row"
                                      ? "gray.500"
                                      : "transparent",
                                })}`}
                              >
                                <ArrowRight size={14} />
                              </button>
                              <button
                                onClick={() =>
                                  handleLayoutPropertyChange(
                                    index,
                                    "flexWrap",
                                    layout.flexWrap === "wrap"
                                      ? "nowrap"
                                      : "wrap"
                                  )
                                }
                                className={`${commonStyles.iconButton} ${css({
                                  padding: "md",
                                  backgroundColor:
                                    layout.flexWrap === "wrap"
                                      ? "gray.500"
                                      : "transparent",
                                })}`}
                              >
                                <CornerRightDown size={14} />
                              </button>
                            </div>
                            {/* Gap y Padding */}
                            <div
                              className={css({
                                display: "flex",
                                gap: "lg",
                                flexDirection: "column",
                              })}
                            >
                              <InputNumber
                                iconType="square"
                                labelText="Gap"
                                min={0}
                                max={100}
                                step={1}
                                value={layout.gap}
                                onChange={(value) =>
                                  handleLayoutPropertyChange(
                                    index,
                                    "gap",
                                    value
                                  )
                                }
                              />
                            </div>
                          </section>
                        </div>
                      </>
                    )}
                  </div>
                ))
              : null}
          </section>
          <Separator />
        </>
      ) : null}

      {/* SECCIÓN: APPEARANCE - Apariencia */}
      <section className={commonStyles.container}>
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
              onChange={(e) => {
                shapeUpdate({ opacity: e });
                execute(); // Ejecutar después del cambio
              }}
            />
            <InputNumber
              iconType="br"
              labelText="Corner Radius"
              min={0}
              max={9999}
              step={1}
              type={shape.isAllBorderRadius ? "text" : "number"}
              value={
                shape.isAllBorderRadius ? "Mixed" : shape.borderRadius || 0
              }
              onChange={(e) => {
                shapeUpdate({ borderRadius: e });
                execute(); // Ejecutar después del cambio
              }}
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
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            })}
            onClick={() => {
              shapeUpdate({ isAllBorderRadius: !shape.isAllBorderRadius });
              execute(); // Ejecutar después del cambio
            }}
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
              value={shape.borderTopLeftRadius || 0}
              onChange={(e) => {
                shapeUpdate({ borderTopLeftRadius: e });
                execute(); // Ejecutar después del cambio
              }}
            />
            <InputNumber
              iconType="br"
              labelText="T.Right"
              value={shape.borderTopRightRadius || 0}
              onChange={(e) => {
                shapeUpdate({ borderTopRightRadius: e });
                execute(); // Ejecutar después del cambio
              }}
            />
            <InputNumber
              iconType="br"
              labelText="B.Left"
              value={shape.borderBottomLeftRadius || 0}
              onChange={(e) => {
                shapeUpdate({ borderBottomLeftRadius: e });
                execute(); // Ejecutar después del cambio
              }}
            />
            <InputNumber
              iconType="br"
              labelText="B.Right"
              value={shape.borderBottomRightRadius || 0}
              onChange={(e) => {
                shapeUpdate({ borderBottomRightRadius: e });
                execute(); // Ejecutar después del cambio
              }}
            />
          </div>
        )}
      </section>

      <Separator />

      <Valid isValid={shape.tool === "TEXT"}>
        {/* SECCIÓN: TYPOGRAPHY - Tipografía */}
        <section className={commonStyles.container}>
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
                onChange={(e) => {
                  shapeUpdate({ fontFamily: e as IShape["fontFamily"] });
                  execute(); // Ejecutar después del cambio
                }}
                options={fontFamilyOptions}
              />
            </div>
            {/* Font Weight */}
            <InputSelect
              labelText=""
              value={shape.fontWeight ?? "normal"}
              onChange={(e) => {
                shapeUpdate({ fontWeight: e as IShape["fontWeight"] });
                execute(); // Ejecutar después del cambio
              }}
              options={fontWeightOptions}
            />
            {/* Font Size */}
            <InputNumber
              iconType="font"
              labelText=""
              min={4}
              max={180}
              step={4}
              onChange={(e) => {
                shapeUpdate({ fontSize: e });
                execute(); // Ejecutar después del cambio
              }}
              value={shape.fontSize || 0}
            />
            {/* Text Content */}
            <div className={css({ gridColumn: 2, gridRow: 3 })}>
              <InputTextArea
                labelText=""
                onChange={(e) => {
                  shapeUpdate({ text: e });
                  execute(); // Ejecutar después del cambio
                }}
                value={shape.text || ""}
              />
            </div>
          </div>
        </section>
        <Separator />
      </Valid>

      {/* SECCIÓN: FILL - Rellenos */}
      <section className={commonStyles.container}>
        <SectionHeader
          title="Fill"
          onAdd={handleAddFill}
          onIcon={shape.tool === "IMAGE" ? () => setshowIcons(true) : undefined}
          onImage={
            shape.tool === "IMAGE"
              ? () => {
                  inputRef.current?.click();
                }
              : undefined
          }
        />

        {/* Lista de fills */}
        {shape.fills?.length
          ? shape.fills.map((fill, index) => (
              <div
                key={`pixel-kit-shape-fill-${shape.id}-${shape.tool}-${index}`}
                className={commonStyles.threeColumnGrid}
              >
                {fill.type === "fill" ? (
                  <InputColor
                    keyInput={`pixel-kit-shape-fill-${shape.id}-${shape.tool}-${index}`}
                    labelText=""
                    color={fill.color}
                    onChangeColor={(e) => handleFillColorChange(index, e)}
                  />
                ) : (
                  <div
                    className={css({
                      width: "100%",
                      flex: 1,
                      color: "text",
                      fontSize: "sm",
                      backgroundColor: "bg.muted", // Fondo más claro para el selector
                      borderRadius: "md",
                      padding: "md",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderColor: "border.muted", // ← usa el semantic token
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "start",
                      gap: "md",
                    })}
                  >
                    <img
                      src={fill.image?.src}
                      alt={`preview-${fill.id}`}
                      className={css({
                        height: "20px",
                        width: "20px",
                        borderRadius: "md",
                        border: "container",
                        display: "flex",
                        cursor: "pointer",
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderColor: "border.muted", // ← usa el semantic token
                        alignItems: "center",
                        justifyContent: "center",
                        objectFit: "cover",
                      })}
                    />
                    <p
                      className={css({
                        wordBreak: "break-all",
                        lineClamp: 1,
                      })}
                    >
                      {fill.image.name}
                    </p>
                  </div>
                )}
                {/* Botón visibility toggle */}
                <button
                  onClick={() => handleFillVisibilityToggle(index)}
                  className={commonStyles.iconButton}
                >
                  {fill.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                {/* Botón remove */}
                <button
                  onClick={() => handleFillRemove(index)}
                  className={commonStyles.iconButton}
                >
                  <Minus size={14} />
                </button>
              </div>
            ))
          : null}
      </section>

      <Separator />

      {/* SECCIÓN: STROKE - Bordes */}
      <section className={commonStyles.container}>
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
                  {stroke.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                {/* Botón remove */}
                <button
                  onClick={() => handleStrokeRemove(index)}
                  className={commonStyles.iconButton}
                >
                  <Minus size={14} />
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
                onChange={(v) => {
                  shapeUpdate({ strokeWidth: v });
                  execute(); // Ejecutar después del cambio
                }}
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
                  <Brush size={14} />
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
                  <PenTool size={14} />
                </button>
                <button
                  onClick={() => handleLineStyleChange("miter", "butt")}
                  className={css({
                    background:
                      shape.lineJoin === "miter" && shape.lineCap === "butt"
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
                  <Ruler size={14} />
                </button>
              </div>
            </div>
          </>
        ) : null}
      </section>

      <Separator />

      {/* SECCIÓN: EFFECTS - Efectos */}
      <section className={commonStyles.container}>
        <SectionHeader title="Effects" onAdd={handleAddEffect} />

        {/* Lista de effects */}
        {shape.effects?.length
          ? shape.effects.map((effect, index) => (
              <div
                key={`pixel-kit-shape-effect-${shape.id}-${shape.tool}-${index}`}
                className={commonStyles.threeColumnGrid}
              >
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
                  {effect.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                {/* Botón remove */}
                <button
                  onClick={() => handleEffectRemove(index)}
                  className={commonStyles.iconButton}
                >
                  <Minus size={14} />
                </button>
              </div>
            ))
          : null}
      </section>

      {/* Input file oculto para subir imágenes */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFiles}
      />
    </div>
  );
};
