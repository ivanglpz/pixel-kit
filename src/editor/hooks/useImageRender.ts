import { useAtom } from "jotai";
import {
  imageOriginalAtom,
  imageRenderAtom,
  initialRenderImage,
} from "../states/image";

export const useImageRender = () => {
  const [img, setImg] = useAtom(imageRenderAtom);
  const [originalImage, setOriginalImage] = useAtom(imageOriginalAtom);

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
