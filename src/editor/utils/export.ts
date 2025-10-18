import Konva from "konva";
import { getCommonShapeProps } from "../helpers/shape-schema";
import { calculateCoverCrop } from "../shapes/image.shape";
import { UndoShape } from "../states/undo-redo";

type ShapeType = "IMAGE" | "TEXT" | "FRAME" | "DRAW";

export type StageWithContainer = {
  stage: Konva.Stage;
  container: HTMLDivElement;
};

const getChildren = (shape: UndoShape["state"]): UndoShape[] => {
  const c = shape.children;
  return Array.isArray(c) ? c : [];
};

// Crear un FRAME con Rect de fondo y Group para hijos
const createFrameNodes = (
  shape: UndoShape["state"],
  parent: Konva.Container,
  isRoot = false
): Konva.Group => {
  // Top-level FRAME empieza en (0,0)
  const x = isRoot ? 0 : shape.x;
  const y = isRoot ? 0 : shape.y;
  const fill = shape.fills?.find((f) => f.visible && f.type === "fill");
  const stroke = shape?.strokes?.filter((e) => e?.visible)?.at(0);
  const shadow = shape?.effects
    ?.filter((e) => e?.visible && e?.type === "shadow")
    .at(0);
  // Rect de fondo (como ShapeBox en React)
  const rect = new Konva.Rect({
    x,
    y,
    // opacity: shape.opacity,
    id: `${shape.id}-bg`,
    ...getCommonShapeProps({ shape, fill, shadow, stroke }),
  });
  parent.add(rect);

  // Grupo principal que contendrá hijos
  const group = new Konva.Group({
    x,
    y,
    id: shape.id,
    rotation: shape.rotation,
    opacity: shape.opacity,
    visible: shape.visible,
    clipX: 0,
    clipY: 0,
    clipWidth: shape.width,
    clipHeight: shape.height,
  });
  parent.add(group);

  // Adjuntar hijos recursivamente, posiciones relativas al padre
  const children = getChildren(shape);
  children.forEach((child) => attachShapeRecursively(child, group));

  return group;
};

const createNodeFromShape = (
  shape: UndoShape["state"],
  parent?: Konva.Container,
  isRoot = false
): Konva.Node => {
  // Si es FRAME
  if (shape.tool === "FRAME" && parent) {
    return createFrameNodes(shape, parent, isRoot);
  }

  const x = isRoot ? 0 : shape.x;
  const y = isRoot ? 0 : shape.y;

  const commonProps = {
    x,
    y,
    rotation: shape.rotation,
    opacity: shape.opacity,
    visible: shape.visible,
    id: shape.id,
  };
  const fill = shape.fills?.find((f) => f.visible && f.type === "fill");
  const stroke = shape?.strokes?.filter((e) => e?.visible)?.at(0);
  const shadow = shape?.effects
    ?.filter((e) => e?.visible && e?.type === "shadow")
    .at(0);
  switch (shape.tool as ShapeType) {
    case "IMAGE": {
      const img = new Image();
      const fillImage = shape.fills?.find(
        (f) => f.visible && f.type === "image"
      )?.image;
      if (fillImage) {
        img.src = fillImage.src;
        img.crossOrigin = "Anonymous";
        img.width = fillImage.width;
        img.height = fillImage.height;
      }

      const cropConfig = calculateCoverCrop(
        fillImage?.width || 0,
        fillImage?.height || 0,
        Number(shape.width),
        Number(shape.height)
      );

      return new Konva.Image({
        image: img,
        crop: cropConfig,
        ...commonProps,
        ...getCommonShapeProps({ shape, fill, shadow, stroke }),
      });
    }
    case "TEXT":
      return new Konva.Text({
        ...commonProps,
        ...getCommonShapeProps({ shape, fill, shadow, stroke }),
      });
    case "DRAW":
      return new Konva.Line({
        ...commonProps,
        ...getCommonShapeProps({ shape, fill, shadow, stroke }),
        lineCap: shape.lineCap,
        lineJoin: shape.lineJoin,
      });
    default:
      return new Konva.Group({
        ...commonProps,
        clipX: 0,
        clipY: 0,
        clipWidth: shape.width,
        clipHeight: shape.height,
      });
  }
};

// Adjuntar un shape y sus hijos recursivamente
const attachShapeRecursively = (
  shape: UndoShape,
  parent: Konva.Container,
  isRoot = false
): Konva.Node => {
  if (shape.tool === "FRAME") {
    return createFrameNodes(shape.state, parent, isRoot);
  }

  const node = createNodeFromShape(shape.state, parent, isRoot);
  parent.add(node);

  const children = getChildren(shape.state);
  if (children.length > 0) {
    const containerNode = node instanceof Konva.Group ? node : parent;
    children.forEach((child) => attachShapeRecursively(child, containerNode));
  }

  return node;
};

// Crear stages para cada top-level shape
export const createStagesFromShapes = (
  shapes: UndoShape[]
): StageWithContainer[] => {
  return shapes.map((topShape) => {
    const container = document.createElement("div");
    container.style.width = `${topShape.state.width}px`;
    container.style.height = `${topShape.state.height}px`;

    const stage = new Konva.Stage({
      container,
      width: Math.max(1, Math.round(topShape.state.width)),
      height: Math.max(1, Math.round(topShape.state.height)),
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    attachShapeRecursively(topShape, layer, true);
    layer.draw();

    return { stage, container };
  });
};

// Exportar y descargar stages
export const exportAndDownloadStages = (
  stages: Konva.Stage[],
  format: "png" | "jpeg" = "png",
  pixelRatio = 2
): void => {
  stages.forEach((stage, index) => {
    const mime = format === "png" ? "image/png" : "image/jpeg";
    const dataURL = stage.toDataURL({ mimeType: mime, pixelRatio, quality: 1 });

    const link = document.createElement("a");
    link.download = `shape-${index + 1}.${format}`;
    link.href = dataURL;
    link.click();
  });
};
