import { useSelectedShape, useTool } from "@/editor/core/hooks";
import { IKeyTool } from "@/editor/core/hooks/tool/types";
import { FC } from "react";
import icons from "@/assets/index";
import { css } from "@stylespixelkit/css";

const METHODS = [
  {
    icon: icons.cursor,
    keyMethod: "MOVE",
  },
  {
    icon: icons.group,
    keyMethod: "GROUP",
  },
  {
    icon: icons.box,
    keyMethod: "BOX",
  },
  {
    icon: icons.circle,
    keyMethod: "CIRCLE",
  },
  {
    icon: icons.line,
    keyMethod: "LINE",
  },
  {
    icon: icons.image,
    keyMethod: "IMAGE",
  },
  {
    icon: icons.text,
    keyMethod: "TEXT",
  },
  {
    icon: icons.code,
    keyMethod: "CODE",
  },
  // {
  //   icon: icons.peentool,
  //   keyMethod: "DRAW",
  // },
];

const LayoutEditorTop: FC = () => {
  const { tool, setTool } = useTool();
  const { handleCleanShapeSelected } = useSelectedShape();

  return (
    <div
      className={css({
        padding: "lg",
        position: "absolute",
        zIndex: 9,
        top: 5,
        backgroundColor: "primary",
        display: "flex",
        flexDirection: "column",
        borderRadius: "lg",
        gap: "md",
        border: "container",
      })}
    >
      <section
        className={css({
          display: "flex",
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        })}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask id="path-1-inside-1_865_433" fill="white">
            <path d="M43.5714 11H49V27.2857H43.5714V16.4286H16.4286V43.5714H27.2857V49H11V11H43.5714ZM32.7143 38.1429V32.7143H49V38.1429H43.5714V43.5714H38.1429V49H32.7143V38.1429ZM43.5714 43.5714V49H49V43.5714H43.5714Z" />
          </mask>
          <path
            d="M43.5714 11H49V27.2857H43.5714V16.4286H16.4286V43.5714H27.2857V49H11V11H43.5714ZM32.7143 38.1429V32.7143H49V38.1429H43.5714V43.5714H38.1429V49H32.7143V38.1429ZM43.5714 43.5714V49H49V43.5714H43.5714Z"
            fill="black"
          />
          <path
            d="M49 11H86V-26H49V11ZM49 27.2857V64.2857H86V27.2857H49ZM43.5714 27.2857H6.57143V64.2857H43.5714V27.2857ZM43.5714 16.4286H80.5714V-20.5714H43.5714V16.4286ZM16.4286 16.4286V-20.5714H-20.5714V16.4286H16.4286ZM16.4286 43.5714H-20.5714V80.5714H16.4286V43.5714ZM27.2857 43.5714H64.2857V6.57143H27.2857V43.5714ZM27.2857 49V86H64.2857V49H27.2857ZM11 49H-26V86H11V49ZM11 11V-26H-26V11H11ZM32.7143 32.7143V-4.28571H-4.28571V32.7143H32.7143ZM49 32.7143H86V-4.28571H49V32.7143ZM49 38.1429V75.1429H86V38.1429H49ZM43.5714 38.1429V1.14286H6.57143V38.1429H43.5714ZM38.1429 43.5714V6.57143H1.14286V43.5714H38.1429ZM38.1429 49V86H75.1429V49H38.1429ZM32.7143 49H-4.28571V86H32.7143V49ZM43.5714 49H6.57143V86H43.5714V49ZM49 49V86H86V49H49ZM49 43.5714H86V6.57143H49V43.5714ZM43.5714 48H49V-26H43.5714V48ZM12 11V27.2857H86V11H12ZM49 -9.71429H43.5714V64.2857H49V-9.71429ZM80.5714 27.2857V16.4286H6.57143V27.2857H80.5714ZM43.5714 -20.5714H16.4286V53.4286H43.5714V-20.5714ZM-20.5714 16.4286V43.5714H53.4286V16.4286H-20.5714ZM16.4286 80.5714H27.2857V6.57143H16.4286V80.5714ZM-9.71429 43.5714V49H64.2857V43.5714H-9.71429ZM27.2857 12H11V86H27.2857V12ZM48 49V11H-26V49H48ZM11 48H43.5714V-26H11V48ZM69.7143 38.1429V32.7143H-4.28571V38.1429H69.7143ZM32.7143 69.7143H49V-4.28571H32.7143V69.7143ZM12 32.7143V38.1429H86V32.7143H12ZM49 1.14286H43.5714V75.1429H49V1.14286ZM6.57143 38.1429V43.5714H80.5714V38.1429H6.57143ZM43.5714 6.57143H38.1429V80.5714H43.5714V6.57143ZM1.14286 43.5714V49H75.1429V43.5714H1.14286ZM38.1429 12H32.7143V86H38.1429V12ZM69.7143 49V38.1429H-4.28571V49H69.7143ZM6.57143 43.5714V49H80.5714V43.5714H6.57143ZM43.5714 86H49V12H43.5714V86ZM86 49V43.5714H12V49H86ZM49 6.57143H43.5714V80.5714H49V6.57143Z"
            fill="white"
            mask="url(#path-1-inside-1_865_433)"
          />
        </svg>
        <p
          className={css({
            color: "text",
            fontWeight: "bold",
            fontSize: "smaller",
          })}
        >
          Pixel Kit
        </p>
      </section>
      <section
        className={css({
          display: "flex",
          flexDirection: "row",
          gap: "md",
        })}
      >
        {METHODS?.map((item) => {
          const isSelected = item?.keyMethod === tool;
          return (
            <button
              key={`sidebar-methods-key-${item.keyMethod}`}
              className={css({
                backgroundGradient: isSelected ? "primary" : "transparent",
                padding: "md",
                borderRadius: "sm",
                width: "30px",
                height: "30px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "container",
              })}
              onClick={() => {
                setTool(item.keyMethod as IKeyTool);
                handleCleanShapeSelected();
              }}
            >
              {item?.icon}
            </button>
          );
        })}
      </section>
    </div>
  );
};

export default LayoutEditorTop;
