type HexColor = `#${string}`;
type TextColor = "#000000" | "#FFFFFF";

const normalizeHex = (hex: string): string =>
  hex.length === 4
    ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
    : hex;

const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const normalized = normalizeHex(hex).slice(1);

  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);

  return { r, g, b };
};

const getRelativeLuminance = (r: number, g: number, b: number): number => {
  const toLinear = (value: number): number => {
    const channel = value / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4);
  };

  const red = toLinear(r);
  const green = toLinear(g);
  const blue = toLinear(b);

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};

export const chooseColor = (hex: string): TextColor => {
  const { r, g, b } = hexToRgb(hex);
  const luminance = getRelativeLuminance(r, g, b);

  return luminance > 0.179 ? "#000000" : "#FFFFFF";
};
