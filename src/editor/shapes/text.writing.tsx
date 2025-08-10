/* eslint-disable react-hooks/exhaustive-deps */
import { PrimitiveAtom, useAtom } from "jotai";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Html } from "react-konva-utils";
import { tokens } from "../constants";
import { useTool } from "../hooks";
import { SHAPES_NODES } from "../states/shapes";
import { IShape, WithInitialValue } from "./type.shape";

type Props = {
  item: SHAPES_NODES;
};

export const PortalTextWriting = ({ item }: Props) => {
  const { setTool } = useTool();
  const [box, setBox] = useAtom(
    item.state as PrimitiveAtom<IShape> & WithInitialValue<IShape>
  );
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      const newHeight = textarea.scrollHeight;
      setBox((prev) => ({
        ...prev,
        height: newHeight,
      }));
      textarea.style.height = `${newHeight}px`;
    }
  };
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    adjustTextareaHeight();
  }, [box?.text, textareaRef]);

  if (!box?.isWritingNow) return null;

  const areaPosition = {
    x: box.x,
    y: box.y,
  };
  const sidebarElement = document.getElementById("pixel-kit-stage");

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
      {sidebarElement && sidebarElement instanceof Element
        ? createPortal(
            <>
              <textarea
                ref={textareaRef}
                autoFocus
                onFocus={() => {
                  setTool("WRITING");
                }}
                style={{
                  position: "absolute",
                  top: areaPosition?.y - 1 + "px",
                  left: areaPosition?.x - 1 + "px",
                  fontFamily: box?.fontFamily,
                  width: Number(box.width) > 100 ? box.width + "px" : "220px",
                  height:
                    Number(box.height) > 100 ? box.height + "px" : "100px",
                  resize: "none",
                  background: "transparent",
                  fontWeight: box?.fontWeight ?? "normal",
                  fontSize: box.fontSize + "px",
                  border: `1px solid ${tokens.colors.blue}`,
                  padding: "0px",
                  margin: "0px",
                  overflow: "hidden",
                  outline: "none",
                  textAlign: "left",
                  color:
                    box?.fills?.filter((e) => e?.visible)?.at(0)?.color ??
                    "white",
                  lineHeight: 1.45,
                  textShadow:
                    Number(
                      box?.effects?.filter(
                        (e) => e?.visible && e?.type === "shadow"
                      )?.length
                    ) > 0
                      ? `${
                          box?.effects
                            ?.filter((e) => e?.visible && e?.type === "shadow")
                            .at(0)?.x
                        }px ${
                          box?.effects
                            ?.filter((e) => e?.visible && e?.type === "shadow")
                            .at(0)?.y
                        }px  ${
                          box?.effects
                            ?.filter((e) => e?.visible && e?.type === "shadow")
                            .at(0)?.color
                        }`
                      : "none",
                }}
                value={box.text ?? ""}
                onChange={(e) => {
                  adjustTextareaHeight();
                  setBox((prev) => ({
                    ...prev,
                    text: e.target.value,
                    width: Number(box.width) > 100 ? box.width : 220,
                    height: Number(box.height) > 100 ? box.height : 100,
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
