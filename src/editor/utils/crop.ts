export function calculateCoverCrop(
  imageWidth: number,
  imageHeight: number,
  containerWidth: number,
  containerHeight: number
) {
  const imageRatio = imageWidth / imageHeight;
  const containerRatio = containerWidth / containerHeight;

  let cropX = 0;
  let cropY = 0;
  let cropWidth = imageWidth;
  let cropHeight = imageHeight;

  if (imageRatio > containerRatio) {
    // Imagen más ancha → recortar lados
    cropWidth = imageHeight * containerRatio;
    cropX = (imageWidth - cropWidth) / 2;
  } else {
    // Imagen más alta → recortar arriba y abajo
    cropHeight = imageWidth / containerRatio;
    cropY = (imageHeight - cropHeight) / 2;
  }

  return { x: cropX, y: cropY, width: cropWidth, height: cropHeight };
}
