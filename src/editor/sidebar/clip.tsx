import { useReference } from "@/editor/hooks/useReference";
import { CLIP_DIMENSION_ATOM, SHOW_CLIP_ATOM } from "@/editor/states/clipImage";
import { css } from "@stylespixelkit/css";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Input } from "../components/input";
import { IMAGE_RENDER_ATOM, RESTORE_ORIGINAL_RENDER } from "../states/image";
import TOOL_ATOM from "../states/tool";

export const Clip = () => {
  const { ref } = useReference({ type: "CLIP" });
  const setTool = useSetAtom(TOOL_ATOM);
  const [showClip, setshowClip] = useAtom(SHOW_CLIP_ATOM);
  const reset = useSetAtom(RESTORE_ORIGINAL_RENDER);
  const setClipImage = useSetAtom(IMAGE_RENDER_ATOM);
  const box = useAtomValue(CLIP_DIMENSION_ATOM);

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
      <p
        className={css({
          color: "text",
          fontWeight: "600",
          fontSize: "x-small",
          height: "15px",
        })}
      >
        Dimensions
      </p>
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "2",
          gap: "md",
        })}
      >
        <Input.Container>
          <Input.Grid>
            <Input.IconContainer>
              <p
                className={css({
                  fontWeight: 600,
                  fontSize: "x-small",
                })}
              >
                W
              </p>
              {/* <MoveHorizontal size={constants.icon.size} /> */}
            </Input.IconContainer>
            <Input.Number
              step={1}
              min={0}
              value={Number(box.width) || 0}
              onChange={(v) => {}}
            />
          </Input.Grid>
        </Input.Container>
        <Input.Container>
          <Input.Grid>
            <Input.IconContainer>
              <p
                className={css({
                  fontWeight: 600,
                  fontSize: "x-small",
                })}
              >
                H
              </p>
              {/* <MoveHorizontal size={constants.icon.size} /> */}
            </Input.IconContainer>
            <Input.Number
              step={1}
              min={0}
              value={Number(box.height) || 0}
              onChange={(v) => {}}
            />
          </Input.Grid>
        </Input.Container>
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
            reset();
            setshowClip(false);
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
              x: box.x,
              y: box.y,
              width: box.width,
              height: box.height,
            });
            if (!base64) {
              throw new Error("Clip base 64 is require");
            }
            const image = new Image();
            image.onload = () => {
              setClipImage({
                base64: base64,
                name: "cliped",
                height: image.height,
                width: image.width,
                x: 0,
                y: 0,
              });
              setshowClip(false);
            };
            image.src = base64;
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
