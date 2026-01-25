import { useCallback, useEffect, useMemo, useState } from "react";

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
