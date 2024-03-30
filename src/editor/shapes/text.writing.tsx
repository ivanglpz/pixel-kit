import { Dispatch, SetStateAction } from "react";
import { IShape } from "./type.shape";
import { Html } from "react-konva-utils";
import { createPortal } from "react-dom";
import { useTool } from "../hooks";
import { useReference } from "../hooks/reference";
import { tokens } from "../tokens";

type Props = {
  setShape: Dispatch<SetStateAction<IShape>>;
  isSelected: boolean;
  shape: IShape;
};

export const PortalTextWriting = ({ shape, isSelected, setShape }: Props) => {
  const { setTool } = useTool();
  const { ref } = useReference({
    type: "STAGE",
  });
  const stage = ref?.current;

  if (!shape?.isWritingNow || !isSelected || !stage) return null;

  const areaPosition = {
    x: stage?.container().offsetLeft + shape.x,
    y: stage?.container().offsetTop + shape.y,
  };

  const sidebarElement = document.getElementById("StageViewer");

  return (
    <Html
      divProps={{
        style: {
          position: "absolute",
          top: 0,
          left: 0,
        },
      }}
    >
      {sidebarElement && sidebarElement instanceof Element && isSelected
        ? createPortal(
            <>
              <textarea
                autoFocus
                onFocus={() => {
                  setTool("WRITING");
                }}
                style={{
                  position: "absolute",
                  top: areaPosition?.y + "px",
                  left: areaPosition?.x + "px",
                  width:
                    Number(shape.width) > 100 ? shape.width + "px" : "220px",
                  height:
                    Number(shape.height) > 100 ? shape.height + "px" : "100px",
                  resize: "none",
                  background: "transparent",
                  fontWeight: shape?.fontWeight ?? "normal",
                  fontSize: shape.fontSize + "px",
                  border: `1px solid ${tokens.colors.blue}`,
                  padding: "0px",
                  margin: "0px",
                  overflow: "hidden",
                  outline: "none",
                  textAlign: "left",
                  color: shape.backgroundColor ?? "white",
                  lineHeight: 1.45,
                  textShadow: shape.shadowEnabled
                    ? `${shape.shadowOffsetX}px ${shape.shadowOffsetY}px  #000`
                    : "none",
                }}
                value={shape.text ?? ""}
                onChange={(e) => {
                  setShape((prev) => ({
                    ...prev,
                    text: e.target.value,
                    width: Number(shape.width) > 100 ? shape.width : 220,
                    height: Number(shape.height) > 100 ? shape.height : 100,
                  }));
                }}
                onClick={() => {
                  setTool("WRITING");
                }}
              />
            </>,
            sidebarElement
          )
        : null}
    </Html>
  );
};
