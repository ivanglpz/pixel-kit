type OptimizeImageParams = {
  file: File;
  quality: number;
  maxSizeBytes?: number;
};

export async function optimizeImageFile(
  params: OptimizeImageParams,
): Promise<File> {
  const { file, quality, maxSizeBytes } = params;

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsDataURL(file);
  });

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = dataUrl;
  });

  const canvas = document.createElement("canvas");

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas context unavailable");
  }

  const targetMimeType = "image/jpeg";
  const normalizedQuality = Math.min(Math.max(quality, 1), 100) / 100;
  let scale = 1;
  let currentQuality = normalizedQuality;

  const renderBlob = async () => {
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) =>
          result ? resolve(result) : reject(new Error("Blob creation failed")),
        targetMimeType,
        currentQuality,
      );
    });
  };

  let blob = await renderBlob();

  while (maxSizeBytes && blob.size > maxSizeBytes) {
    if (currentQuality > 0.35) {
      currentQuality = Math.max(0.35, currentQuality - 0.1);
    } else {
      scale *= 0.85;
    }

    if (canvas.width <= 320 || canvas.height <= 320) {
      throw new Error("Image could not be optimized below 1MB");
    }

    blob = await renderBlob();
  }

  return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), {
    type: targetMimeType,
  });
}
