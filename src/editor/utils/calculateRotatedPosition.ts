// Función para calcular la posición rotada
export const calculateRotatedPosition = (
  x: number,
  y: number,
  width: number,
  height: number,
  rotation: number
) => {
  if (rotation === 0) {
    return { x, y };
  }

  // Centro visual del elemento (donde queremos que rote)
  const centerX = x + width / 2;
  const centerY = y + height / 2;

  // Convertir rotación a radianes
  const radians = (rotation * Math.PI) / 180;

  // Calcular la nueva posición de la esquina superior izquierda
  // para que el centro visual permanezca en la misma posición
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  // Offset desde el centro al punto superior izquierdo en el sistema rotado
  const offsetX = -width / 2;
  const offsetY = -height / 2;

  // Aplicar la rotación al offset
  const rotatedOffsetX = offsetX * cos - offsetY * sin;
  const rotatedOffsetY = offsetX * sin + offsetY * cos;

  // Nueva posición de la esquina superior izquierda
  return {
    x: centerX + rotatedOffsetX,
    y: centerY + rotatedOffsetY,
  };
};
