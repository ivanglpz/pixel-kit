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
export const imageOriginalAtom = atom<typeof initialRenderImage | null>(null);

export const useImageRender = () => {
  const [img, setImg] = useAtom(imageRenderAtom);
  const [originalImage, setOriginalImage] = useAtom(imageOriginalAtom);
  console.log({ originalImage });

  const handleSetImageRender = (values: typeof initialRenderImage) => {
    setOriginalImage(values);
    setImg(values);
  };
  const handleSetClipImage = (values: typeof initialRenderImage) => {
    setImg(values);
  };

  const handleResetImage = () => {
    if (originalImage) {
      setImg(originalImage);
    }
  };
  return {
    img,
    handleSetClipImage,
    handleSetImageRender,
    handleResetImage,
  };
};
