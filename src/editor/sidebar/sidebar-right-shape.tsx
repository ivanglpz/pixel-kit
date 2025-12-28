/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { Valid } from "@/components/valid";
import { IPhoto } from "@/db/schemas/types";
import {
  SHAPE_SELECTED_ATOM,
  SHAPE_UPDATE_ATOM,
  UpdatableKeys,
} from "@/editor/states/shape";
import { uploadPhoto } from "@/services/photo";
import { fetchListPhotosProject } from "@/services/photos";
import { css } from "@stylespixelkit/css";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PrimitiveAtom, useAtomValue, useSetAtom } from "jotai";
import { LineCap, LineJoin } from "konva/lib/Shape";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Blend,
  Brush,
  Clipboard,
  Columns,
  CornerDownLeft,
  CornerDownRight,
  CornerRightDown,
  CornerUpLeft,
  CornerUpRight,
  DropletOff,
  Expand,
  File,
  ImageIcon,
  Layout,
  MoveHorizontal,
  MoveVertical,
  PenTool,
  Ruler,
  Scaling,
  Sliders,
  Smile,
  Square,
  SquareDashed,
} from "lucide-react";
import React, { ChangeEvent, ReactNode, useRef, useState } from "react";
import { toast } from "sonner";
import { Button, ButtonBase } from "../components/button";
import { Dialog } from "../components/dialog";
import { Input } from "../components/input";
import { ListIcons } from "../components/list-icons";
import { Loading } from "../components/loading";
import { constants } from "../constants/color";
import { fontFamilyOptions, fontWeightOptions } from "../constants/fonts";
import { useAutoSave } from "../hooks/useAutoSave";
import {
  AlignItems,
  FlexDirection,
  FlexWrap,
  JustifyContent,
} from "../shapes/layout-flex";
import { ShapeBase } from "../shapes/types/shape.base";
import { ShapeState } from "../shapes/types/shape.state";
import { PROJECT_ID_ATOM } from "../states/projects";

import { useDelayedExecutor } from "../hooks/useDelayExecutor";
import { UPDATE_UNDO_REDO } from "../states/undo-redo";
import { getObjectUrl } from "../utils/getObjectUrl";
import { SVG } from "../utils/svg";
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
  shape: ShapeState;
}

