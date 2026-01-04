import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Image as KonvaImage } from "react-konva";

import { SELECTED_SHAPES_BY_IDS_ATOM } from "../states/shape";
import { calculateCoverCrop } from "../utils/crop";
import { flexLayoutAtom } from "./layout-flex";
import { IShapeEvents } from "./type.shape";

// ============================================================================
// Types
// ============================================================================

type ImageSource = {
  src?: string;
  width?: number;
  height?: number;
};

type ImageStatus = "idle" | "loading" | "loaded" | "error";

type ValidatedImageResult = {
  image: HTMLImageElement;
  width: number;
  height: number;
  status: ImageStatus;
  isLoading: boolean;
  hasError: boolean;
};

// ============================================================================
// Constants
// ============================================================================

const PLACEHOLDER_SRC = "/placeholder.svg";
const PLACEHOLDER_SIZE = 1200;
const MIN_SHAPE_SIZE = 5;

// ============================================================================
// Utilities
// ============================================================================

function createImage(
  src: string,
  width: number,
  height: number
): HTMLImageElement {
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = src;
  img.width = width;
  img.height = height;
  return img;
}

// ============================================================================
// Hooks
// ============================================================================

export function useKonvaImage(img: ImageSource): ValidatedImageResult {
  const [status, setStatus] = useState<ImageStatus>("idle");
  const [validatedSrc, setValidatedSrc] = useState<string | null>(null);

  const validateImage = useCallback(
    (url: string): Promise<boolean> =>
      new Promise((resolve) => {
        const testImg = new Image();
        testImg.crossOrigin = "Anonymous";

        testImg.onload = () => resolve(true);
        testImg.onerror = () => resolve(false);

        testImg.src = url;
      }),
    []
  );

  useEffect(() => {
    if (!img.src) {
      setStatus("error");
      setValidatedSrc(null);
      return;
    }

    setStatus("loading");

    validateImage(img.src).then((isValid) => {
      setStatus(isValid ? "loaded" : "error");
      setValidatedSrc(isValid ? img.src! : null);
    });
  }, [img.src, validateImage]);

  return useMemo(() => {
    const shouldUsePlaceholder = status === "error" || !validatedSrc;
    const imageSrc = shouldUsePlaceholder ? PLACEHOLDER_SRC : validatedSrc;
    const imageWidth = shouldUsePlaceholder
      ? PLACEHOLDER_SIZE
      : (img.width ?? PLACEHOLDER_SIZE);
    const imageHeight = shouldUsePlaceholder
      ? PLACEHOLDER_SIZE
      : (img.height ?? PLACEHOLDER_SIZE);

    return {
      image: createImage(imageSrc, imageWidth, imageHeight),
      width: imageWidth,
      height: imageHeight,
      status,
      isLoading: status === "loading",
      hasError: status === "error",
    };
  }, [validatedSrc, status, img.width, img.height]);
}

// ============================================================================
// Component
// ============================================================================

