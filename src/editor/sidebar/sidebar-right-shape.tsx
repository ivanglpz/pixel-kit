/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { Valid } from "@/components/valid";
import { IShape } from "@/editor/shapes/type.shape";
import { SHAPE_SELECTED_ATOM, SHAPE_UPDATE_ATOM } from "@/editor/states/shape";
import { css } from "@stylespixelkit/css";
import { useMutation } from "@tanstack/react-query";
import { useAtomValue, useSetAtom } from "jotai";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Blend,
  Brush,
  Columns,
  CornerDownLeft,
  CornerDownRight,
  CornerRightDown,
  CornerUpLeft,
  CornerUpRight,
  Expand,
  Eye,
  EyeOff,
  ImageIcon,
  Minus,
  MoveHorizontal,
  MoveVertical,
  PenTool,
  Plus,
  Ruler,
  Scaling,
  Sliders,
  Smile,
  Square,
  SquareDashed,
} from "lucide-react";
import React, { ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Button } from "../components/button";
import { Dialog } from "../components/dialog";
import { Input } from "../components/input";
import { ListIcons } from "../components/list-icons";
import { constants } from "../constants/color";
import { useAutoSave } from "../hooks/useAutoSave";
import { useDelayedExecutor } from "../hooks/useDelayExecutor";
import { AlignItems, JustifyContent } from "../shapes/layout-flex";
import { UPDATE_UNDO_REDO } from "../states/undo-redo";
import { ExportShape } from "./export-shape";

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
      _dark: {
        backgroundColor: "gray.700",
      },

      backgroundColor: "gray.150",
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
        borderRadius: "md",
        padding: "md",
        _dark: {
          borderColor: "gray.700", // ← usa el semantic token
          backgroundColor: "gray.800", // Fondo más claro para el selector
        },
        backgroundColor: "gray.100",
        borderColor: "gray.200", // ← usa el semantic token
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
              cursor: "pointer",
              aspectRatio: "1",
              transition: "all 0.2s ease",
              _dark: {
                borderColor: "gray.600", // ← usa el semantic token
                backgroundColor: "gray.800", // Fondo más claro para el selector
              },
              backgroundColor: "gray.100",
              borderColor: "gray.200", // ← usa el semantic token
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

export function getObjectUrl(obj: File): string {
  return URL.createObjectURL(obj);
}

