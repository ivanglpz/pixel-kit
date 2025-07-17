import { iconsWithTools } from "@/assets";
import { css } from "@stylespixelkit/css";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { CHANGE_SHAPE_NODE_ATOM, NODE_ATOM } from "../states/nodes";
import { SHAPE_ID_ATOM } from "../states/shape";
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

  const [shapeId, setShapeId] = useAtom(SHAPE_ID_ATOM);
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
          fontSize: "sm",
          listStyle: "none",
          display: "grid",
          gridTemplateColumns: "15px 15px 50px 10px",
          flexDirection: "row",
          alignItems: "center",
          gap: "lg",
          _hover: {
            backgroundColor: "gray.100",
            _dark: {
              backgroundColor: "gray.800",
            },
          },
          cursor: "pointer",
          width: "100%", // ← importante para que crezca según los hijos
        })}
        onClick={() => {
          setShapeId(value?.id);
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
              border: "none",
              color: "white",
              cursor: "pointer",
              fontSize: "sm",
              _hover: {
                backgroundColor: "primary",
              },
            })}
          >
            {isExpanded ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>
        ) : (
          <div></div>
        )}
        {iconsWithTools[value.tool]}

        <p
          className={css({
            textTransform: "capitalize",
          })}
        >
          {value.tool?.toLowerCase()}
        </p>
      </li>
      {childrens?.length > 0 && isExpanded && (
        <ul
          className={css({
            marginLeft: "25px",
            display: "flex",
            flexDirection: "column",
            gap: "md",
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
