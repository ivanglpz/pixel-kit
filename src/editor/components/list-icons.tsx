import { css } from "@stylespixelkit/css";
import { useSetAtom } from "jotai";
import { X } from "lucide-react";
import * as AllIcons from "lucide-static";
import { useState } from "react";
import { PAUSE_MODE_ATOM } from "../states/tool";

const iconObjects: { [key: string]: string }[] = Object.entries(AllIcons).map(
  ([name, svg]) => ({ name, svg })
);

type ListIconsProps = {
  onCreate: (svg: string, svgName: string) => void;
  onClose: VoidFunction;
};
export const ListIcons = ({ onCreate, onClose }: ListIconsProps) => {
  const [query, setquery] = useState("");
  const setPause = useSetAtom(PAUSE_MODE_ATOM);

  return (
    <div
      className={css({
        padding: "lg",
        gap: "lg",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "bg",
        borderRadius: "lg",
        border: "container",
        maxWidth: 600,
        width: "100%",
        maxHeight: 520,
        height: "100%",
        gridAutoRows: "60px",
      })}
      onClick={(e) => e?.stopPropagation()}
    >
      <header
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: "lg",
          paddingTop: "md",
        })}
      >
        <div
          className={css({
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          })}
        >
          <p
            className={css({
              fontWeight: "bold",
            })}
          >
            Lucide Icons
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className={css({
              width: 30,
              height: 30,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "lg",
              _hover: {
                backgroundColor: "gray.600",
              },
            })}
          >
            <X size={14} />
          </button>
        </div>
        <div>
          <input
            type="text"
            value={query}
            placeholder="Search a icon..."
            className={css({
              width: "100%",
              border: "container",
              backgroundColor: "transparent",
              color: "text",
              padding: "sm",
              height: "30px",
              borderRadius: "md",
              fontSize: "sm",
            })}
            onFocus={() => setPause(true)} // Inicia pausa al entrar en el input
            onBlur={() => setPause(false)} // Quita pausa al salir del input
            onChange={(e) => setquery(e?.target.value)}
          />
        </div>
      </header>
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(40px, 1fr))",
          gap: "lg",
          gridAutoRows: "40px",
          overflowY: "scroll",
        })}
      >
        {iconObjects
          .filter((e) =>
            e.name.toLowerCase().includes(query.toLowerCase().trim())
          )
          ?.map((e) => (
            <button
              key={`icon-${e.name}`}
              className={css({
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "lg",
                _hover: {
                  backgroundColor: "gray.600",
                },
              })}
              onClick={() => {
                const parser = new DOMParser();
                const svgDOM = parser
                  .parseFromString(e.svg, "image/svg+xml")
                  .querySelector("svg");

                if (svgDOM) {
                  const serializer = new XMLSerializer();
                  const svgString = serializer.serializeToString(svgDOM);
                  onCreate(svgString, e.name);
                }
              }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: e.svg,
                }}
              />
            </button>
          ))}
      </div>
    </div>
  );
};
