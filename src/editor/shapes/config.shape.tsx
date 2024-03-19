import { Dispatch, SetStateAction } from "react";
import { IShape } from "./type.shape";
import { Html } from "react-konva-utils";
import { createPortal } from "react-dom";
import LayoutShapeConfig from "../layout/right/shape/config";

type Props = {
  setShape: Dispatch<SetStateAction<IShape>>;
  isSelected: boolean;
  shape: IShape;
};

export const PortalConfigShape = ({ setShape, shape, isSelected }: Props) => {
  const sidebarElement = document.getElementById("pixel-kit-sidebar-right");
  const handleChangeWithKey = (
    keyProp: keyof IShape,
    value: string | number
  ) => {
    setShape((prev) => {
      return {
        ...prev,
        [keyProp]: value,
      };
    });
  };
  return (
    <Html
      divProps={{
        style: {
          position: "absolute",
          top: 10,
          left: 10,
        },
      }}
    >
      {sidebarElement && sidebarElement instanceof Element && isSelected
        ? createPortal(
            <LayoutShapeConfig
              shape={shape}
              onChange={(key, value) => {
                handleChangeWithKey(key, value);
              }}
            />,
            sidebarElement
          )
        : null}
    </Html>
  );
};
