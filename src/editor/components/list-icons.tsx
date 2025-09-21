import { css } from "@stylespixelkit/css";
import * as AllIcons from "lucide-static";

const iconObjects: { [key: string]: string }[] = Object.entries(AllIcons).map(
  ([name, svg]) => ({ name, svg })
);

type ListIconsProps = {
  onCreate: (svg: string, svgName: string) => void;
};
export const ListIcons = ({ onCreate }: ListIconsProps) => {
  return (
    <div
      className={css({
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(40px, 1fr))",
        gap: "lg",
        gridAutoRows: "40px",
        overflowY: "scroll",
      })}
    >
      {iconObjects?.map((e) => (
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
  );
};
