export const Encode = (svg: string) => {
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
};

export const Decode = (encode: string) => {
  const slug = "data:image/svg+xml;charset=utf-8,";

  const svgText = decodeURIComponent(encode.replace(slug, ""));
  return svgText;
};
export const SVG = { Encode, Decode };