export const ShapeImage = ({ shape: item }: IShapeEvents) => {
  // Box state
  const box = useAtomValue(item.state);
  const [rotation, setRotation] = useAtom(box.rotation);
  const [x, setX] = useAtom(box.x);
  const [y, setY] = useAtom(box.y);
  const [width, setWidth] = useAtom(box.width);
  const [height, setHeight] = useAtom(box.height);

  // Visibility and interaction
  const visible = useAtomValue(box.visible);
  const isLocked = useAtomValue(box.isLocked);
  const parentId = useAtomValue(box.parentId);

  // Appearance
  const opacity = useAtomValue(box.opacity);
  const fillColor = useAtomValue(box.fillColor);

  // Stroke
  const strokeColor = useAtomValue(box.strokeColor);
  const strokeWidth = useAtomValue(box.strokeWidth);
  const dash = useAtomValue(box.dash);

  // Border radius
  const isAllBorderRadius = useAtomValue(box.isAllBorderRadius);
  const borderRadius = useAtomValue(box.borderRadius);
  const borderTopLeftRadius = useAtomValue(box.borderTopLeftRadius);
  const borderTopRightRadius = useAtomValue(box.borderTopRightRadius);
  const borderBottomRightRadius = useAtomValue(box.borderBottomRightRadius);
  const borderBottomLeftRadius = useAtomValue(box.borderBottomLeftRadius);

  // Shadow
  const shadowColor = useAtomValue(box.shadowColor);
  const shadowOpacity = useAtomValue(box.shadowOpacity);
  const shadowOffsetX = useAtomValue(box.shadowOffsetX);
  const shadowOffsetY = useAtomValue(box.shadowOffsetY);
  const shadowBlur = useAtomValue(box.shadowBlur);

  // Selection and layout
  const [shapeId, setShapeId] = useAtom(SELECTED_SHAPES_BY_IDS_ATOM);
  const applyLayout = useSetAtom(flexLayoutAtom);

  // Computed values
  const isSelected = useMemo(
    () => shapeId.some((shape) => shape.id === box.id),
    [shapeId, box.id]
  );

  const IMG = useAtomValue(box.image);
  const RENDER_IMAGE = useKonvaImage(IMG);

  const cropConfig = useMemo(
    () =>
      calculateCoverCrop(
        RENDER_IMAGE.width,
        RENDER_IMAGE.height,
        Number(width),
        Number(height)
      ),
    [RENDER_IMAGE.width, RENDER_IMAGE.height, width, height]
  );

  const cornerRadiusConfig = useMemo(
    () =>
      isAllBorderRadius
        ? [
            borderTopLeftRadius,
            borderTopRightRadius,
            borderBottomRightRadius,
            borderBottomLeftRadius,
          ]
        : borderRadius,
    [
      isAllBorderRadius,
      borderRadius,
      borderTopLeftRadius,
      borderTopRightRadius,
      borderBottomRightRadius,
      borderBottomLeftRadius,
    ]
  );

  // Event handlers
  const handleClick = useCallback(() => {
    setShapeId({ id: box.id, parentId });
  }, [box.id, parentId, setShapeId]);

  const handleDragMove = useCallback(
    (evt: any) => {
      setX(evt.target.x());
      setY(evt.target.y());
    },
    [setX, setY]
  );

  const handleDragEnd = useCallback(() => {
    if (parentId) {
      applyLayout({ id: parentId });
    }
  }, [parentId, applyLayout]);

  const handleTransform = useCallback(
    (e: any) => {
      const node = e.target;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();

      // Reset scale to 1
      node.scaleX(1);
      node.scaleY(1);

      // Update dimensions
      setRotation(node.rotation());
      setWidth(Math.max(MIN_SHAPE_SIZE, node.width() * scaleX));
      setHeight(Math.max(MIN_SHAPE_SIZE, node.height() * scaleY));
    },
    [setRotation, setWidth, setHeight]
  );

  const handleTransformEnd = useCallback(() => {
    if (parentId) {
      applyLayout({ id: parentId });
    }
  }, [parentId, applyLayout]);

  // Early return if not visible
  if (!visible) return null;

  return (
    <KonvaImage
      // Identity
      id={box.id}
      image={RENDER_IMAGE.image}
      crop={cropConfig}
      parentId={parentId}
      globalCompositeOperation="source-over"
      // Position and size
      x={x}
      y={y}
      width={width}
      height={height}
      rotation={rotation}
      // Interaction
      listening={!isLocked}
      draggable={isSelected}
      // Fill
      fillEnabled
      fill={fillColor}
      // Stroke
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      strokeEnabled={strokeWidth > 0}
      dash={[dash]}
      dashEnabled={dash > 0}
      cornerRadius={cornerRadiusConfig}
      // Shadow
      shadowColor={shadowColor}
      shadowOpacity={shadowOpacity}
      shadowOffsetX={shadowOffsetX}
      shadowOffsetY={shadowOffsetY}
      shadowBlur={shadowBlur}
      shadowEnabled
      // Appearance
      opacity={opacity}
      // Events
      onClick={handleClick}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onTransform={handleTransform}
      onTransformEnd={handleTransformEnd}
    />
  );
};
