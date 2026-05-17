import { v4 as uuidv4 } from "uuid";

export const downloadBase64Image = (base64: string) => {
  const link = document.createElement("a");
  link.download = `pixel-kit-edition-${uuidv4().slice(0, 4)}.jpg`;
  link.href = base64;
  document.body.appendChild(link);
  link.click();
  link.remove();
};
