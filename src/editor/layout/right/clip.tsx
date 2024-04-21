import { Valid } from "@/components/valid";
import { Button } from "@/editor/components/button";
import { InputCheckbox } from "@/editor/components/input-checkbox";
import { useTool } from "@/editor/hooks";
import { useImageRender } from "@/editor/hooks/image/hook";
import { useReference } from "@/editor/hooks/reference";
import { boxClipAtom, showClipAtom } from "@/editor/jotai/clipImage";
import { css } from "@stylespixelkit/css";
import { useAtom, useAtomValue } from "jotai";

export const Clip = () => {
  const { setTool } = useTool();
  const [showClip, setshowClip] = useAtom(showClipAtom);
  const { handleResetImage, handleSetClipImage } = useImageRender();
  const { ref } = useReference({ type: "CLIP" });
  const box = useAtomValue(boxClipAtom);
  return (
    <div
      className={css({
        padding: "lg",
        display: "flex",
        flexDirection: "column",
        gap: "lg",
        backgroundColor: "primary",
        borderRadius: "lg",
        border: "container",
      })}
    >
      <div>
        <p
          className={css({
            fontSize: "sm",
            color: "text",
            fontWeight: "bold",
          })}
        >
          Clip Image
        </p>
      </div>
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: "md",
        })}
      >
        <InputCheckbox
          value={showClip}
          onCheck={(v) => {
            setTool("MOVE");
            setshowClip(v);
          }}
          text="Show Clip"
        />
        <Button
          onClick={() => {
            setTool("MOVE");
            handleResetImage();
          }}
        >
          Reset Clip
        </Button>
        <Valid isValid={showClip}>
          <Button
            type="success"
            onClick={() => {
              setTool("MOVE");
              const base64 = ref?.current?.toDataURL({
                quality: 1,
                //   pixelRatio: 3,
                x: box.x,
                y: box.y,
                width: box.width,
                height: box.height,
              });
              const image = new Image();
              image.onload = () => {
                handleSetClipImage({
                  base64: base64 ?? "",
                  name: "cliped",
                  height: image.height,
                  width: image.width,
                  x: 0,
                  y: 0,
                });
              };
              image.src = base64 ?? "";
            }}
          >
            Save Clip
          </Button>
        </Valid>
      </div>
    </div>
  );
};
