// TypeScript (English identifiers, strict types, no `any`)
type RGB = { r: number; g: number; b: number; a?: number };

const clamp = (v: number, min = 0, max = 1): number =>
  Math.min(max, Math.max(min, v));

const parseHex = (input: string): RGB | null => {
  const hex = input.replace(/^#/, "").trim().toLowerCase();
  if (![3, 4, 6, 8].includes(hex.length)) return null;

  const expand = (s: string) => (s.length === 1 ? s + s : s);

  try {
    if (hex.length === 3 || hex.length === 4) {
      const r = parseInt(expand(hex[0]), 16);
      const g = parseInt(expand(hex[1]), 16);
      const b = parseInt(expand(hex[2]), 16);
      const a =
        hex.length === 4 ? parseInt(expand(hex[3]), 16) / 255 : undefined;
      if ([r, g, b].some(Number.isNaN)) return null;
      return { r, g, b, a: a === undefined ? undefined : clamp(a, 0, 1) };
    }

    // 6 or 8 chars
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const a =
      hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : undefined;
    if ([r, g, b].some(Number.isNaN)) return null;
    return { r, g, b, a: a === undefined ? undefined : clamp(a, 0, 1) };
  } catch {
    return null;
  }
};

const parseNumberChannel = (token: string): number | null => {
  const t = token.trim();
  if (t.endsWith("%")) {
    const v = parseFloat(t.slice(0, -1));
    if (Number.isNaN(v)) return null;
    return clamp(v / 100, 0, 1) * 255;
  }
  const v = parseFloat(t);
  if (Number.isNaN(v)) return null;
  // CSS allows values >1 and up to 255 for integer rgb
  return clamp(v, 0, 255);
};

const parseAlpha = (token: string): number | null => {
  const t = token.trim();
  if (t.endsWith("%")) {
    const v = parseFloat(t.slice(0, -1));
    if (Number.isNaN(v)) return null;
    return clamp(v / 100, 0, 1);
  }
  const v = parseFloat(t);
  if (Number.isNaN(v)) return null;
  return clamp(v, 0, 1);
};

const parseRgb = (input: string): RGB | null => {
  const s = input.trim().toLowerCase();
  if (!s.startsWith("rgb")) return null;
  const inside = s.replace(/^rgba?\(|\)$/g, "").trim();

  // split alpha if present with slash syntax
  const [colorPart, alphaPart] = inside.split("/").map((p) => p && p.trim());
  const alphaToken = alphaPart ?? undefined;

  // tokens either comma separated or whitespace separated
  const tokens = colorPart.includes(",")
    ? colorPart.split(",").map((t) => t.trim())
    : colorPart.split(/\s+/).map((t) => t.trim());

  if (tokens.length !== 3) return null;

  const r = parseNumberChannel(tokens[0]);
  const g = parseNumberChannel(tokens[1]);
  const b = parseNumberChannel(tokens[2]);
  if (r === null || g === null || b === null) return null;

  const a = alphaToken ? parseAlpha(alphaToken) : undefined;
  return { r: Math.round(r), g: Math.round(g), b: Math.round(b), a: Number(a) };
};

const parseHsl = (input: string): RGB | null => {
  const s = input.trim().toLowerCase();
  if (!s.startsWith("hsl")) return null;
  const inside = s.replace(/^hsla?\(|\)$/g, "").trim();

  const [colorPart, alphaPart] = inside.split("/").map((p) => p && p.trim());
  const alphaToken = alphaPart ?? undefined;

  const tokens = colorPart.includes(",")
    ? colorPart.split(",").map((t) => t.trim())
    : colorPart.split(/\s+/).map((t) => t.trim());

  if (tokens.length !== 3) return null;

  // parse h (may have deg/rad but handle numeric degrees only)
  const hRaw = tokens[0].replace(/deg$/, "");
  const h = (parseFloat(hRaw) || 0) % 360;
  const sPct = tokens[1].endsWith("%")
    ? parseFloat(tokens[1].slice(0, -1)) / 100
    : parseFloat(tokens[1]);
  const lPct = tokens[2].endsWith("%")
    ? parseFloat(tokens[2].slice(0, -1)) / 100
    : parseFloat(tokens[2]);

  if ([sPct, lPct].some((v) => Number.isNaN(v))) return null;
  const sVal = clamp(sPct, 0, 1);
  const lVal = clamp(lPct, 0, 1);

  const hueToRgb = (p: number, q: number, t: number): number => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  let r = lVal;
  let g = lVal;
  let b = lVal;

  if (sVal !== 0) {
    const q = lVal < 0.5 ? lVal * (1 + sVal) : lVal + sVal - lVal * sVal;
    const p = 2 * lVal - q;
    const hk = h / 360;
    r = hueToRgb(p, q, hk + 1 / 3);
    g = hueToRgb(p, q, hk);
    b = hueToRgb(p, q, hk - 1 / 3);
  }

  const a = alphaToken ? parseAlpha(alphaToken) : undefined;
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
    a: Number(a),
  };
};

