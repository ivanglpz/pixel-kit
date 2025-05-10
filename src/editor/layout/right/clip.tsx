import { Valid } from "@/components/valid";
import { Button } from "@/editor/components/button";
import { InputCheckbox } from "@/editor/components/input-checkbox";
import { InputText } from "@/editor/components/input-text";
import { Section } from "@/editor/components/section";
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
    <Section title=" Clip Image">
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
          text="Clip"
        />
        <Valid isValid={showClip}>
          <div>
            <InputText
              labelText="Width"
              value={`${Math.round(box.width || 0)}px`}
              onChange={() => {}}
            />
            <InputText
              labelText="Height"
              value={`${Math.round(box.height || 0)}px`}
              onChange={() => {}}
            />
          </div>
        </Valid>
        <section
          className={css({
            display: "flex",
            flexDirection: "row",
            gap: "lg",
          })}
        >
          <Valid isValid={showClip}>
            <Button
              onClick={() => {
                setTool("MOVE");
                handleResetImage();
              }}
            >
              Reset Clip
            </Button>
          </Valid>
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
                  setshowClip(false);
                };
                image.src = base64 ?? "";
              }}
            >
              Save Clip
            </Button>
          </Valid>
        </section>
      </div>
    </Section>
  );
};
