/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { Valid } from "@/components/valid";
import { IPhoto } from "@/db/schemas/types";
import { IShape } from "@/editor/shapes/type.shape";
import { SHAPE_SELECTED_ATOM, SHAPE_UPDATE_ATOM } from "@/editor/states/shape";
import { uploadPhoto } from "@/services/photo";
import { fetchListPhotosProject } from "@/services/photos";
import { css } from "@stylespixelkit/css";
import { useMutation, useQuery } from "@tanstack/react-query";
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
  File,
  ImageIcon,
  Layout,
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
import React, { ChangeEvent, ReactNode, useRef, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Button, ButtonBase } from "../components/button";
import { Dialog } from "../components/dialog";
import { Input } from "../components/input";
import { ListIcons } from "../components/list-icons";
import { Loading } from "../components/loading";
import { constants } from "../constants/color";
import { DIMENSIONS_SHAPE } from "../constants/dimensions";
import { fontFamilyOptions, fontWeightOptions } from "../constants/fonts";
import { useAutoSave } from "../hooks/useAutoSave";
import { useDelayedExecutor } from "../hooks/useDelayExecutor";
import { AlignItems, JustifyContent } from "../shapes/layout-flex";
import { PROJECT_ID_ATOM } from "../states/projects";
import { UPDATE_UNDO_REDO } from "../states/undo-redo";
import { getObjectUrl } from "../utils/getObjectUrl";
import { ExportShape } from "./export-shape";

export const calculateScale = (
  originalWidth: number,
  originalHeight: number,
  containerWidth: number,
  containerHeight: number
): number => {
  const widthScale: number = containerWidth / originalWidth;
  const heightScale: number = containerHeight / originalHeight;
  return Math.min(widthScale, heightScale);
};

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
          borderColor: "gray.700",
          backgroundColor: "gray.800",
        },
        backgroundColor: "gray.100",
        borderColor: "gray.200",
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
                borderColor: "gray.600",
                backgroundColor: "gray.800",
              },
              backgroundColor: "gray.100",
              borderColor: "gray.200",
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

