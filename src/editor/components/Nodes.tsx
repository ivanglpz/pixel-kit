import { iconsWithTools } from "@/assets";
import { css } from "@stylespixelkit/css";
import { useAtom, useSetAtom } from "jotai";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  CHANGE_PARENTID_NODE_ATOM,
  CHANGE_SHAPE_NODE_ATOM,
} from "../states/nodes";
import { SHAPE_ID_ATOM } from "../states/shape";
import { SHAPES_NODES } from "../states/shapes";

export const Nodes = ({
  item,
  SHAPES,
}: {
  item: SHAPES_NODES;
  SHAPES: SHAPES_NODES[];
}) => {
  const [value, setShape] = useAtom(item.state);
  const SET_CHANGE = useSetAtom(CHANGE_SHAPE_NODE_ATOM);
  const SET_PARENT_CHANGE = useSetAtom(CHANGE_PARENTID_NODE_ATOM);
  const setShapeId = useSetAtom(SHAPE_ID_ATOM);
  const [show, setShow] = useState(false);

  const [isExpanded, setIsExpanded] = useState(true);

  const handleDragStart = (e: React.DragEvent) => {
    setShapeId(item?.id);
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation(); // ✅ Detiene la propagación hacia el ul contenedor

    SET_CHANGE({ endId: item.id });
  };
  const handleDropOutside = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation(); // ✅ Detiene la propagación hacia el ul contenedor
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
          gridTemplateColumns: "15px 15px 150px",
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
          // width: "100%", // ← importante para que crezca según los hijos
          minWidth: 200,
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
        <div
          onClick={() => {}}
          onDoubleClick={() => {
            setShow(true);
          }}
          onBlur={() => setShow(false)}
          // quiero que si el cursor se salga entonces lo ponga en show false
          onMouseLeave={() => setShow(false)}
          //  onClick={onClick}
        >
          {show ? (
            <input
              type="text"
              value={value?.label}
              onChange={(e) => setShape({ ...value, label: e.target.value })}
              className={css({
                backgroundColor: "transparent",
                fontSize: "11px",
                border: "none",
              })}
            />
          ) : (
            <p
              className={css({
                textTransform: "capitalize",
                fontSize: "11px",
              })}
            >
              {value.label}
            </p>
          )}
        </div>
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
