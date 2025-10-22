import Konva from "konva";
import { getCommonShapeProps } from "../helpers/shape-schema";
import { calculateCoverCrop } from "../shapes/image.shape";
import { IKeyTool } from "../states/tool";
import { UndoShape } from "../states/undo-redo";

type ExcludedKeys = "MOVE" | "ICON";
type ShapeType = Exclude<IKeyTool, ExcludedKeys>; // ["IMAGE", "TEXT", "FRAME"]

export type StageWithContainer = {
  stage: Konva.Stage;
  container: HTMLDivElement;
};

const getChildren = (shape: UndoShape["state"]): UndoShape[] => {
  const c = shape.children;
  return Array.isArray(c) ? c : [];
};

// Crear un FRAME con Rect de fondo y Group para hijos
const createFrameNodes = async (
  shape: UndoShape["state"],
  parent: Konva.Container,
  isRoot = false
): Promise<Konva.Group> => {
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
const fetchAsBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url, { mode: "cors" });
  const blob = await response.blob();

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const loadImageFromBase64 = (
  base64: string,
  width: number,
  height: number
): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.width = width;
    img.height = height;
    img.crossOrigin = "Anonymous";
    img.src = base64;
  });
};

const createNodeFromShape = async (
  shape: UndoShape["state"],
  parent?: Konva.Container,
  isRoot = false
): Promise<Konva.Node> => {
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
  switch (shape.tool) {
    case "ICON": {
      const SHAPE_IMAGE = shape.fills?.find(
        (f) => f.visible && f.type === "image"
      )?.image;

      if (!SHAPE_IMAGE) {
        return new Konva.Image({
          width: shape.width,
          height: shape.height,
          fill: "#fff",
          image: new Image(),
          ...commonProps,
        });
      }

      const CONTENT = "data:image/svg+xml;charset=utf-8,";

      const svgText = decodeURIComponent(SHAPE_IMAGE.src.replace(CONTENT, ""));
      const newSvg = svgText
        .replace(/stroke-width="[^"]*"/g, `stroke-width="${shape.strokeWidth}"`)
        .replace(
          /stroke="currentColor"/g,
          `stroke="${stroke?.color || "#000000"}"`
        );
      const src = CONTENT + encodeURIComponent(newSvg);

      const width = SHAPE_IMAGE.width || shape.width;
      const height = SHAPE_IMAGE.height || shape.height;

      const img = await loadImageFromBase64(src, width, height);

      const cropConfig = calculateCoverCrop(
        SHAPE_IMAGE.width || 0,
        SHAPE_IMAGE.height || 0,
        Number(shape.width),
        Number(shape.height)
      );

      return new Konva.Image({
        image: img,
        crop: cropConfig,
        ...commonProps,
        ...getCommonShapeProps({ shape, fill, shadow }),
      });
    }
    case "IMAGE": {
      try {
        const SHAPE_IMAGE = shape.fills?.find(
          (f) => f.visible && f.type === "image"
        )?.image;

        if (!SHAPE_IMAGE) throw new Error("shape image doesnt exist");

        const src = await fetchAsBase64(SHAPE_IMAGE.src);
        const width = SHAPE_IMAGE.width || shape.width;
        const height = SHAPE_IMAGE.height || shape.height;

        const img = await loadImageFromBase64(src, width, height);

        const cropConfig = calculateCoverCrop(
          SHAPE_IMAGE.width || 0,
          SHAPE_IMAGE.height || 0,
          Number(shape.width),
          Number(shape.height)
        );

        return new Konva.Image({
          image: img,
          crop: cropConfig,
          ...commonProps,
          ...getCommonShapeProps({ shape, fill, shadow, stroke }),
        });
      } catch (err) {
        return new Konva.Image({
          width: shape.width,
          height: shape.height,
          fill: "#fff",
          image: new Image(),
          ...commonProps,
        });
      }
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
const attachShapeRecursively = async (
  shape: UndoShape,
  parent: Konva.Container,
  isRoot = false
): Promise<Konva.Node> => {
  if (shape.tool === "FRAME") {
    return await createFrameNodes(shape.state, parent, isRoot);
  }

  const node = await createNodeFromShape(shape.state, parent, isRoot);
  parent.add(node);

  const children = getChildren(shape.state);
  if (children.length > 0) {
    const containerNode = node instanceof Konva.Group ? node : parent;
    await Promise.all(
      children.map((child) => attachShapeRecursively(child, containerNode))
    );
  }

  return node;
};

// Crear stages para cada top-level shape
export const createStagesFromShapes = async (
  shapes: UndoShape[]
): Promise<StageWithContainer[]> => {
  return Promise.all(
    shapes.map(async (topShape) => {
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

      await attachShapeRecursively(topShape, layer, true);
      layer.draw();

      return { stage, container };
    })
  );
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