// Minimal CSS color keywords list (common set). Add items as needed.
const CSS_COLOR_KEYWORDS: Record<string, string> = {
  aliceblue: "#f0f8ff",
  antiquewhite: "#faebd7",
  aqua: "#00ffff",
  aquamarine: "#7fffd4",
  azure: "#f0ffff",
  beige: "#f5f5dc",
  bisque: "#ffe4c4",
  black: "#000000",
  blanchedalmond: "#ffebcd",
  blue: "#0000ff",
  blueviolet: "#8a2be2",
  brown: "#a52a2a",
  burlywood: "#deb887",
  cadetblue: "#5f9ea0",
  chartreuse: "#7fff00",
  chocolate: "#d2691e",
  coral: "#ff7f50",
  cornflowerblue: "#6495ed",
  cornsilk: "#fff8dc",
  crimson: "#dc143c",
  cyan: "#00ffff",
  darkblue: "#00008b",
  darkcyan: "#008b8b",
  darkgoldenrod: "#b8860b",
  darkgray: "#a9a9a9",
  darkgreen: "#006400",
  darkgrey: "#a9a9a9",
  darkkhaki: "#bdb76b",
  darkmagenta: "#8b008b",
  darkolivegreen: "#556b2f",
  darkorange: "#ff8c00",
  darkorchid: "#9932cc",
  darkred: "#8b0000",
  darksalmon: "#e9967a",
  darkseagreen: "#8fbc8f",
  darkslateblue: "#483d8b",
  darkslategray: "#2f4f4f",
  darkslategrey: "#2f4f4f",
  darkturquoise: "#00ced1",
  darkviolet: "#9400d3",
  deeppink: "#ff1493",
  deepskyblue: "#00bfff",
  dimgray: "#696969",
  dimgrey: "#696969",
  dodgerblue: "#1e90ff",
  firebrick: "#b22222",
  floralwhite: "#fffaf0",
  forestgreen: "#228b22",
  fuchsia: "#ff00ff",
  gainsboro: "#dcdcdc",
  ghostwhite: "#f8f8ff",
  gold: "#ffd700",
  goldenrod: "#daa520",
  gray: "#808080",
  green: "#008000",
  greenyellow: "#adff2f",
  grey: "#808080",
  honeydew: "#f0fff0",
  hotpink: "#ff69b4",
  indianred: "#cd5c5c",
  indigo: "#4b0082",
  ivory: "#fffff0",
  khaki: "#f0e68c",
  lavender: "#e6e6fa",
  lavenderblush: "#fff0f5",
  lawngreen: "#7cfc00",
  lemonchiffon: "#fffacd",
  lightblue: "#add8e6",
  lightcoral: "#f08080",
  lightcyan: "#e0ffff",
  lightgoldenrodyellow: "#fafad2",
  lightgray: "#d3d3d3",
  lightgreen: "#90ee90",
  lightgrey: "#d3d3d3",
  lightpink: "#ffb6c1",
  lightsalmon: "#ffa07a",
  lightseagreen: "#20b2aa",
  lightskyblue: "#87cefa",
  lightslategray: "#778899",
  lightslategrey: "#778899",
  lightsteelblue: "#b0c4de",
  lightyellow: "#ffffe0",
  lime: "#00ff00",
  limegreen: "#32cd32",
  linen: "#faf0e6",
  magenta: "#ff00ff",
  maroon: "#800000",
  mediumaquamarine: "#66cdaa",
  mediumblue: "#0000cd",
  mediumorchid: "#ba55d3",
  mediumpurple: "#9370db",
  mediumseagreen: "#3cb371",
  mediumslateblue: "#7b68ee",
  mediumspringgreen: "#00fa9a",
  mediumturquoise: "#48d1cc",
  mediumvioletred: "#c71585",
  midnightblue: "#191970",
  mintcream: "#f5fffa",
  mistyrose: "#ffe4e1",
  moccasin: "#ffe4b5",
  navajowhite: "#ffdead",
  navy: "#000080",
  oldlace: "#fdf5e6",
  olive: "#808000",
  olivedrab: "#6b8e23",
  orange: "#ffa500",
  orangered: "#ff4500",
  orchid: "#da70d6",
  palegoldenrod: "#eee8aa",
  palegreen: "#98fb98",
  paleturquoise: "#afeeee",
  palevioletred: "#db7093",
  papayawhip: "#ffefd5",
  peachpuff: "#ffdab9",
  peru: "#cd853f",
  pink: "#ffc0cb",
  plum: "#dda0dd",
  powderblue: "#b0e0e6",
  purple: "#800080",
  rebeccapurple: "#663399",
  red: "#ff0000",
  rosybrown: "#bc8f8f",
  royalblue: "#4169e1",
  saddlebrown: "#8b4513",
  salmon: "#fa8072",
  sandybrown: "#f4a460",
  seagreen: "#2e8b57",
  seashell: "#fff5ee",
  sienna: "#a0522d",
  silver: "#c0c0c0",
  skyblue: "#87ceeb",
  slateblue: "#6a5acd",
  slategray: "#708090",
  slategrey: "#708090",
  snow: "#fffafa",
  springgreen: "#00ff7f",
  steelblue: "#4682b4",
  tan: "#d2b48c",
  teal: "#008080",
  thistle: "#d8bfd8",
  tomato: "#ff6347",
  turquoise: "#40e0d0",
  violet: "#ee82ee",
  wheat: "#f5deb3",
  white: "#ffffff",
  whitesmoke: "#f5f5f5",
  yellow: "#ffff00",
  yellowgreen: "#9acd32",
  transparent: "rgba(0,0,0,0)",
};

