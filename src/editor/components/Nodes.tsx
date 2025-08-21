import { iconsWithTools } from "@/assets";
import { css } from "@stylespixelkit/css";
import { useAtom, useSetAtom } from "jotai";
import {
  ChevronDown,
  ChevronRight,
  DotIcon,
  Eye,
  EyeClosed,
  Lock,
  Unlock,
} from "lucide-react";
import { useState } from "react";
import { constants } from "../constants/color";
import {
  CHANGE_PARENTID_NODE_ATOM,
  CHANGE_SHAPE_NODE_ATOM,
} from "../states/nodes";
import { ADD_SHAPE_ID_ATOM } from "../states/shape";
import { ALL_SHAPES } from "../states/shapes";
import TOOL_ATOM, { PAUSE_MODE_ATOM } from "../states/tool";

type NodeProps = {
  shape: ALL_SHAPES;
  listShapes: ALL_SHAPES[];
  options?: {
    isLockedByParent?: boolean;
    isHiddenByParent?: boolean;
  };
};

export const Nodes = ({
  shape: item,
  listShapes: SHAPES,
  options = {},
}: NodeProps) => {
  const [shape, setShape] = useAtom(item.state);
  const SET_CHANGE = useSetAtom(CHANGE_SHAPE_NODE_ATOM);
  const SET_PARENT_CHANGE = useSetAtom(CHANGE_PARENTID_NODE_ATOM);
  const [shapeId, setShapeId] = useAtom(ADD_SHAPE_ID_ATOM);
  const [show, setShow] = useState(false);
  const setPause = useSetAtom(PAUSE_MODE_ATOM);
  const setTool = useSetAtom(TOOL_ATOM);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Determinar si este elemento está bloqueado por herencia
  const isLockedByParent = options.isLockedByParent || false;
  const isHiddenByParent = options.isHiddenByParent || false;

  // Para los hijos, determinar qué propiedades heredar
  const childOptions = {
    isLockedByParent: isLockedByParent || shape.isLocked,
    isHiddenByParent: isHiddenByParent || !shape.visible,
  };

  const handleDragStart = (e: React.DragEvent) => {
    setShapeId(item?.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    SET_CHANGE({ endId: item.id });
  };

  const handleDropOutside = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    SET_PARENT_CHANGE({ endId: item?.id });
  };

  const childrens =
    item?.tool === "GROUP"
      ? SHAPES?.filter((e) => e?.parentId === item?.id)
      : [];

  // Función para manejar el toggle de isLocked
  const handleLockToggle = () => {
    if (!isLockedByParent) {
      setShape({
        ...shape,
        isLocked: !shape.isLocked,
      });
    }
  };

  // Función para manejar el toggle de visible
  const handleVisibilityToggle = () => {
    if (!isHiddenByParent) {
      setShape({
        ...shape,
        visible: !shape.visible,
      });
    }
  };

  return (
    <>
      <li
        id={shape.id + ` ${shape.tool}`}
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={css({
          color: "text",
          padding: "md",
          height: 30,
          fontSize: "sm",
          listStyle: "none",
          display: "grid",
          gridTemplateColumns: "15px 15px 120px 50px",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: "md",
          borderRadius: "md",
          backgroundColor: shapeId.includes(shape.id)
            ? "gray.800"
            : "transparent",
          _hover: {
            backgroundColor: "gray.100",
            _dark: {
              backgroundColor: "gray.800",
            },
          },
          cursor: "pointer",
          width: 230,
        })}
        onClick={() => {
          setTool("MOVE");
          setShapeId(shape?.id);
        }}
      >
        {shape.tool === "GROUP" && childrens.length > 0 ? (
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
              borderRadius: "2px",
            })}
          >
            {isExpanded ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
          </button>
        ) : (
          <span></span>
        )}

        {iconsWithTools[shape.tool]}

        <div
          onDoubleClick={() => {
            setShow(true);
            setPause(true);
          }}
          onBlur={() => {
            setShow(false);
            setPause(false);
          }}
          onMouseLeave={() => {
            setShow(false);
            setPause(false);
          }}
        >
          {show ? (
            <input
              type="text"
              value={shape?.label}
              onChange={(e) => setShape({ ...shape, label: e.target.value })}
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
              {shape.label}
            </p>
          )}
        </div>

        <div
          className={css({
            display: "grid",
            gridTemplateColumns: "2",
            justifyContent: "center",
            alignItems: "center",
          })}
        >
          {/* Lock/Unlock Section */}
          <div
            className={css({
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            })}
          >
            {isLockedByParent ? (
              // Si está bloqueado por el padre, mostrar dot
              <DotIcon
                strokeWidth={8}
                size={14}
                color={constants.theme.colors.primary}
              />
            ) : (
              // Si no está bloqueado por el padre, mostrar controles normales
              <>
                {!isHovered && shape.isLocked ? (
                  <Lock size={14} color={constants.theme.colors.primary} />
                ) : null}

                {isHovered ? (
                  <button onClick={handleLockToggle}>
                    {shape.isLocked ? (
                      <Lock size={14} color={constants.theme.colors.primary} />
                    ) : (
                      <Unlock size={14} />
                    )}
                  </button>
                ) : null}
              </>
            )}
          </div>

          {/* Visibility Section */}
          <div
            className={css({
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            })}
          >
            {isHiddenByParent ? (
              // Si está oculto por el padre, mostrar dot
              <DotIcon
                strokeWidth={8}
                size={14}
                color={constants.theme.colors.primary}
              />
            ) : (
              // Si no está oculto por el padre, mostrar controles normales
              <>
                {!isHovered && !shape.visible ? (
                  <EyeClosed size={14} color={constants.theme.colors.primary} />
                ) : null}

                {isHovered ? (
                  <button onClick={handleVisibilityToggle}>
                    {shape.visible ? (
                      <Eye size={14} />
                    ) : (
                      <EyeClosed
                        size={14}
                        color={constants.theme.colors.primary}
                      />
                    )}
                  </button>
                ) : null}
              </>
            )}
          </div>
        </div>
      </li>

      {childrens?.length > 0 && isExpanded && (
        <ul
          className={css({
            marginLeft: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "sm",
            borderLeftColor: "primary",
            borderLeftWidth: 2,
          })}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropOutside}
        >
          {childrens.map((child) => (
            <Nodes
              key={`child-${child.id}`}
              listShapes={SHAPES}
              shape={child}
              options={childOptions}
            />
          ))}
        </ul>
      )}
    </>
  );
};
