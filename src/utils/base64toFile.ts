export function base64ToFile(base64: string, fileName: string): File {
  const [header, data] = base64.split(",");
  const mimeMatch = header.match(/:(.*?);/);
  const mimeType = mimeMatch ? mimeMatch[1] : "image/png";

  const binary = atob(data);
  const array = Uint8Array.from(binary, (c) => c.charCodeAt(0));

  return new File([array], fileName, { type: mimeType });
}