const LayoutGrid: React.FC<LayoutGridProps> = ({ shape }) => {
  const flexDirection = useAtomValue(shape.flexDirection);
  const justifyContent = useAtomValue(shape.justifyContent);
  const alignItems = useAtomValue(shape.alignItems);
  const spHook = useShapeUpdate();

  const onLayoutChange = (justify: JustifyContent, align: AlignItems) => {
    spHook("justifyContent", justify);
    spHook("alignItems", align);
  };

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

export const useShapeUpdate = () => {
  const update = useSetAtom(SHAPE_UPDATE_ATOM);
  const { debounce } = useAutoSave();
  const setUpdateUndoRedo = useSetAtom(UPDATE_UNDO_REDO);

  const debounceControl = useDelayedExecutor({
    callback: () => {
      setUpdateUndoRedo();
      debounce.execute();
    },
    timer: 500, // opcional
  });

  return <K extends keyof ShapeState>(
    type: UpdatableKeys,
    value: Omit<ShapeBase[K], "id" | "tool" | "children" | "parentId">
  ) => {
    update({ type, value });
    debounceControl.execute();
  };
};

const ICON_SHAPE = {
  width: MoveHorizontal,
  height: MoveVertical,
  isLayout: Layout,
  isAllPadding: Sliders,
  isAllBorderRadius: Sliders,
  brush: Brush,
  penTool: PenTool,
  ruler: Ruler,
};
type ShapeAtomButtonProps = {
  atomo: PrimitiveAtom<boolean>;
  iconType: keyof typeof ICON_SHAPE;
  type: UpdatableKeys;
};
const ShapeAtomButton = ({ atomo, type, iconType }: ShapeAtomButtonProps) => {
  const value = useAtomValue(atomo);
  const spHook = useShapeUpdate();

  const Icon = ICON_SHAPE[iconType];
  return (
    <button
      onClick={() => {
        spHook(type, !value);
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
        backgroundColor: value
          ? constants.theme.colors.background
          : "transparent",
        borderColor: value ? constants.theme.colors.primary : "transparent",
      }}
    >
      <Icon
        size={constants.icon.size}
        color={
          value ? constants.theme.colors.primary : constants.theme.colors.white
        }
        strokeWidth={constants.icon.strokeWidth}
      />
    </button>
  );
};

const ICONS_FLEX = {
  ArrowDown: ArrowDown,
  ArrowRight: ArrowRight,
};

const ShapeAtomButtonFlex = ({
  atomo,
  iconType,
  direction,
  type,
}: {
  atomo: PrimitiveAtom<FlexDirection>;
  direction: FlexDirection;
  iconType: keyof typeof ICONS_FLEX;
  type: UpdatableKeys;
}) => {
  const value = useAtomValue(atomo);
  const Icon = ICONS_FLEX[iconType];
  const isValid = value === direction;
  const spHook = useShapeUpdate();

  return (
    <button
      onClick={() => {
        spHook(type, direction);
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
        backgroundColor: isValid
          ? constants.theme.colors.background
          : "transparent",
        borderColor: isValid ? constants.theme.colors.primary : "transparent",
      }}
    >
      <Icon
        size={constants.icon.size}
        color={
          isValid
            ? constants.theme.colors.primary
            : constants.theme.colors.white
        }
        strokeWidth={constants.icon.strokeWidth}
      />
    </button>
  );
};

const ICONS_FLEXWRAP = {
  CornerRightDown: CornerRightDown,
};
const ShapeAtomButtonFlexWrap = ({
  atomo,
  iconType,
}: {
  atomo: PrimitiveAtom<FlexWrap>;
  iconType: keyof typeof ICONS_FLEXWRAP;
}) => {
  const value = useAtomValue(atomo);
  const Icon = ICONS_FLEXWRAP[iconType];
  const isValid = value === "wrap";
  const spHook = useShapeUpdate();

  return (
    <button
      onClick={() => {
        spHook("flexWrap", value === "wrap" ? "nowrap" : "wrap");
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
        backgroundColor: isValid
          ? constants.theme.colors.background
          : "transparent",
        borderColor: isValid ? constants.theme.colors.primary : "transparent",
      }}
    >
      <Icon
        size={constants.icon.size}
        color={
          isValid
            ? constants.theme.colors.primary
            : constants.theme.colors.white
        }
        strokeWidth={constants.icon.strokeWidth}
      />
    </button>
  );
};

type ShapeAtomButtonStrokeProps = {
  shape: ShapeState;
  type: keyof typeof ICON_SHAPE;
  values: [LineJoin, LineCap];
};

export const ShapeAtomButtonStroke = ({
  shape,
  type,
  values = ["round", "round"],
}: ShapeAtomButtonStrokeProps) => {
  const lineJoin = useAtomValue(shape.lineJoin);
  const lineCap = useAtomValue(shape.lineCap);
  const spHook = useShapeUpdate();

  const Icon = ICON_SHAPE[type];
  const isValid = lineJoin === values[0] && lineCap === values[1];
  return (
    <button
      onClick={() => {
        if (values.length <= 0) return;
        spHook("lineJoin", values[0]);
        spHook("lineCap", values[1]);
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
        backgroundColor: isValid
          ? constants.theme.colors.background
          : "transparent",
        borderColor: isValid ? constants.theme.colors.primary : "transparent",
      }}
    >
      <Icon
        size={constants.icon.size}
        color={
          isValid
            ? constants.theme.colors.primary
            : constants.theme.colors.white
        }
        strokeWidth={constants.icon.strokeWidth}
      />
    </button>
  );
};
type ShapeIsAllPaddingProps = {
  shape: ShapeState;
  isGlobalUpdate?: boolean;
};
type KeyShapes = keyof Omit<
  ShapeState,
  "id" | "tool" | "children" | "parentId"
>;
const paddings: KeyShapes[] = [
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
];
const ShapePaddings = ({ shape }: ShapeIsAllPaddingProps) => {
  const isAllPadding = useAtomValue(shape.isAllPadding);

  if (!isAllPadding) return null;
  return (
    <div
      className={css({
        display: "grid",
        flexDirection: "column",
        gap: "md",
        gridTemplateColumns: "2",
      })}
    >
      {paddings.map((e) => {
        return (
          <Input.Container key={`padding-${e}`}>
            <Input.Grid>
              <Input.IconContainer>
                <ArrowUp size={constants.icon.size} />
              </Input.IconContainer>
              <Input.withPause>
                <Input.withChange shape={shape} type={e}>
                  <Input.Number min={0} max={9999} step={1} />
                </Input.withChange>
              </Input.withPause>
            </Input.Grid>
          </Input.Container>
        );
      })}
    </div>
  );
};

export const ShapeInputColor = ({
  shape,
  type,
  isGlobalUpdate = true,
}: ShapeIsAllPaddingProps & { type: KeyShapes }) => {
  const atom = shape[type] as PrimitiveAtom<string>;
  const value = useAtomValue(atom);
  const spHook = useShapeUpdate();

  const handleCopy = async () => {
    try {
      const color =
        value === "transparent" ? "transparent" : `#${value.replace(/#/, "")}`;

      await navigator.clipboard.writeText(color);
      toast.success("Color copied to clipboard");
    } catch {
      toast.error("Failed to copy color");
    }
  };

  const handleTransparent = () => {
    spHook(type, "transparent");
  };

  const label =
    value === "transparent"
      ? "Transparent"
      : `#${value?.replace(/#/, "") ?? "ffffff"}`;

  return (
    <>
      <Input.Container>
        <Input.Grid>
          <Input.IconContainer>
            <Input.withChange
              shape={shape}
              type={type}
              isGlobalUpdate={isGlobalUpdate}
            >
              <Input.Color id={`pixel-kit-${type}`} />
            </Input.withChange>
          </Input.IconContainer>

          <section className="flex flex-row justify-between items-center gap-2">
            <label htmlFor={`pixel-kit-${type}`}>
              <Input.Label text={label} />
            </label>
            <div className="flex flex-row justify-between items-center gap-2">
              <button type="button" onClick={handleCopy}>
                <Clipboard size={constants.icon.size} />
              </button>

              <button type="button" onClick={handleTransparent}>
                <DropletOff size={constants.icon.size} />
              </button>
            </div>
          </section>
        </Input.Grid>
      </Input.Container>
    </>
  );
};

const ShapeIsAllPadding = ({ shape }: ShapeIsAllPaddingProps) => {
  return (
    <Input.Container>
      <Input.Grid>
        <Input.IconContainer>
          <Expand size={constants.icon.size} />
        </Input.IconContainer>
        <ShapeShowAtomProvider atomo={shape.isAllPadding} ctx={(e) => e}>
          <Input.withPause>
            <Input.withChange shape={shape} type="padding">
              <Input.Number min={0} max={9999} step={1} />
            </Input.withChange>
          </Input.withPause>
        </ShapeShowAtomProvider>
        <ShapeShowAtomProvider atomo={shape.isAllPadding} ctx={(e) => !e}>
          <Input.Label text="Mixed" />
        </ShapeShowAtomProvider>
      </Input.Grid>
    </Input.Container>
  );
};

type ShapeShowAtomProviderProps = {
  atomo: ShapeAtomButtonProps["atomo"];
  children: ReactNode;
  ctx: (value: boolean) => boolean;
};

const ShapeShowAtomProvider = ({
  atomo,
  children,
  ctx,
}: ShapeShowAtomProviderProps) => {
  const value = useAtomValue(atomo);
  if (ctx(value)) return null;
  return <>{children}</>;
};

export const LayoutShapeConfig = () => {
  const [showIcons, setshowIcons] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const spHook = useShapeUpdate();
  const { shape, count } = useAtomValue(SHAPE_SELECTED_ATOM);
  const [type, setType] = useState<"UPLOAD" | "CHOOSE">("UPLOAD");
  const PROJECT_ID = useAtomValue(PROJECT_ID_ATOM);
  const [photoUpload, setPhotoUpload] = useState<File | null>(null);
  const [photoChoose, setPhotocChoose] = useState<Omit<
    IPhoto,
    "createdBy" | "folder" | "projectId"
  > | null>(null);

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
      spHook("image", {
        height: values.height,
        name: values.name,
        width: values.width,
        src: values.url,
      });
      if (type === "UPLOAD") {
        QueryListPhotos.refetch();
      }
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
      spHook("image", {
        height: img.height,
        name: svgName,
        width: img.width,
        src: SVG.Encode(svgString),
      });
    };
    img.src = SVG.Encode(svgString);
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

  const handleResetDialogImage = () => {
    setType("UPLOAD");
    setPhotoUpload(null);
    setPhotocChoose(null);
    setShowImage(false);
  };

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
                        alt={e?.name.slice(0, 4)}
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
      {/* SHAPE PROPS FIELDS */}
      {/* SHAPE PROPS FIELDS */}
      {/* SHAPE PROPS FIELDS */}
      {/* SHAPE PROPS FIELDS */}

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
                <Input.withChange shape={shape} type="x">
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
              <Input.withPause>
                <Input.withChange shape={shape} type="y">
                  <Input.Number step={1} />
                </Input.withChange>
              </Input.withPause>
            </Input.Grid>
          </Input.Container>
        </div>
      </section>
      <Separator />

      <section className={commonStyles.container}>
        <header className="flex flex-row justify-between items-center">
          <p className={commonStyles.sectionTitle}>Dimensions</p>

          <div className="flex flex-row gap-2">
            <ShapeAtomButton
              iconType="width"
              type="fillContainerWidth"
              atomo={shape.fillContainerWidth}
            />
            <ShapeAtomButton
              iconType="height"
              type="fillContainerHeight"
              atomo={shape.fillContainerHeight}
            />
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
              </Input.IconContainer>
              <Input.withPause>
                <Input.withChange shape={shape} type="width">
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
                  H
                </p>
              </Input.IconContainer>
              <Input.withPause>
                <Input.withChange shape={shape} type="height">
                  <Input.Number step={1} />
                </Input.withChange>
              </Input.withPause>
            </Input.Grid>
          </Input.Container>
        </div>
      </section>

      <Separator />

      {shape.tool === "FRAME" ? (
        <>
          <section className={commonStyles.container}>
            <SectionHeader title="Layouts">
              <ShapeAtomButton
                iconType="isLayout"
                type="isLayout"
                atomo={shape.isLayout}
              />
            </SectionHeader>
            <ShapeShowAtomProvider atomo={shape.isLayout} ctx={(e) => !e}>
              <div
                className={css({
                  display: "flex",
                  flexDirection: "column",
                  gap: "md",
                })}
              >
                <div className={commonStyles.twoColumnGrid}>
                  <LayoutGrid shape={shape} />
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
                      <ShapeAtomButtonFlex
                        atomo={shape.flexDirection}
                        iconType="ArrowDown"
                        type="flexDirection"
                        direction="column"
                      />
                      <ShapeAtomButtonFlex
                        atomo={shape.flexDirection}
                        iconType="ArrowRight"
                        type="flexDirection"
                        direction="row"
                      />
                      <ShapeAtomButtonFlexWrap
                        atomo={shape.flexWrap}
                        iconType="CornerRightDown"
                      />
                    </div>

                    <Input.Container>
                      <Input.Grid>
                        <Input.IconContainer>
                          <Columns size={constants.icon.size} />
                        </Input.IconContainer>
                        <Input.withPause>
                          <Input.withChange shape={shape} type="gap">
                            <Input.Number min={0} max={9999} step={1} />
                          </Input.withChange>
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
                  <ShapeIsAllPadding shape={shape} />
                  <ShapeAtomButton
                    atomo={shape.isAllPadding}
                    iconType="isAllPadding"
                    type="isAllPadding"
                  />
                </div>
                {/* Botón toggle para padding individual */}
              </div>

              {/* Individual Padding Controls */}
              <ShapePaddings shape={shape} />
            </ShapeShowAtomProvider>
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
                <Input.withChange shape={shape} type="opacity">
                  <Input.Number min={0} max={1} step={0.1} />
                </Input.withChange>
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
                    <ShapeShowAtomProvider
                      atomo={shape.isAllBorderRadius}
                      ctx={(e) => e}
                    >
                      <Input.withChange shape={shape} type="borderRadius">
                        <Input.Number min={0} max={9999} step={1} />
                      </Input.withChange>
                    </ShapeShowAtomProvider>
                    <ShapeShowAtomProvider
                      atomo={shape.isAllBorderRadius}
                      ctx={(e) => !e}
                    >
                      <Input.Label text="Mixed" />
                    </ShapeShowAtomProvider>
                  </Input.Grid>
                </Input.Container>
                <ShapeAtomButton
                  iconType="isAllBorderRadius"
                  type="isAllBorderRadius"
                  atomo={shape.isAllBorderRadius}
                />
              </div>
            </div>
            <ShapeShowAtomProvider
              atomo={shape.isAllBorderRadius}
              ctx={(value) => !value}
            >
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
                      <Input.withChange
                        shape={shape}
                        type="borderTopLeftRadius"
                      >
                        <Input.Number min={0} max={9999} step={1} />
                      </Input.withChange>
                    </Input.withPause>
                  </Input.Grid>
                </Input.Container>
                <Input.Container>
                  <Input.Grid>
                    <Input.IconContainer>
                      <CornerUpRight size={constants.icon.size} />
                    </Input.IconContainer>
                    <Input.withPause>
                      <Input.withChange
                        shape={shape}
                        type="borderTopRightRadius"
                      >
                        <Input.Number min={0} max={9999} step={1} />
                      </Input.withChange>
                    </Input.withPause>
                  </Input.Grid>
                </Input.Container>
                <Input.Container>
                  <Input.Grid>
                    <Input.IconContainer>
                      <CornerDownLeft size={constants.icon.size} />
                    </Input.IconContainer>
                    <Input.withPause>
                      <Input.withChange
                        shape={shape}
                        type="borderBottomLeftRadius"
                      >
                        <Input.Number min={0} max={9999} step={1} />
                      </Input.withChange>
                    </Input.withPause>
                  </Input.Grid>
                </Input.Container>
                <Input.Container>
                  <Input.Grid>
                    <Input.IconContainer>
                      <CornerDownRight size={constants.icon.size} />
                    </Input.IconContainer>
                    <Input.withPause>
                      <Input.withChange
                        shape={shape}
                        type="borderBottomRightRadius"
                      >
                        <Input.Number min={0} max={9999} step={1} />
                      </Input.withChange>
                    </Input.withPause>
                  </Input.Grid>
                </Input.Container>
              </div>
            </ShapeShowAtomProvider>
          </>
        ) : null}
      </section>

      <Separator />

      <Valid isValid={shape.tool === "TEXT"}>
        <section className={commonStyles.container}>
          <SectionHeader title="Typography" />

          <Input.Container>
            <Input.withChange shape={shape} type="fontFamily">
              <Input.Select options={fontFamilyOptions} />
            </Input.withChange>
          </Input.Container>

          <div className={commonStyles.twoColumnGrid}>
            <Input.Container>
              <Input.withChange shape={shape} type="fontWeight">
                <Input.Select options={fontWeightOptions} />
              </Input.withChange>
            </Input.Container>
            <Input.Container>
              <Input.Grid>
                <Input.IconContainer>
                  <Scaling size={constants.icon.size} />
                </Input.IconContainer>
                <Input.withPause>
                  <Input.withChange shape={shape} type="fontSize">
                    <Input.Number min={4} max={180} step={4} />
                  </Input.withChange>
                </Input.withPause>
              </Input.Grid>
            </Input.Container>
          </div>
          <div className={css({ gridColumn: 2, gridRow: 3 })}>
            <Input.Container>
              <Input.withPause>
                <Input.withChange shape={shape} type="text">
                  <Input.TextArea rows={5} />
                </Input.withChange>
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
        </SectionHeader>
        {shape.tool !== "ICON" ? (
          <ShapeInputColor shape={shape} type="fillColor" />
        ) : null}
      </section>

      {shape.tool !== "TEXT" ? (
        <>
          <Separator />

          <SectionHeader title="Stroke"></SectionHeader>

          <section className={commonStyles.container}>
            <ShapeInputColor shape={shape} type="strokeColor" />
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
                    <Input.withChange shape={shape} type="strokeWidth">
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
                    <Input.withChange shape={shape} type="dash">
                      <Input.Number min={0} step={1} />
                    </Input.withChange>
                  </Input.withPause>
                </Input.Grid>
              </Input.Container>
            ) : null}
          </section>
        </>
      ) : null}

      <Separator />

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
                <Input.withChange shape={shape} type="shadowOffsetX">
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
                <Input.withChange shape={shape} type="shadowOffsetY">
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
                <Input.withChange shape={shape} type="shadowBlur">
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
                <Input.withChange shape={shape} type="shadowOpacity">
                  <Input.Number min={0} max={1} step={0.1} />
                </Input.withChange>
              </Input.withPause>
            </Input.Grid>
          </Input.Container>
        </div>
      </section>

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
