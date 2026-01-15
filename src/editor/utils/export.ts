import { Getter } from "jotai";
import Konva from "konva";
import { getCommonShapeProps } from "../helpers/shape-schema";
import { ShapeState } from "../shapes/types/shape.state";
import { ALL_SHAPES } from "../states/shapes";
import { calculateCoverCrop } from "./crop";

/* =======================
   Types
======================= */

export type StageWithContainer = {
  stage: Konva.Stage;
  container: HTMLDivElement;
};

export type CTX_EXP = {
  get: Getter;
};

/* =======================
   Helpers
======================= */

const PLACEHOLDER_SRC = "/placeholder.svg";
const PLACEHOLDER_SIZE = 1200;

const getChildren = (shape: ShapeState, ctx: CTX_EXP): ALL_SHAPES[] =>
  Array.isArray(ctx.get(shape.children)) ? ctx.get(shape.children) : [];

const fetchAsBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url, { mode: "cors" });
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
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
): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.width = width;
    img.height = height;
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = base64;
  });

/* =======================
   Frame
======================= */

const createFrameNodes = async (
  shape: ShapeState,
  parent: Konva.Container,
  ctx: CTX_EXP,
  IS_ROOT = false
): Promise<Konva.Group> => {
  const x = IS_ROOT ? 0 : ctx.get(shape.x);
  const y = IS_ROOT ? 0 : ctx.get(shape.y);

  const rect = new Konva.Rect({
    x,
    y,
    id: `${shape.id}-bg`,
    ...getCommonShapeProps(shape, ctx),
  });

  parent.add(rect);

  const group = new Konva.Group({
    x,
    y,
    id: shape.id,
    rotation: ctx.get(shape.rotation),
    opacity: ctx.get(shape.opacity),
    visible: ctx.get(shape.visible),
    clipX: 0,
    clipY: 0,
    clipWidth: ctx.get(shape.width),
    clipHeight: ctx.get(shape.height),
  });

  parent.add(group);

  await Promise.all(
    getChildren(shape, ctx).map((child) =>
      attachShapeRecursively(child, group, ctx)
    )
  );

  return group;
};

/* =======================
   Shape factory
======================= */

