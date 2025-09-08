export const parseColorToRgba = (color: string, opacity: number): string => {
  const clampOpacity = Math.min(Math.max(opacity, 0), 1);

  // hex #RGB o #RRGGBB
  if (color.startsWith("#")) {
    const hex = color.slice(1);
    const normalized =
      hex.length === 3
        ? hex
            .split("")
            .map((c) => c + c)
            .join("")
        : hex;
    const intVal = parseInt(normalized, 16);

    const r = (intVal >> 16) & 255;
    const g = (intVal >> 8) & 255;
    const b = intVal & 255;

    return `rgba(${r},${g},${b},${clampOpacity})`;
  }

  // rgb() o rgba()
  const rgbMatch = color.match(/rgba?\(([^)]+)\)/);
  if (rgbMatch) {
    const [r, g, b] = rgbMatch[1].split(",").map((v) => parseInt(v.trim(), 10));
    return `rgba(${r},${g},${b},${clampOpacity})`;
  }

  // fallback → retorna color tal cual
  return color;
};