export const SectionHeader = ({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
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
      {children}
    </div>
  </div>
);

export const LayoutShapeConfig = () => {
  const [showIcons, setshowIcons] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { shape, count } = useAtomValue(SHAPE_SELECTED_ATOM);
  const shapeUpdate = useSetAtom(SHAPE_UPDATE_ATOM);
  const setUpdateUndoRedo = useSetAtom(UPDATE_UNDO_REDO);
  const [type, setType] = useState<"UPLOAD" | "CHOOSE">("UPLOAD");
  const [D_TYPE, SET_DTYPE] = useState<keyof typeof DIMENSIONS_SHAPE>("FIXED");
  const { debounce } = useAutoSave();
  const PROJECT_ID = useAtomValue(PROJECT_ID_ATOM);
  const [photoUpload, setPhotoUpload] = useState<File | null>(null);
  const [photoChoose, setPhotocChoose] = useState<Omit<
    IPhoto,
    "createdBy" | "folder" | "projectId"
  > | null>(null);

  const { execute, isRunning } = useDelayedExecutor({
    callback: () => {
      setUpdateUndoRedo();
      debounce.execute();
    },
    timer: 500,
  });

  const QueryListPhotos = useQuery({
    queryKey: ["list_photos_project", PROJECT_ID],
    queryFn: async () => {
      if (!PROJECT_ID) {
        throw new Error("Project ID is require to get List photos");
      }
      return fetchListPhotosProject(PROJECT_ID);
    },
  });

  const mutation = useMutation({
    mutationKey: ["upload_image", type, photoUpload, photoChoose],
    mutationFn: async (): Promise<
      Pick<IPhoto, "name" | "width" | "height" | "url">
    > => {
      if (type === "UPLOAD") {
        const myImage = photoUpload;

        if (!myImage) {
          throw new Error("Please upload a photo from your device");
        }

        const formData = new FormData();
        formData.append("image", myImage); // usar el mismo nombre 'images'
        formData.append("projectId", `${PROJECT_ID}`); // usar el mismo nombre 'images'

        const response = await uploadPhoto(formData);
        return response;
      }
      if (!photoChoose) {
        throw new Error("Please choose an existing photo");
      }
      return photoChoose;
    },
    onSuccess: (values) => {
      if (type === "UPLOAD") {
        if (!shape) return;
        const scale: number = calculateScale(
          values.width,
          values.height,
          shape.width ?? 500,
          shape.height ?? 500
        );
        const newWidth: number = values.width * scale;
        const newHeight: number = values.height * scale;
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
                src: values?.url,
                width: values.width,
                height: values.height,
                name: values?.name,
              },
            },
            ...(shape.fills || []),
          ],
        });
        execute();
        handleResetDialogImage();
        QueryListPhotos.refetch();

        return;
      }
      if (!shape) return;
      const scale: number = calculateScale(
        values.width,
        values.height,
        shape.width ?? 500,
        shape.height ?? 500
      );
      const newWidth: number = values.width * scale;
      const newHeight: number = values.height * scale;
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
              src: values?.url,
              width: values.width,
              height: values.height,
              name: values?.name,
            },
          },
          ...(shape.fills || []),
        ],
      });

      execute();
      handleResetDialogImage();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  if (shape === null) return null;

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
      execute();
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
      event.target.value = "";
      return;
    }

    setPhotoUpload(file);

    event.target.value = "";
  };

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
    execute();
  };

  const handleFillColorChange = (index: number, color: string) => {
    const newFills = [...shape.fills];
    newFills[index].color = color;
    shapeUpdate({ fills: newFills });
    execute();
  };

  const handleFillVisibilityToggle = (index: number) => {
    const newFills = [...shape.fills];
    newFills[index].visible = !newFills[index].visible;
    shapeUpdate({ fills: newFills });
    execute();
  };

  const handleFillRemove = (index: number) => {
    const newFills = [...shape.fills];
    newFills.splice(index, 1);
    shapeUpdate({ fills: newFills });
    execute();
  };

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
    execute();
  };

  const handleStrokeColorChange = (index: number, color: string) => {
    const newStrokes = [...shape.strokes];
    newStrokes[index].color = color;
    shapeUpdate({ strokes: newStrokes });
    execute();
  };

  const handleStrokeVisibilityToggle = (index: number) => {
    const newStrokes = [...shape.strokes];
    newStrokes[index].visible = !newStrokes[index].visible;
    shapeUpdate({ strokes: newStrokes });
    execute();
  };

  const handleStrokeRemove = (index: number) => {
    const newStrokes = [...shape.strokes];
    newStrokes.splice(index, 1);
    shapeUpdate({ strokes: newStrokes });
    execute();
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
    execute();
  };

  const handleEffectColorChange = (index: number, color: string) => {
    const newEffects = [...(shape.effects ?? [])];
    newEffects[index].color = color;
    shapeUpdate({ effects: newEffects });
    execute();
  };

  const handleEffectVisibilityToggle = (index: number) => {
    const newEffects = [...(shape.effects ?? [])];
    newEffects[index].visible = !newEffects[index].visible;
    shapeUpdate({ effects: newEffects });
    execute();
  };

  const handleEffectRemove = (index: number) => {
    const newEffects = [...(shape.effects ?? [])];
    newEffects.splice(index, 1);
    shapeUpdate({ effects: newEffects });
    execute();
  };

  const handleLineStyleChange = (
    lineJoin: IShape["lineJoin"],
    lineCap: IShape["lineCap"]
  ) => {
    shapeUpdate({ lineJoin, lineCap });
    execute();
  };

  const handleResetDialogImage = () => {
    setType("UPLOAD");
    setPhotoUpload(null);
    setPhotocChoose(null);
    setShowImage(false);
  };
  console.log(shape);

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
      <Dialog.Provider
        visible={showImage}
        onClose={() => {
          if (mutation.isPending) return;
          setShowImage(false);
        }}
      >
        <Dialog.Container fullWidth fullHeight>
          <Dialog.Header>
            <p
              className={css({
                fontWeight: "bold",
              })}
            >
              Image
            </p>
            <Dialog.Close
              onClose={() => {
                if (mutation.isPending) return;
                setShowImage(false);
              }}
            />
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
              <ButtonBase
                variant={type === "UPLOAD" ? "primary" : "secondary"}
                onClick={() => {
                  setType("UPLOAD");
                }}
              >
                Upload
              </ButtonBase>
              <ButtonBase
                variant={type === "CHOOSE" ? "primary" : "secondary"}
                onClick={() => {
                  setType("CHOOSE");
                }}
              >
                Choose
              </ButtonBase>
            </header>
            {type === "UPLOAD" ? (
              <section
                className={css({
                  display: "grid",
                  gridTemplateRows: "1fr",
                  gridTemplateColumns: "1fr",
                  flex: 1,
                  minHeight: 0, // evita colapso
                })}
              >
                <div
                  className={css({
                    backgroundColor: "gray.150",
                    _dark: {
                      backgroundColor: "gray.750",
                    },
                    display: "flex",
                    flex: 1,
                    minHeight: 0,
                    position: "relative",
                    justifyContent: "center",
                    alignItems: "center",
                  })}
                >
                  {photoUpload ? (
                    <img
                      src={getObjectUrl(photoUpload)}
                      alt="preview-app"
                      className={css({
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      })}
                    />
                  ) : null}
                  <Button.Secondary
                    style={{
                      position: "absolute",
                      backgroundColor: "black",
                      color: "white",
                    }}
                    onClick={() => {
                      inputRef.current?.click();
                    }}
                  >
                    {photoUpload ? "Change image" : "Choose from device"}
                  </Button.Secondary>
                </div>
              </section>
            ) : null}
            {type === "CHOOSE" ? (
              <section
                className={css({
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)", // válido en PandaCSS
                  gap: "4", // usa tokens definidos en tu config
                  flex: 1,
                  minHeight: 0,
                  overflowY: "auto",
                  overflowX: "hidden",
                  gridAutoRows: "120px",
                })}
              >
                {QueryListPhotos?.data?.map((e) => {
                  return (
                    <button
                      className={css({
                        backgroundColor: "gray.50",
                        // _dark: {
                        //   backgroundColor: "gray.600",
                        // },
                        display: "flex",
                        flexDirection: "column",
                        borderWidth: 2,
                        // borderColor: "gray.150",
                        _dark: {
                          borderColor:
                            photoChoose?._id === e?._id
                              ? "primary"
                              : "gray.450",
                          // borderColor: "gray.450",
                          backgroundColor: "gray.700",
                        },
                        borderRadius: "lg",
                        cursor: "pointer",
                        borderColor:
                          photoChoose?._id === e?._id ? "primary" : "gray.150",
                      })}
                      onClick={() => {
                        setPhotocChoose(e);
                      }}
                    >
                      <img
                        src={e?.url}
                        alt={e?.name}
                        className={css({
                          height: "100%",
                          width: "100%",
                          objectFit: "cover",
                          borderRadius: "lg",
                        })}
                      />
                    </button>
                  );
                })}
              </section>
            ) : null}

            <footer
              className={css({
                display: "flex",
                flexDirection: "row",
                gap: "lg",
                justifyContent: "end",
              })}
            >
              <Button.Secondary
                onClick={() => {
                  if (mutation.isPending) return;
                  handleResetDialogImage();
                }}
              >
                Cancel
              </Button.Secondary>
              <Button.Primary
                onClick={() => {
                  if (mutation.isPending) return;
                  mutation.mutate();
                }}
              >
                {mutation.isPending ? (
                  <Loading color={constants.theme.colors.black} />
                ) : (
                  <>
                    <File size={constants.icon.size} /> Upload
                  </>
                )}
              </Button.Primary>
            </footer>
          </section>
        </Dialog.Container>
      </Dialog.Provider>

      <section className={commonStyles.container}>
        <div
          className={css({
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          })}
        >
          <p
            className={commonStyles.sectionTitle}
          >{`[${count}] Shap${count > 1 ? "es" : "e"} `}</p>
          {isRunning ? (
            <div className="lds-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          ) : null}
        </div>

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
              </Input.IconContainer>
              <Input.withPause>
                <Input.Number
                  step={1}
                  value={shape.x}
                  onChange={(v) => {
                    shapeUpdate({ x: v });
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
                  Y
                </p>
              </Input.IconContainer>
              <Input.withPause>
                <Input.Number
                  step={1}
                  value={shape.y}
                  onChange={(v) => {
                    shapeUpdate({ y: v });
                    execute();
                  }}
                />
              </Input.withPause>
            </Input.Grid>
          </Input.Container>
        </div>
      </section>
      <Separator />

      <section className={commonStyles.container}>
        <header className="flex flex-row justify-between items-center">
          <p className={commonStyles.sectionTitle}>Dimensions</p>
          {/* <Input.Container>
            <Input.withPause>
              <Input.Select
                value={D_TYPE}
                options={Object.values(DIMENSIONS_SHAPE).map((e, index) => {
                  return {
                    id: `dimension-${index}`,
                    label: e.label,
                    value: e.value,
                  };
                })}
                onChange={(e) => SET_DTYPE(e)}
              />
            </Input.withPause>
          </Input.Container> */}

          <div className="flex flex-row gap-2">
            <button
              onClick={() => {
                shapeUpdate({
                  fillContainerWidth: !shape.fillContainerWidth,
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
                backgroundColor: shape.fillContainerWidth
                  ? constants.theme.colors.background
                  : "transparent",
                borderColor: shape.fillContainerWidth
                  ? constants.theme.colors.primary
                  : "transparent",
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
            <button
              onClick={() => {
                shapeUpdate({
                  fillContainerHeight: !shape.fillContainerHeight,
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
                backgroundColor: shape.fillContainerHeight
                  ? constants.theme.colors.background
                  : "transparent",
                borderColor: shape.fillContainerHeight
                  ? constants.theme.colors.primary
                  : "transparent",
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
        </header>

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
                  value={Number(shape.width || 0)}
                  onChange={(v) => {
                    shapeUpdate({
                      width: v,
                    });
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
                  step={1}
                  // value={Number(shape.height) || 0}
                  value={Number(shape.height || 0)}
                  onChange={(v) => {
                    shapeUpdate({
                      height: v,
                    });
                    execute();
                  }}
                />
              </Input.withPause>
            </Input.Grid>
          </Input.Container>
        </div>
        {/*
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
        </div> */}
      </section>

      <Separator />

      {shape.tool === "FRAME" ? (
        <>
          <section className={commonStyles.container}>
            <SectionHeader title="Layouts">
              <button
                onClick={() => {
                  shapeUpdate({ isLayout: !shape.isLayout });
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
                  backgroundColor: shape.isLayout
                    ? constants.theme.colors.background
                    : "transparent",
                  borderColor: shape.isLayout
                    ? constants.theme.colors.primary
                    : "transparent",
                }}
              >
                <Layout
                  size={constants.icon.size}
                  color={
                    shape.isLayout
                      ? constants.theme.colors.primary
                      : constants.theme.colors.white
                  }
                  strokeWidth={constants.icon.strokeWidth}
                />
              </button>
            </SectionHeader>

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
                                : "transparent",
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
                                : "transparent",
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
                                : "transparent",
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
                          : "transparent",
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
                    execute();
                  }}
                />
              </Input.withPause>
            </Input.Grid>
          </Input.Container>
        </div>
        {!["TEXT", "ICON", "DRAW"].includes(shape.tool) ? (
          <>
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
                    {!shape.isAllBorderRadius ? (
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
                      isAllBorderRadius: !shape.isAllBorderRadius,
                    });
                    execute();
                  }}
                  style={{
                    backgroundColor: !shape.isAllBorderRadius
                      ? constants.theme.colors.background
                      : "transparent",
                    borderColor: !shape.isAllBorderRadius
                      ? constants.theme.colors.primary
                      : "transparent",
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
          </>
        ) : null}
      </section>

      <Separator />

      <Valid isValid={shape.tool === "TEXT"}>
        <section className={commonStyles.container}>
          <SectionHeader title="Typography" />

          <Input.Container>
            <Input.Select
              value={shape.fontFamily ?? "Roboto"}
              onChange={(e) => {
                shapeUpdate({ fontFamily: e as IShape["fontFamily"] });
                execute();
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
                  execute();
                }}
                options={fontWeightOptions}
              />
            </Input.Container>
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
                      execute();
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
                    execute();
                  }}
                  value={shape.text || ""}
                />
              </Input.withPause>
            </Input.Container>
          </div>
        </section>
        <Separator />
      </Valid>

      <section className={commonStyles.container}>
        <SectionHeader title="Fill">
          {shape.tool === "ICON" ? (
            <button
              className={commonStyles.addButton}
              onClick={() => setshowIcons(true)}
            >
              <Smile size={14} />
            </button>
          ) : null}
          {shape.tool === "IMAGE" ? (
            <button
              className={commonStyles.addButton}
              onClick={() => {
                setShowImage(true);
              }}
            >
              <ImageIcon size={14} />
            </button>
          ) : null}
          <button className={commonStyles.addButton} onClick={handleAddFill}>
            <Plus size={14} />
          </button>
        </SectionHeader>

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
                      backgroundColor: "bg.muted",
                      borderRadius: "md",
                      padding: "md",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderColor: "border.muted",
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
                        borderColor: "border.muted",
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
                <button
                  onClick={() => handleFillVisibilityToggle(index)}
                  className={commonStyles.iconButton}
                >
                  {fill.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
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

      {shape.tool !== "TEXT" ? (
        <>
          <Separator />

          <section className={commonStyles.container}>
            <SectionHeader title="Stroke">
              <button
                className={commonStyles.addButton}
                onClick={handleAddStroke}
              >
                <Plus size={14} />
              </button>
            </SectionHeader>

            {shape.strokes?.length ? (
              <>
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
                      {stroke.visible ? (
                        <Eye size={14} />
                      ) : (
                        <EyeOff size={14} />
                      )}
                    </button>
                    <button
                      onClick={() => handleStrokeRemove(index)}
                      className={commonStyles.iconButton}
                    >
                      <Minus size={14} />
                    </button>
                  </div>
                ))}

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
                          value={shape.strokeWidth || 0}
                          onChange={(v) => {
                            shapeUpdate({ strokeWidth: v });
                            execute();
                          }}
                        />
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
                          shape.lineJoin === "round" &&
                          shape.lineCap === "round"
                            ? constants.theme.colors.background
                            : "transparent",
                        borderColor:
                          shape.lineJoin === "round" &&
                          shape.lineCap === "round"
                            ? constants.theme.colors.primary
                            : "transparent",
                      }}
                    >
                      <Brush
                        size={constants.icon.size}
                        strokeWidth={constants.icon.strokeWidth}
                        color={
                          shape.lineJoin === "round" &&
                          shape.lineCap === "round"
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
                          shape.lineJoin === "miter" &&
                          shape.lineCap === "round"
                            ? constants.theme.colors.background
                            : "transparent",
                        borderColor:
                          shape.lineJoin === "miter" &&
                          shape.lineCap === "round"
                            ? constants.theme.colors.primary
                            : "transparent",
                      }}
                    >
                      <PenTool
                        size={constants.icon.size}
                        strokeWidth={constants.icon.strokeWidth}
                        color={
                          shape.lineJoin === "miter" &&
                          shape.lineCap === "round"
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
                            : "transparent",
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
                {["FRAME", "IMAGE", "DRAW"].includes(shape.tool) ? (
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
                            execute();
                          }}
                          value={shape.dash || 0}
                        />
                      </Input.withPause>
                    </Input.Grid>
                  </Input.Container>
                ) : null}
              </>
            ) : null}
          </section>
        </>
      ) : null}

      <Separator />

      <section className={commonStyles.container}>
        <SectionHeader title="Effects">
          <button className={commonStyles.addButton} onClick={handleAddEffect}>
            <Plus size={14} />
          </button>
        </SectionHeader>

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
                  Y
                </p>
              </Input.IconContainer>
              <Input.withPause>
                <Input.Number
                  step={1}
                  value={shape.shadowOffsetY}
                  onChange={(e) => {
                    shapeUpdate({ shadowOffsetY: e });
                    execute();
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
                    execute();
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
                    execute();
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
