const DATA_IMAGE_SVG = "data:image/svg+xml;charset=utf-8,";
export const IsEncode = (src: string) => src.startsWith(DATA_IMAGE_SVG);

export const Encode = (svg: string) => {
  return DATA_IMAGE_SVG + encodeURIComponent(svg);
};

export const Decode = (encode: string) => {
  const slug = DATA_IMAGE_SVG;

  const svgText = decodeURIComponent(encode.replace(slug, ""));
  return svgText;
};
export const SVG = { Encode, Decode, IsEncode };