const parseNamedColor = (input: string): RGB | null => {
  const key = input.trim().toLowerCase();
  if (!(key in CSS_COLOR_KEYWORDS)) return null;
  const value = CSS_COLOR_KEYWORDS[key];
  if (value.startsWith("rgba")) {
    // transparent
    const match = value.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([0-9.]+)\)/);
    if (!match) return null;
    return {
      r: parseInt(match[1], 10),
      g: parseInt(match[2], 10),
      b: parseInt(match[3], 10),
      a: parseFloat(match[4]),
    };
  }
  return parseHex(value);
};

// If color has alpha < 1, composite over white (common choice)
const compositeOverWhite = (rgb: RGB): RGB => {
  if (rgb.a === undefined || rgb.a >= 1)
    return { r: rgb.r, g: rgb.g, b: rgb.b };
  const a = clamp(rgb.a, 0, 1);
  const r = Math.round(rgb.r * a + 255 * (1 - a));
  const g = Math.round(rgb.g * a + 255 * (1 - a));
  const b = Math.round(rgb.b * a + 255 * (1 - a));
  return { r, g, b };
};

const srgbToLinear = (c: number): number => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
};

const relativeLuminance = (rgb: RGB): number => {
  const { r, g, b } = rgb;
  const R = srgbToLinear(r);
  const G = srgbToLinear(g);
  const B = srgbToLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};

export function getContrastColor(input: string): "black" | "white" {
  const s = input.trim().toLowerCase();
  const parsers: Array<(t: string) => RGB | null> = [
    parseHex,
    parseRgb,
    parseHsl,
    parseNamedColor,
  ];

  const rgbRaw = parsers.reduce<RGB | null>((acc, fn) => acc ?? fn(s), null);
  if (!rgbRaw) return "black"; // fallback if not parseable

  const rgb = compositeOverWhite(rgbRaw);
  const lum = relativeLuminance(rgb);

  // choose the color (white or black) with higher contrast ratio
  const contrastWhite = (1.0 + 0.05) / (lum + 0.05);
  const contrastBlack = (lum + 0.05) / 0.05;

  return contrastWhite >= contrastBlack ? "white" : "black";
}
