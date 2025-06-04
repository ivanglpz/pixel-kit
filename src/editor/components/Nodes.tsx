import { iconsWithTools } from "@/assets";
import { css } from "@stylespixelkit/css";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";
import { useSelectedShape } from "../hooks";
import { CHANGE_SHAPE_NODE_ATOM, NODE_ATOM } from "../states/nodes";
import { SHAPES_NODES } from "../states/shapes";

export const Nodes = ({ item }: { item: SHAPES_NODES }) => {
  const value = useAtomValue(item.state);
  const setDraggedNode = useSetAtom(NODE_ATOM);
  const [childrens] = useAtom(item.childrens);

  const SET_CHANGE = useSetAtom(CHANGE_SHAPE_NODE_ATOM);
  const handleDragStart = (e: React.DragEvent) => {
    setDraggedNode(item);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    SET_CHANGE({ id: item.id });
  };

  const { shapeSelected, handleSetShapeSelected } = useSelectedShape();

  const [isExpanded, setIsExpanded] = useState(true); // ← toggle state

  return (
    <>
      <li
        id={value.id + ` ${value.tool}`}
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={css({
          color: "text",
          padding: "md",
          borderTopRightRadius: "md",
          borderBottomRightRadius: "md",
          fontSize: "sm",
          listStyle: "none",
          display: "grid",
          gridTemplateColumns: "12px 10px 50px 10px",
          flexDirection: "row",
          alignItems: "center",
          gap: "lg",
          _hover: {
            backgroundColor: "primary",
          },
          cursor: "pointer",
          width: "100%", // ← importante para que crezca según los hijos
        })}
        onClick={() => {
          handleSetShapeSelected(value);
        }}
      >
        {value.tool === "GROUP" && childrens.length > 0 ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded((prev) => !prev);
            }}
            className={css({
              marginLeft: "auto",
              backgroundColor: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
              fontSize: "sm",
            })}
          >
            {isExpanded ? (
              <svg
                width="20"
                height="18"
                viewBox="0 0 20 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.42653 12.3894L3.76953 6.73236L5.18353 5.31836L10.1335 10.2684L15.0835 5.31836L16.4975 6.73236L10.8405 12.3894C10.653 12.5768 10.3987 12.6821 10.1335 12.6821C9.86837 12.6821 9.61406 12.5768 9.42653 12.3894Z"
                  fill="white"
                />
              </svg>
            ) : (
              <svg
                width="19"
                height="20"
                viewBox="0 0 19 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.8894 10.7063L7.23236 16.3633L5.81836 14.9493L10.7684 9.99928L5.81836 5.04928L7.23236 3.63528L12.8894 9.29228C13.0768 9.47981 13.1821 9.73412 13.1821 9.99928C13.1821 10.2644 13.0768 10.5188 12.8894 10.7063Z"
                  fill="white"
                />
              </svg>
            )}

            {/* {isExpanded ? "➖" : "➕"} */}
          </button>
        ) : (
          <div></div>
        )}
        {iconsWithTools[value.tool]}

        <p>{value.tool}</p>
        <div
          className={css({
            backgroundGradient:
              value.id === shapeSelected.id ? "primary" : "transparent",
            width: "100%",
            height: "10px",
            borderRadius: "lg",
          })}
        ></div>
      </li>
      {childrens?.length > 0 && isExpanded && (
        <ul
          className={css({
            marginLeft: "15px",
            display: "flex",
            flexDirection: "column",
            gap: "md",
            borderLeft: "1px solid #212121",
            width: "max-content", // ← importante para que crezca según los hijos
          })}
        >
          {childrens.map((e) => (
            <Nodes key={value.id + e.tool + e.id + "childrens"} item={e} />
          ))}
        </ul>
      )}
    </>
  );
};
