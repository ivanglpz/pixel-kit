import { iconsWithTools } from "@/assets";
import { css } from "@stylespixelkit/css";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { CHANGE_PARENT_ID_ATOM, CHANGE_SHAPE_NODE_ATOM } from "../states/nodes";
import { SHAPE_ID_ATOM } from "../states/shape";
import { SHAPES_NODES } from "../states/shapes";

export const Nodes = ({
  item,
  SHAPES,
}: {
  item: SHAPES_NODES;
  SHAPES: SHAPES_NODES[];
}) => {
  const value = useAtomValue(item.state);
  const SET_CHANGE = useSetAtom(CHANGE_SHAPE_NODE_ATOM);
  const SET_PARENT_CHANGE = useSetAtom(CHANGE_PARENT_ID_ATOM);
  const [shapeId, setShapeId] = useAtom(SHAPE_ID_ATOM);

  const [isExpanded, setIsExpanded] = useState(true);

  const handleDragStart = (e: React.DragEvent) => {
    setShapeId(item?.id);
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    console.log("hover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation(); // ✅ Detiene la propagación hacia el ul contenedor

    console.log("end");
    console.log(item?.id);

    SET_CHANGE({ endId: item.id });
  };
  const handleDropOutside = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation(); // ✅ Detiene la propagación hacia el ul contenedor
    console.log(item?.id);

    console.log("Drop fuera de cualquier nodo GROUP");
    SET_PARENT_CHANGE({ endId: item?.id });
    // CLEAR_PARENT({ endId: null }); // <- Esto quitará el parentId
  };

  const childrens =
    item?.tool === "GROUP"
      ? SHAPES?.filter((e) => e?.parentId === item?.id)
      : [];
  return (
    <>
      <li
        id={value.id + ` ${value.tool}`}
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        // onDrop={handleDrop}
        className={css({
          color: "text",
          padding: "sm",
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
        onClick={() => setShapeId(value?.id)}
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
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
          </button>
        ) : (
          <div></div>
        )}
        {iconsWithTools[value.tool]}

        <p
          className={css({
            textTransform: "capitalize",
            fontSize: "11px",
          })}
          // onPointerDown={(e) => controls.start(e)}
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
            gap: "lg",
            borderLeftColor: "primary",
            borderLeftWidth: 2,
          })}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropOutside}
        >
          {childrens.map((child) => (
            <Nodes key={`child-${child.id}`} SHAPES={SHAPES} item={child} />
          ))}
        </ul>
      )}
    </>
  );
};