export const LayoutShapeConfig = () => {
  // Hooks de estado
  const [showIcons, setshowIcons] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const shape = useAtomValue(SHAPE_SELECTED_ATOM);
  const inputRef = useRef<HTMLInputElement>(null);
  const shapeUpdate = useSetAtom(SHAPE_UPDATE_ATOM);
  const setUpdateUndoRedo = useSetAtom(UPDATE_UNDO_REDO);
  const [type, setType] = useState<"UPLOAD" | "CHOOSE">("UPLOAD");
  const { debounce } = useAutoSave();
  const [images, setImages] = useState<File[]>([]);
  const { execute, isRunning } = useDelayedExecutor({
    callback: () => {
      setUpdateUndoRedo();
      debounce.execute();
    },
    timer: 500, // opcional
  });

  // Si no hay shape seleccionado, no renderizar nada
  if (shape === null) return null;

  // Opciones para selects
  const fontFamilyOptions = [
    { id: "font-Arial", label: "Arial", value: "Arial" },
    { id: "font-ArialBlack", label: "Arial Black", value: "Arial Black" },
    { id: "font-Verdana", label: "Verdana", value: "Verdana" },
    { id: "font-Tahoma", label: "Tahoma", value: "Tahoma" },
    { id: "font-TrebuchetMS", label: "Trebuchet MS", value: "Trebuchet MS" },
    { id: "font-Impact", label: "Impact", value: "Impact" },
    {
      id: "font-TimesNewRoman",
      label: "Times New Roman",
      value: "Times New Roman",
    },
    { id: "font-Georgia", label: "Georgia", value: "Georgia" },
    { id: "font-Palatino", label: "Palatino", value: "Palatino" },
    { id: "font-Garamond", label: "Garamond", value: "Garamond" },
    { id: "font-CourierNew", label: "Courier New", value: "Courier New" },
    {
      id: "font-LucidaConsole",
      label: "Lucida Console",
      value: "Lucida Console",
    },
    {
      id: "font-LucidaSansUnicode",
      label: "Lucida Sans Unicode",
      value: "Lucida Sans Unicode",
    },
    { id: "font-ComicSansMS", label: "Comic Sans MS", value: "Comic Sans MS" },
    { id: "font-Candara", label: "Candara", value: "Candara" },
    { id: "font-Calibri", label: "Calibri", value: "Calibri" },
    { id: "font-Cambria", label: "Cambria", value: "Cambria" },
    { id: "font-Constantia", label: "Constantia", value: "Constantia" },
    { id: "font-Consolas", label: "Consolas", value: "Consolas" },
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

    const maxSizeInBytes = 1 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      toast.error(`The image ${file.name} cannot be larger than 1MB.`);
      event.target.value = ""; // resetear aquí
      return;
    }

    setImages([file]);

    event.target.value = ""; // resetear después también
    // procesar archivo
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

  const mutation = useMutation({
    mutationKey: ["upload_image"],
    mutationFn: async () => {
      console.log("test");
      return 1;
    },
  });

  // Manejadores para layouts (agregar con los demás manejadores)

  return (
    <div
      className={`${css({
        display: "flex",
        flexDirection: "column",
        gap: "lg",
      })} scrollbar_container`}
    >
      <Dialog.Provider visible={showIcons} onClose={() => setshowIcons(false)}>
        <Dialog.Container fullWidth fullHeight>
          <Dialog.Header>
            <p
              className={css({
                fontWeight: "bold",
              })}
            >
              Lucide Icons
            </p>
            <Dialog.Close onClose={() => setshowIcons(false)} />
          </Dialog.Header>
          <ListIcons
            onCreate={(svg, name) => {
              createImageFromSVG(svg, name);
              setshowIcons(false);
            }}
          />
        </Dialog.Container>
      </Dialog.Provider>
      <Dialog.Provider visible={showImage} onClose={() => setShowImage(false)}>
        <Dialog.Container fullWidth fullHeight>
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

          <section
            className={css({
              display: "flex",
              flexDirection: "column",
              gap: "lg",
              flex: 1, // este section ocupa todo el alto
              minHeight: 0, // clave: evita que el flex se rompa
            })}
          >
            <header
              className={css({
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)", // corregido
                gap: "lg",
              })}
            >
              <Button.Secondary
                onClick={() => {
                  setType("UPLOAD");
                }}
              >
                Upload
              </Button.Secondary>
              <Button.Secondary
                onClick={() => {
                  setType("CHOOSE");
                }}
              >
                Choose
              </Button.Secondary>
            </header>

            <section
              className={css({
                display: "grid",
                gridTemplateRows: "50px 1fr",
                gridTemplateColumns: "1fr",
                flex: 1,
                minHeight: 0, // evita colapso
              })}
            >
              <header
                className={css({
                  display: "flex",
                  flexDir: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                })}
              >
                <p>{images.at(0)?.name}</p>
                <Button.Secondary
                  onClick={() => {
                    inputRef.current?.click();
                  }}
                >
                  Choose
                </Button.Secondary>
              </header>
              <div
                className={css({
                  backgroundColor: "gray.150",
                  display: "flex",
                  flex: 1,
                  minHeight: 0,
                })}
              >
                {images?.[0] ? (
                  <img
                    src={getObjectUrl(images?.[0])}
                    alt="preview-app"
                    className={css({
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    })}
                  />
                ) : null}
              </div>
            </section>

            <footer
              className={css({
                display: "flex",
                flexDirection: "row",
                gap: "lg",
                justifyContent: "end",
              })}
            >
              <Button.Secondary onClick={() => {}}>Cancel</Button.Secondary>
              <Button.Primary onClick={() => {}}>
                Upload
                {/* {loading ? (
                    <Loading color={constants.theme.colors.black} />
                  ) : (
                    <>
                      <File size={constants.icon.size} /> Export
                    </>
                  )} */}
              </Button.Primary>
            </footer>
          </section>
        </Dialog.Container>
      </Dialog.Provider>

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
                  X
                </p>
                {/* <MoveHorizontal size={constants.icon.size} /> */}
              </Input.IconContainer>
              <Input.withPause>
                <Input.Number
                  step={1}
                  value={shape.x}
                  onChange={(v) => {
                    shapeUpdate({ x: v });
                    execute(); // Ejecutar después del cambio
                  }}
                />
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
                {/* <MoveHorizontal size={constants.icon.size} /> */}
              </Input.IconContainer>
              <Input.withPause>
                <Input.Number
                  step={1}
                  value={shape.y}
                  onChange={(v) => {
                    shapeUpdate({ y: v });
                    execute(); // Ejecutar después del cambio
                  }}
                />
              </Input.withPause>
            </Input.Grid>
          </Input.Container>
        </div>
      </section>

      {/* SECCIÓN: LAYOUT - Dimensiones */}
      <section className={commonStyles.container}>
        <p className={commonStyles.sectionTitle}>Dimensions</p>

        {Boolean(shape.parentId) ? (
          <>
            <div className={commonStyles.two2ColumnGrid}>
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
                    {/* <MoveHorizontal size={constants.icon.size} /> */}
                  </Input.IconContainer>
                  <Input.withPause>
                    <Input.Number
                      step={1}
                      min={0}
                      value={Number(shape.width) || 0}
                      onChange={(v) => {
                        shapeUpdate({ width: v });
                        execute(); // Ejecutar después del cambio
                      }}
                    />
                  </Input.withPause>
                </Input.Grid>
              </Input.Container>

              <button
                onClick={() => {
                  shapeUpdate({
                    fillContainerWidth: !shape.fillContainerWidth,
                  });
                  execute(); // Ejecutar después del cambio
                }}
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
                  backgroundColor: shape.fillContainerWidth
                    ? constants.theme.colors.background
                    : "transparent",
                  borderColor: shape.fillContainerWidth
                    ? constants.theme.colors.primary
                    : "transparent", // ← usa el semantic token
                }}
              >
                <MoveHorizontal
                  size={constants.icon.size}
                  color={
                    shape.fillContainerWidth
                      ? constants.theme.colors.primary
                      : constants.theme.colors.white
                  }
                  strokeWidth={constants.icon.strokeWidth}
                />
              </button>
            </div>
            <div className={commonStyles.two2ColumnGrid}>
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
                    {/* <MoveHorizontal size={constants.icon.size} /> */}
                  </Input.IconContainer>
                  <Input.withPause>
                    <Input.Number
                      step={1}
                      min={0}
                      value={Number(shape.height) || 0}
                      onChange={(v) => {
                        shapeUpdate({ height: v });
                        execute(); // Ejecutar después del cambio
                      }}
                    />
                  </Input.withPause>
                </Input.Grid>
              </Input.Container>

              <button
                onClick={() => {
                  shapeUpdate({
                    fillContainerHeight: !shape.fillContainerHeight,
                  });
                  execute(); // Ejecutar después del cambio
                }}
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
                  backgroundColor: shape.fillContainerHeight
                    ? constants.theme.colors.background
                    : "transparent",
                  borderColor: shape.fillContainerHeight
                    ? constants.theme.colors.primary
                    : "transparent", // ← usa el semantic token
                }}
              >
                <MoveVertical
                  size={constants.icon.size}
                  color={
                    shape.fillContainerHeight
                      ? constants.theme.colors.primary
                      : constants.theme.colors.white
                  }
                  strokeWidth={constants.icon.strokeWidth}
                />
              </button>
            </div>
          </>
        ) : null}

        {!Boolean(shape.parentId) ? (
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
                  {/* <MoveHorizontal size={constants.icon.size} /> */}
                </Input.IconContainer>
                <Input.withPause>
                  <Input.Number
                    step={1}
                    value={Number(shape.width) || 0}
                    onChange={(v) => {
                      shapeUpdate({ width: v });
                      execute(); // Ejecutar después del cambio
                    }}
                  />
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
                    H
                  </p>
                  {/* <MoveHorizontal size={constants.icon.size} /> */}
                </Input.IconContainer>
                <Input.withPause>
                  <Input.Number
                    step={1}
                    value={Number(shape.height) || 0}
                    onChange={(v) => {
                      shapeUpdate({ height: v });
                      execute(); // Ejecutar después del cambio
                    }}
                  />
                </Input.withPause>
              </Input.Grid>
            </Input.Container>
          </div>
        ) : null}

        {/* NEW: Min/Max Dimensions Section */}
        {/* <p className={commonStyles.labelText}>Min/Max Dimensions</p> */}
        <Input.Label text="Min" />

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
                {/* <MoveHorizontal size={constants.icon.size} /> */}
              </Input.IconContainer>
              <Input.withPause>
                <Input.Number
                  min={0}
                  max={9999}
                  step={1}
                  value={shape.minWidth}
                  onChange={(e) => {
                    shapeUpdate({ minWidth: e });
                    execute();
                  }}
                />
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
                  H
                </p>
              </Input.IconContainer>
              <Input.withPause>
                <Input.Number
                  min={0}
                  max={9999}
                  step={1}
                  value={shape.minHeight || 0}
                  onChange={(v) => {
                    shapeUpdate({ minHeight: v });
                    execute();
                  }}
                />
              </Input.withPause>
            </Input.Grid>
          </Input.Container>
        </div>
        <Input.Label text="Max" />
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
                <Input.Number
                  min={0}
                  max={9999}
                  step={1}
                  value={shape.maxWidth || 0}
                  onChange={(v) => {
                    shapeUpdate({ maxWidth: v });
                    execute();
                  }}
                />
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
                  H
                </p>
              </Input.IconContainer>
              <Input.withPause>
                <Input.Number
                  min={0}
                  max={9999}
                  step={1}
                  value={shape.maxHeight || 0}
                  onChange={(v) => {
                    shapeUpdate({ maxHeight: v });
                    execute();
                  }}
                />
              </Input.withPause>
            </Input.Grid>
          </Input.Container>
        </div>
      </section>

      <Separator />

      {shape.tool === "FRAME" ? (
        <>
          <section className={commonStyles.container}>
            <SectionHeader
              title="Layouts"
              onAdd={() => {
                shapeUpdate({ isLayout: !shape.isLayout });
                execute();
              }}
            />

            {/* Lista de layouts */}
            {shape.isLayout ? (
              <>
                <div
                  className={css({
                    display: "flex",
                    flexDirection: "column",
                    gap: "md",
                  })}
                >
                  <div className={commonStyles.twoColumnGrid}>
                    <LayoutGrid
                      flexDirection={shape.flexDirection}
                      justifyContent={shape.justifyContent}
                      alignItems={shape.alignItems}
                      onLayoutChange={(justifyContent, alignItems) => {
                        shapeUpdate({ justifyContent, alignItems });
                        execute();
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
                          onClick={() => {
                            shapeUpdate({
                              flexDirection: "column",
                            });
                            execute();
                          }}
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
                              shape.flexDirection === "column"
                                ? constants.theme.colors.background
                                : "transparent",
                            borderColor:
                              shape.flexDirection === "column"
                                ? constants.theme.colors.primary
                                : "transparent", // ← usa el semantic token
                          }}
                        >
                          <ArrowDown
                            size={constants.icon.size}
                            strokeWidth={constants.icon.strokeWidth}
                            color={
                              shape.flexDirection === "column"
                                ? constants.theme.colors.primary
                                : constants.theme.colors.white
                            }
                          />
                        </button>
                        <button
                          onClick={() => {
                            shapeUpdate({
                              flexDirection: "row",
                            });
                            execute();
                          }}
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
                              shape.flexDirection === "row"
                                ? constants.theme.colors.background
                                : "transparent",
                            borderColor:
                              shape.flexDirection === "row"
                                ? constants.theme.colors.primary
                                : "transparent", // ← usa el semantic token
                          }}
                        >
                          <ArrowRight
                            size={constants.icon.size}
                            strokeWidth={constants.icon.strokeWidth}
                            color={
                              shape.flexDirection === "row"
                                ? constants.theme.colors.primary
                                : constants.theme.colors.white
                            }
                          />
                        </button>
                        <button
                          onClick={() => {
                            shapeUpdate({
                              flexWrap:
                                shape.flexWrap === "wrap" ? "nowrap" : "wrap",
                            });
                            execute();
                          }}
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
                              shape.flexWrap === "wrap"
                                ? constants.theme.colors.background
                                : "transparent",
                            borderColor:
                              shape.flexWrap === "wrap"
                                ? constants.theme.colors.primary
                                : "transparent", // ← usa el semantic token
                          }}
                        >
                          <CornerRightDown
                            size={constants.icon.size}
                            strokeWidth={constants.icon.strokeWidth}
                            color={
                              shape.flexWrap === "wrap"
                                ? constants.theme.colors.primary
                                : constants.theme.colors.white
                            }
                          />
                        </button>
                      </div>

                      <Input.Container>
                        <Input.Grid>
                          <Input.IconContainer>
                            <Columns size={constants.icon.size} />
                          </Input.IconContainer>
                          <Input.withPause>
                            <Input.Number
                              min={0}
                              max={9999}
                              step={1}
                              value={shape.gap}
                              onChange={(e) => {
                                shapeUpdate({
                                  gap: e,
                                });
                                execute();
                              }}
                            />
                          </Input.withPause>
                        </Input.Grid>
                      </Input.Container>
                    </section>
                  </div>
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
                          <Input.withPause>
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
                          </Input.withPause>
                        ) : null}
                        {!shape.isAllPadding ? (
                          <Input.Label text="Mixed" />
                        ) : null}
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
                        strokeWidth={constants.icon.strokeWidth}
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
                        <Input.withPause>
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
                        </Input.withPause>
                      </Input.Grid>
                    </Input.Container>
                    <Input.Container>
                      <Input.Grid>
                        <Input.IconContainer>
                          <ArrowRight size={constants.icon.size} />
                        </Input.IconContainer>
                        <Input.withPause>
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
                        </Input.withPause>
                      </Input.Grid>
                    </Input.Container>
                    <Input.Container>
                      <Input.Grid>
                        <Input.IconContainer>
                          <ArrowDown size={constants.icon.size} />
                        </Input.IconContainer>
                        <Input.withPause>
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
                        </Input.withPause>
                      </Input.Grid>
                    </Input.Container>
                    <Input.Container>
                      <Input.Grid>
                        <Input.IconContainer>
                          <ArrowLeft size={constants.icon.size} />
                        </Input.IconContainer>
                        <Input.withPause>
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
                        </Input.withPause>
                      </Input.Grid>
                    </Input.Container>
                  </div>
                )}
              </>
            ) : null}
          </section>
          <Separator />
        </>
      ) : null}

      {/* SECCIÓN: APPEARANCE - Apariencia */}
      <section className={commonStyles.container}>
        <p className={commonStyles.sectionTitle}>Appearance</p>
        <div className={commonStyles.twoColumnGrid}>
          <Input.Container>
            <Input.Grid>
              <Input.IconContainer>
                <Blend size={constants.icon.size} />
              </Input.IconContainer>
              <Input.withPause>
                <Input.Number
                  min={0}
                  max={1}
                  step={0.1}
                  value={shape.opacity}
                  onChange={(e) => {
                    shapeUpdate({ opacity: e });
                    execute(); // Ejecutar después del cambio
                  }}
                />
              </Input.withPause>
            </Input.Grid>
          </Input.Container>
        </div>

        <div
          className={css({
            display: "flex",
            flexDir: "column",
            gap: "md",
          })}
        >
          <Input.Label text="Corner Radius" />
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
                {shape.isAllBorderRadius ? (
                  <Input.withPause>
                    <Input.Number
                      min={0}
                      max={9999}
                      step={1}
                      value={shape.borderRadius}
                      onChange={(e) => {
                        shapeUpdate({
                          borderRadius: e,
                        });
                        execute();
                      }}
                    />
                  </Input.withPause>
                ) : null}
                {!shape.isAllBorderRadius ? <Input.Label text="Mixed" /> : null}
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
                shapeUpdate({ isAllBorderRadius: !shape.isAllBorderRadius });
                execute(); // Ejecutar después del cambio
              }}
              style={{
                backgroundColor: !shape.isAllBorderRadius
                  ? constants.theme.colors.background
                  : "transparent",
                borderColor: !shape.isAllBorderRadius
                  ? constants.theme.colors.primary
                  : "transparent", // ← usa el semantic token
              }}
            >
              <Sliders
                size={constants.icon.size}
                strokeWidth={constants.icon.strokeWidth}
                color={
                  !shape.isAllBorderRadius
                    ? constants.theme.colors.primary
                    : constants.theme.colors.white
                }
              />
            </button>
          </div>
        </div>
        {!shape.isAllBorderRadius ? (
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
                  <CornerUpLeft size={constants.icon.size} />
                </Input.IconContainer>
                <Input.withPause>
                  <Input.Number
                    min={0}
                    max={9999}
                    step={1}
                    value={shape.borderTopLeftRadius || 0}
                    onChange={(e) => {
                      shapeUpdate({ borderTopLeftRadius: e });
                      execute();
                    }}
                  />
                </Input.withPause>
              </Input.Grid>
            </Input.Container>
            <Input.Container>
              <Input.Grid>
                <Input.IconContainer>
                  <CornerUpRight size={constants.icon.size} />
                </Input.IconContainer>
                <Input.withPause>
                  <Input.Number
                    min={0}
                    max={9999}
                    step={1}
                    value={shape.borderTopRightRadius || 0}
                    onChange={(e) => {
                      shapeUpdate({ borderTopRightRadius: e });
                      execute();
                    }}
                  />
                </Input.withPause>
              </Input.Grid>
            </Input.Container>
            <Input.Container>
              <Input.Grid>
                <Input.IconContainer>
                  <CornerDownLeft size={constants.icon.size} />
                </Input.IconContainer>
                <Input.withPause>
                  <Input.Number
                    min={0}
                    max={9999}
                    step={1}
                    value={shape.borderBottomLeftRadius || 0}
                    onChange={(e) => {
                      shapeUpdate({ borderBottomLeftRadius: e });
                      execute();
                    }}
                  />
                </Input.withPause>
              </Input.Grid>
            </Input.Container>
            <Input.Container>
              <Input.Grid>
                <Input.IconContainer>
                  <CornerDownRight size={constants.icon.size} />
                </Input.IconContainer>
                <Input.withPause>
                  <Input.Number
                    min={0}
                    max={9999}
                    step={1}
                    value={shape.borderBottomRightRadius || 0}
                    onChange={(e) => {
                      shapeUpdate({ borderBottomRightRadius: e });
                      execute();
                    }}
                  />
                </Input.withPause>
              </Input.Grid>
            </Input.Container>
          </div>
        ) : null}
      </section>

      <Separator />

      <Valid isValid={shape.tool === "TEXT"}>
        {/* SECCIÓN: TYPOGRAPHY - Tipografía */}
        <section className={commonStyles.container}>
          <SectionHeader title="Typography" />

          <Input.Container>
            <Input.Select
              value={shape.fontFamily ?? "Roboto"}
              onChange={(e) => {
                shapeUpdate({ fontFamily: e as IShape["fontFamily"] });
                execute(); // Ejecutar después del cambio
              }}
              options={fontFamilyOptions}
            />
          </Input.Container>

          <div className={commonStyles.twoColumnGrid}>
            <Input.Container>
              <Input.Select
                value={shape.fontWeight ?? "normal"}
                onChange={(e) => {
                  shapeUpdate({ fontWeight: e as IShape["fontWeight"] });
                  execute(); // Ejecutar después del cambio
                }}
                options={fontWeightOptions}
              />
            </Input.Container>

            {/* Font Size */}
            <Input.Container>
              <Input.Grid>
                <Input.IconContainer>
                  <Scaling size={constants.icon.size} />
                </Input.IconContainer>
                <Input.withPause>
                  <Input.Number
                    min={4}
                    max={180}
                    step={4}
                    onChange={(e) => {
                      shapeUpdate({ fontSize: e });
                      execute(); // Ejecutar después del cambio
                    }}
                    value={shape.fontSize || 0}
                  />
                </Input.withPause>
              </Input.Grid>
            </Input.Container>

            {/* Text Content */}
          </div>
          <div className={css({ gridColumn: 2, gridRow: 3 })}>
            <Input.Container>
              <Input.withPause>
                <Input.TextArea
                  onChange={(e) => {
                    shapeUpdate({ text: e });
                    execute(); // Ejecutar después del cambio
                  }}
                  value={shape.text || ""}
                />
              </Input.withPause>
            </Input.Container>
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
                  setShowImage(true);
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
                  <Input.Container
                    id={`pixel-kit-shape-fill-${shape.id}-${shape.tool}-${index}`}
                  >
                    <Input.Grid>
                      <Input.IconContainer>
                        <Input.Color
                          id={`pixel-kit-shape-fill-${shape.id}-${shape.tool}-${index}`}
                          value={fill.color}
                          onChange={(e) => handleFillColorChange(index, e)}
                        />
                        {/* <Scaling size={constants.icon.size} /> */}
                      </Input.IconContainer>
                      <Input.Label
                        text={`#${fill.color?.replace(/#/, "") ?? "ffffff"}`}
                      />
                    </Input.Grid>
                  </Input.Container>
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
                    <Input.Number
                      min={0}
                      max={9999}
                      step={1}
                      value={shape.strokeWidth || 0}
                      onChange={(v) => {
                        shapeUpdate({ strokeWidth: v });
                        execute(); // Ejecutar después del cambio
                      }}
                    />
                  </Input.withPause>
                </Input.Grid>
              </Input.Container>
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
              </div>
            </div>

            <Input.Container>
              <Input.Grid>
                <Input.IconContainer>
                  <SquareDashed size={constants.icon.size} />
                </Input.IconContainer>
                <Input.withPause>
                  <Input.Number
                    min={0}
                    step={1}
                    onChange={(e) => {
                      shapeUpdate({ dash: e });
                      execute(); // Ejecutar después del cambio
                    }}
                    value={shape.dash || 0}
                  />
                </Input.withPause>
              </Input.Grid>
            </Input.Container>
            {/* <InputNumber
              iconType="dashed"
              labelText="Dash"
              min={0}
              max={100}
              step={5}
              onChange={(e) =>
                setShape({
                  ...shape,

                  dash: e,
                })
              }
              value={shape.dash || 0}
            /> */}
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
              <Input.withPause>
                <Input.Number
                  step={1}
                  value={shape.shadowOffsetX || 0}
                  onChange={(v) => {
                    shapeUpdate({ shadowOffsetX: v });
                    execute(); // Ejecutar después del cambio
                  }}
                />
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
              <Input.withPause>
                <Input.Number
                  step={1}
                  value={shape.shadowOffsetY}
                  onChange={(e) => {
                    shapeUpdate({ shadowOffsetY: e });
                    execute(); // Ejecutar después del cambio
                  }}
                />
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
                <Input.Number
                  min={0}
                  step={1}
                  onChange={(e) => {
                    shapeUpdate({ shadowBlur: e });
                    execute(); // Ejecutar después del cambio
                  }}
                  value={shape.shadowBlur}
                />
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
                <Input.Number
                  min={0}
                  max={1}
                  step={0.1}
                  onChange={(e) => {
                    shapeUpdate({ shadowOpacity: e });
                    execute(); // Ejecutar después del cambio
                  }}
                  value={shape.shadowOpacity}
                />
              </Input.withPause>
            </Input.Grid>
          </Input.Container>
        </div>
      </Valid>
      <Separator />

      <ExportShape />

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
