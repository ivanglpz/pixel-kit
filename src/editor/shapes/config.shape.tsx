import { Valid } from "@/components/valid";
import { Dispatch, SetStateAction } from "react";
import { createPortal } from "react-dom";
import { Html } from "react-konva-utils";
import { LayoutShapeConfig } from "../sidebar/shape-config";
import { IShape } from "./type.shape";

type Props = {
  setShape: Dispatch<SetStateAction<IShape>>;
  isSelected: boolean;
  shape: IShape;
};

export const PortalConfigShape = ({ setShape, shape, isSelected }: Props) => {
  if (!isSelected) return null;
  const sidebarElement = document.getElementById("pixel-kit-sidebar-right");

  const handleChangeWithKey = (
    keyProp: keyof IShape,
    value: string | number | boolean
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
      <Valid isValid={(sidebarElement ?? false) && isSelected}>
        {createPortal(
          <LayoutShapeConfig
            shape={shape}
            onChange={(key, value) => {
              handleChangeWithKey(key, value);
            }}
          />,
          sidebarElement as Element
        )}
      </Valid>
    </Html>
  );
};
