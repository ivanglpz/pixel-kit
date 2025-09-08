import { Valid } from "@/components/valid";
import { Button } from "@/editor/components/button";
import { InputSelect } from "@/editor/components/input-select";
import { InputText } from "@/editor/components/input-text";
import { useConfiguration } from "@/editor/hooks/useConfiguration";
import { useReference } from "@/editor/hooks/useReference";
import { SHOW_CLIP_ATOM } from "@/editor/states/clipImage";
import { css } from "@stylespixelkit/css";
import { useAtom, useAtomValue } from "jotai";

import Link from "next/link";
import { useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { STAGE_DIMENSION_ATOM } from "../states/dimension";
import { typeExportAtom } from "../states/export";
import { IMAGE_RENDER_ATOM } from "../states/image";
import ALL_SHAPES_ATOM from "../states/shapes";
import { ImageConfiguration } from "./image-config";

const formats = {
  LOW: 0.8,
  MEDIUM: 1,
  HIGH: 1.8,
  BIG_HIGH: 2.6,
  ULTRA_HIGH: 3.5,
};

function downloadBase64Image(base64String: string) {
  var link = document.createElement("a");
  link.download = `pixel-kit-edition-${uuidv4()?.slice(0, 4)}.jpg`;
  link.href = base64String;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const ExportStage = () => {
  const { ref } = useReference({ type: "STAGE" });
  const { config } = useConfiguration();
  const imageRender = useAtomValue(IMAGE_RENDER_ATOM);

  const [loading, setloading] = useState(false);
  const { height, width } = useAtomValue(STAGE_DIMENSION_ATOM);
  const ALL_SHAPES = useAtomValue(ALL_SHAPES_ATOM);
  const [format, setformat] = useAtom(typeExportAtom);
  const [showExport, setShowExport] = useState(false);
  const [showClip, setshowClip] = useAtom(SHOW_CLIP_ATOM);
  const handleExport = async () => {
    toast.success("Thank you very much for using pixel kit!", {
      description: (
        <div>
          <p>
            Your edition is exporting. If you want to know more about pixel kit
            you can follow me on{" "}
            <Link
              href={"https://twitter.com/ivanglpz"}
              target="_blank"
              className={css({
                textDecoration: "underline",
              })}
            >
              Twitter(X)
            </Link>
          </p>
        </div>
      ),
    });

    setloading(true);
    if (config?.export_mode === "DESIGN_MODE") {
    }
    if (config?.export_mode === "FREE_DRAW") {
    }
    if (config?.export_mode === "EDIT_IMAGE") {
    }
  };

  const Container = document.getElementById("pixel-app");

  return (
    <>
      <Valid isValid={showExport}>
        {Container
          ? createPortal(
              <main
                className={css({
                  position: "absolute",
                  top: 0,
                  zIndex: 9999,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0,0,0,0.6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                })}
                onClick={() => setShowExport(false)}
              >
                <div
                  className={css({
                    padding: "lg",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "bg",
                    borderRadius: "lg",
                    border: "container",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    width: 300,
                    // minHeight: 320,
                    gap: "lg",
                  })}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className={css({
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      alignItems: "center",
                    })}
                  >
                    <p
                      className={css({
                        fontSize: "md",
                        color: "text",
                        fontWeight: "bold",
                      })}
                    >
                      Export
                    </p>
                    <button
                      className={css({
                        padding: "sm",
                        cursor: "pointer",
                      })}
                      onClick={() => setShowExport(false)}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z"
                          fill="white"
                        />
                      </svg>
                    </button>
                  </div>

                  <p
                    className={css({
                      color: "text",
                      fontSize: "sm",
                      opacity: 0.7,
                    })}
                  >
                    Export your edit to the quality you prefer the most.
                  </p>
                  <div
                    className={css({
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                      height: "100%",
                      gap: "md",
                    })}
                  >
                    <InputSelect
                      labelText="Format Quality"
                      options={[
                        {
                          id: "1",
                          label: "Low",
                          value: "LOW",
                        },
                        {
                          id: "2",
                          label: "Medium",
                          value: "MEDIUM",
                        },
                        {
                          id: "3",
                          label: "High",
                          value: "HIGH",
                        },
                        {
                          id: "4",
                          label: "Big High",
                          value: "BIG_HIGH",
                        },
                        {
                          id: "4",
                          label: "Ultra High",
                          value: "ULTRA_HIGH",
                        },
                      ]}
                      onChange={(e) => setformat(e)}
                      value={format}
                    />
                    <Valid isValid={config?.export_mode === "EDIT_IMAGE"}>
                      <InputText
                        labelText="Resolution"
                        value={`${imageRender.width}x${imageRender?.height}`}
                        onChange={() => {}}
                        disable
                      />
                    </Valid>
                  </div>
                  <Button
                    text="Export Now"
                    onClick={() => handleExport()}
                    isLoading={loading}
                    fullWidth={false}
                  ></Button>
                </div>
              </main>,
              Container
            )
          : null}
      </Valid>
      <p
        className={css({
          paddingBottom: "md",
          paddingTop: "sm",
          fontWeight: "bold",
          fontSize: "sm",
        })}
      >
        Export
      </p>

      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "2",
          gap: "md",
        })}
      >
        <Valid isValid={config?.show_files_browser}>
          <ImageConfiguration />
        </Valid>
        <Valid isValid={!config?.show_files_browser}>
          <div></div>
        </Valid>
        <button
          className={css({
            padding: "md",
            borderColor: "green.light.200",
            borderWidth: 1,
            borderRadius: "md",
            backgroundColor: "green.dark.600",
            py: "5",
            px: "10",
            height: "35px",
          })}
          onClick={() => setShowExport(true)}
        >
          <p
            className={css({
              fontSize: "sm",
              color: "black",
              fontWeight: "600",
            })}
          >
            Export
          </p>
        </button>
      </div>
    </>
  );
};
