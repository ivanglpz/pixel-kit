import { useTool } from "@/editor/hooks";
import { useImageRender } from "@/editor/hooks/useImageRender";
import { useReference } from "@/editor/hooks/useReference";
import { boxClipAtom, showClipAtom } from "@/editor/states/clipImage";
import { css } from "@stylespixelkit/css";
import { useAtom, useAtomValue } from "jotai";
import { InputNumber } from "../components/input-number";

export const Clip = () => {
  const { setTool } = useTool();
  const [showClip, setshowClip] = useAtom(showClipAtom);
  const { handleResetImage, handleSetClipImage } = useImageRender();
  const { ref } = useReference({ type: "CLIP" });
  const box = useAtomValue(boxClipAtom);
  if (!showClip) return null;
  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "md",
      })}
    >
      <p
        className={css({
          paddingBottom: "md",
          paddingTop: "sm",
          fontWeight: "bold",
          fontSize: "sm",
        })}
      >
        Layout
      </p>
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "2",
          gap: "md",
        })}
      >
        <InputNumber
          iconType="width"
          labelText="Dimensions"
          value={Number(box.width)}
          onChange={() => {}}
        />
        <InputNumber
          iconType="height"
          labelText=""
          value={Number(box.height)}
          onChange={() => {}}
        />
      </div>

      <section
        className={css({
          display: "flex",
          flexDirection: "row",
          gap: "md",
          justifyContent: "end",
        })}
      >
        <button
          className={css({
            padding: "md",
            borderColor: "border",
            borderWidth: 1,
            borderRadius: "md",
            backgroundColor: "gray.800",
            py: "5",
            px: "10",
            height: "35px",
          })}
          onClick={() => {
            handleResetImage();
          }}
        >
          <p
            className={css({
              fontSize: "sm",
            })}
          >
            Reset
          </p>
        </button>
        <button
          className={css({
            padding: "md",
            borderColor: "border",
            borderWidth: 1,
            borderRadius: "md",
            backgroundColor: "primary",
            py: "5",
            px: "10",
            height: "35px",
          })}
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
              setshowClip(false);
            };
            image.src = base64 ?? "";
          }}
        >
          <p
            className={css({
              fontSize: "sm",
            })}
          >
            Save
          </p>
        </button>
      </section>
    </div>
  );
};
