import { useSelectedShape, useTool } from "@/editor/hooks";
import { IKeyTool } from "@/editor/hooks/tool/types";
import { FC } from "react";
import icons from "@/assets/index";
import { css } from "@stylespixelkit/css";
import LayoutEditorSidebarLeft from "./left";

const METHODS = [
  {
    icon: icons.cursor,
    keyMethod: "MOVE",
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
  // {
  //   icon: icons.code,
  //   keyMethod: "CODE",
  // },
  {
    icon: icons.peentool,
    keyMethod: "DRAW",
  },
];

const ToolsTop: FC = () => {
  const { tool, setTool } = useTool();
  const { handleCleanShapeSelected } = useSelectedShape();

  return (
    <div
      className={css({
        padding: "lg",
        backgroundColor: "primary",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        // borderRadius: "lg",
        width: "100%",
        gap: "lg",
        border: "container",
      })}
    >
      <section
        className={css({
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: "md",
        })}
      >
        <svg
          width="34"
          height="34"
          viewBox="0 0 34 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="0.5"
            y="0.5"
            width="33"
            height="33"
            rx="3.5"
            fill="#252727"
          />
          <rect
            x="0.5"
            y="0.5"
            width="33"
            height="33"
            rx="3.5"
            stroke="#555555"
          />
          <mask
            id="mask0_50_334"
            // style="mask-type:luminance"
            style={{
              maskType: "luminance",
            }}
            maskUnits="userSpaceOnUse"
            x="10"
            y="10"
            width="14"
            height="14"
          >
            <path
              d="M22 10H24V16H22V12H12V22H16V24H10V10H22ZM18 20V18H24V20H22V22H20V24H18V20ZM22 22V24H24V22H22Z"
              fill="white"
            />
          </mask>
          <g mask="url(#mask0_50_334)">
            <path
              d="M24 9.99999H37.6316V-3.63159H24V9.99999ZM24 16V29.6316H37.6316V16H24ZM22 16H8.36841V29.6316H22V16ZM22 12H35.6316V-1.63158H22V12ZM12 12V-1.63158H-1.63158V12H12ZM12 22H-1.63158V35.6316H12V22ZM16 22H29.6316V8.36841H16V22ZM16 24V37.6316H29.6316V24H16ZM9.99999 24H-3.63159V37.6316H9.99999V24ZM9.99999 9.99999V-3.63159H-3.63159V9.99999H9.99999ZM18 18V4.36841H4.36841V18H18ZM24 18H37.6316V4.36841H24V18ZM24 20V33.6316H37.6316V20H24ZM22 20V6.36841H8.36841V20H22ZM20 22V8.36841H6.36841V22H20ZM20 24V37.6316H33.6316V24H20ZM18 24H4.36841V37.6316H18V24ZM22 24H8.36841V37.6316H22V24ZM24 24V37.6316H37.6316V24H24ZM24 22H37.6316V8.36841H24V22ZM22 23.6316H24V-3.63159H22V23.6316ZM10.3684 9.99999V16H37.6316V9.99999H10.3684ZM24 2.36841H22V29.6316H24V2.36841ZM35.6316 16V12H8.36841V16H35.6316ZM22 -1.63158H12V25.6316H22V-1.63158ZM-1.63158 12V22H25.6316V12H-1.63158ZM12 35.6316H16V8.36841H12V35.6316ZM2.36841 22V24H29.6316V22H2.36841ZM16 10.3684H9.99999V37.6316H16V10.3684ZM23.6316 24V9.99999H-3.63159V24H23.6316ZM9.99999 23.6316H22V-3.63159H9.99999V23.6316ZM31.6316 20V18H4.36841V20H31.6316ZM18 31.6316H24V4.36841H18V31.6316ZM10.3684 18V20H37.6316V18H10.3684ZM24 6.36841H22V33.6316H24V6.36841ZM8.36841 20V22H35.6316V20H8.36841ZM22 8.36841H20V35.6316H22V8.36841ZM6.36841 22V24H33.6316V22H6.36841ZM20 10.3684H18V37.6316H20V10.3684ZM31.6316 24V20H4.36841V24H31.6316ZM8.36841 22V24H35.6316V22H8.36841ZM22 37.6316H24V10.3684H22V37.6316ZM37.6316 24V22H10.3684V24H37.6316ZM24 8.36841H22V35.6316H24V8.36841Z"
              fill="white"
            />
          </g>
        </svg>

        <p
          className={css({
            color: "text",
            fontWeight: "bold",
            fontSize: "md",
            "@media(max-width:605px)": {
              display: "none",
            },
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
      <section
        className={css({
          display: "flex",
          flexDirection: "row",
          width: "200px",
          gap: "lg",
        })}
      >
        <LayoutEditorSidebarLeft />
      </section>
    </div>
  );
};

export default ToolsTop;
