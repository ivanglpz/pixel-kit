import { useAtom } from "jotai";
import {
  imageOriginalAtom,
  imageRenderAtom,
  INITIAL_RENDER_IMAGE,
} from "../states/image";

export const useImageRender = () => {
  const [img, setImg] = useAtom(imageRenderAtom);
  const [originalImage, setOriginalImage] = useAtom(imageOriginalAtom);

  const handleSetImageRender = (values: typeof INITIAL_RENDER_IMAGE) => {
    setOriginalImage(values);
    setImg(values);
  };
  const handleSetClipImage = (values: typeof INITIAL_RENDER_IMAGE) => {
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
