import { atom, useAtom } from "jotai";

const initialRenderImage = {
  base64: "",
  x: 0,
  y: 0,
  width: 0,
  name: "",
  height: 0,
};

export const imageRenderAtom = atom(initialRenderImage);

export const useImageRender = () => {
  const [img, setImg] = useAtom(imageRenderAtom);
  const handleSetImageRender = (values: typeof initialRenderImage) =>
    setImg(values);

  return {
    img,
    handleSetImageRender,
  };
};