const createNodeFromShape = async (
  shape: ShapeState,
  parent: Konva.Container | undefined,
  ctx: CTX_EXP,
  IS_ROOT = false
): Promise<Konva.Node> => {
  const tool = ctx.get(shape.tool);
  if (tool === "FRAME" && parent) {
    return createFrameNodes(shape, parent, ctx, IS_ROOT);
  }

  const x = IS_ROOT ? 0 : ctx.get(shape.x);
  const y = IS_ROOT ? 0 : ctx.get(shape.y);

  const commonProps = {
    x,
    y,
    rotation: ctx.get(shape.rotation),
    opacity: ctx.get(shape.opacity),
    visible: ctx.get(shape.visible),
    id: shape.id,
  };

  switch (tool) {
    case "ICON": {
      const width = ctx.get(shape.width);
      const height = ctx.get(shape.height);

      const imageFill = ctx.get(shape.image);
      if (!imageFill) {
        return new Konva.Image({
          width: width,
          height: height,
          image: new Image(),
          ...commonProps,
        });
      }

      const CONTENT = "data:image/svg+xml;charset=utf-8,";
      const svgText = decodeURIComponent(imageFill.src.replace(CONTENT, ""));
      const newSvg = svgText
        .replace(/stroke-width="[^"]*"/g, `stroke-width="${shape.strokeWidth}"`)
        .replace(
          /stroke="currentColor"/g,
          `stroke="${ctx.get(shape.strokeColor) || "#000000"}"`
        );

      const src = CONTENT + encodeURIComponent(newSvg);
      const img = await loadImageFromBase64(
        src,
        imageFill.width || width,
        imageFill.height || height
      );

      const crop = calculateCoverCrop(
        imageFill.width || 0,
        imageFill.height || 0,
        width,
        height
      );

      return new Konva.Image({
        image: img,
        crop,
        ...commonProps,
        ...getCommonShapeProps(shape, ctx),
        fill: "transparent",
      });
    }

    case "IMAGE": {
      try {
        const imageFill = ctx.get(shape.image);

        if (!imageFill) {
          throw new Error("Image not found");
        }
        const width = ctx.get(shape.width);
        const height = ctx.get(shape.height);
        const src = await fetchAsBase64(imageFill.src);
        const img = await loadImageFromBase64(
          src,
          imageFill.width || width,
          imageFill.height || height
        );

        const crop = calculateCoverCrop(
          imageFill.width || 0,
          imageFill.height || 0,
          width,
          height
        );

        return new Konva.Image({
          image: img,
          crop,
          ...commonProps,
          ...getCommonShapeProps(shape, ctx),
        });
      } catch {
        const width = ctx.get(shape.width);
        const height = ctx.get(shape.height);
        const placeholderBase64 = await fetchAsBase64(PLACEHOLDER_SRC);
        const placeholderImg = await loadImageFromBase64(
          placeholderBase64,
          PLACEHOLDER_SIZE,
          PLACEHOLDER_SIZE
        );

        const crop = calculateCoverCrop(
          PLACEHOLDER_SIZE,
          PLACEHOLDER_SIZE,
          width,
          height
        );

        return new Konva.Image({
          image: placeholderImg,
          crop,
          ...commonProps,
          ...getCommonShapeProps(shape, ctx),
        });
      }
    }

    case "TEXT":
      return new Konva.Text({
        ...commonProps,
        ...getCommonShapeProps(shape, ctx),
      });

    case "DRAW":
      return new Konva.Line({
        ...commonProps,
        ...getCommonShapeProps(shape, ctx),
        lineCap: ctx.get(shape.lineCap),
        lineJoin: ctx.get(shape.lineJoin),
      });

    default:
      return new Konva.Group({
        ...commonProps,
        clipX: 0,
        clipY: 0,
        clipWidth: ctx.get(shape.width),
        clipHeight: ctx.get(shape.height),
      });
  }
};

/* =======================
   Recursion
======================= */

export const attachShapeRecursively = async (
  item: ALL_SHAPES,
  parent: Konva.Container,
  ctx: CTX_EXP,
  isRoot = false
): Promise<Konva.Node> => {
  const shape = ctx.get(item.state);
  const tool = ctx.get(shape.tool);

  if (tool === "FRAME") {
    return createFrameNodes(ctx.get(item.state), parent, ctx, isRoot);
  }

  const node = await createNodeFromShape(
    ctx.get(item.state),
    parent,
    ctx,
    isRoot
  );
  parent.add(node);

  const container = node instanceof Konva.Group ? node : parent;

  await Promise.all(
    getChildren(ctx.get(item.state), ctx).map((child) =>
      attachShapeRecursively(child, container, ctx)
    )
  );

  return node;
};

/* =======================
   Stage creation
======================= */

export const createStagesFromShapes = async (
  shapes: ALL_SHAPES[],
  ctx: CTX_EXP
): Promise<StageWithContainer[]> => {
  return Promise.all(
    shapes.map(async (topShape) => {
      const container = document.createElement("div");

      const width = ctx.get(ctx.get(topShape.state).width);
      const height = ctx.get(ctx.get(topShape.state).height);

      container.style.width = `${width}px`;
      container.style.height = `${height}px`;

      const stage = new Konva.Stage({
        container,
        width: Math.max(1, Math.round(width)),
        height: Math.max(1, Math.round(height)),
      });

      const layer = new Konva.Layer();
      stage.add(layer);

      await attachShapeRecursively(topShape, layer, ctx, true);
      layer.draw();

      return { stage, container };
    })
  );
};

/* =======================
   Export
======================= */

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
