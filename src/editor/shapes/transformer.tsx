import React, { forwardRef, MutableRefObject } from "react";
import { Transformer } from "react-konva";
import Konva from "konva";

type Props = {
  isSelected: boolean;
};

// eslint-disable-next-line react/display-name
export const Transform = forwardRef((props: Props, ref) => {
  const refT = ref as MutableRefObject<Konva.Transformer>;
  const { isSelected } = props;

  if (!isSelected) return null;
  if (!refT) return null;

  return <Transformer ref={refT} keepRatio={false} />;
});
