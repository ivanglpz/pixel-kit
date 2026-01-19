import { useCallback, useEffect, useMemo, useState } from "react";
import { Image as KonvaImage } from "react-konva";

import { calculateCoverCrop } from "../utils/crop";
import { useResolvedShape } from "./frame.shape";
import { ShapeLabel } from "./label";
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
  height: number,
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
    [],
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

export const ShapeImage = (props: IShapeEvents) => {
  const { options } = props;
  const shape = useResolvedShape(props);
  const IMG = shape.IMG;
  const RENDER_IMAGE = useKonvaImage(IMG);

  const cropConfig = useMemo(
    () =>
      calculateCoverCrop(
        RENDER_IMAGE.width,
        RENDER_IMAGE.height,
        Number(shape.width),
        Number(shape.height),
      ),
    [RENDER_IMAGE.width, RENDER_IMAGE.height, shape.width, shape.height],
  );

  if (!shape.visible) return null;

  return (
    <>
      {options?.showLabel ? (
        <ShapeLabel
          x={shape.x}
          y={shape.y}
          label={shape.label}
          color={options?.background}
          isComponent={shape.isComponent}
        />
      ) : null}
      <KonvaImage
        // Identity
        id={options?.isLocked ? "" : shape?.id}
        image={RENDER_IMAGE.image}
        crop={cropConfig}
        parentId={shape.parentId}
        globalCompositeOperation="source-over"
        // Position and size
        x={shape.x}
        y={shape.y}
        width={shape.width}
        height={shape.height}
        rotation={shape.rotation}
        // Interaction
        listening={shape.listening}
        draggable={shape.isSelected}
        // Fill
        fillEnabled
        fill={shape.fillColor}
        // Stroke
        stroke={shape.strokeColor}
        strokeWidth={shape.strokeWidth}
        strokeEnabled={shape.strokeWidth > 0}
        dash={[shape.dash]}
        dashEnabled={shape.dash > 0}
        cornerRadius={
          !shape.isAllBorderRadius
            ? [
                shape.borderTopLeftRadius,
                shape.borderTopRightRadius,
                shape.borderBottomRightRadius,
                shape.borderBottomLeftRadius,
              ]
            : shape.borderRadius
        }
        // 5. Sombras
        shadowColor={shape.shadowColor}
        shadowOpacity={shape.shadowOpacity}
        shadowOffsetX={shape.shadowOffsetX}
        shadowOffsetY={shape.shadowOffsetY}
        shadowBlur={shape.shadowBlur}
        shadowEnabled
        // 6. Apariencia y opacidad
        opacity={shape.opacity}
        {...shape.events}
      />
    </>
  );
};
