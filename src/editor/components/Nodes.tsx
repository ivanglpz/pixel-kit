import { iconsWithTools } from "@/assets";
import { css } from "@stylespixelkit/css";
import { Reorder } from "framer-motion";
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
import { ADD_SHAPE_ID_ATOM } from "../states/shape";
import { ALL_SHAPES } from "../states/shapes";
import TOOL_ATOM, { PAUSE_MODE_ATOM } from "../states/tool";
import { UPDATE_UNDO_REDO } from "../states/undo-redo";

type NodeProps = {
  shape: ALL_SHAPES;
  options?: {
    isLockedByParent?: boolean;
    isHiddenByParent?: boolean;
  };
};

export const Nodes = ({ shape: item, options = {} }: NodeProps) => {
  const [shape, setShape] = useAtom(item.state);
  const [shapeId, setShapeId] = useAtom(ADD_SHAPE_ID_ATOM);
  const [show, setShow] = useState(false);
  const setPause = useSetAtom(PAUSE_MODE_ATOM);
  const setTool = useSetAtom(TOOL_ATOM);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const setUpdateUndoRedo = useSetAtom(UPDATE_UNDO_REDO);

  // Determinar si este elemento está bloqueado por herencia
  const isLockedByParent = options.isLockedByParent || false;
  const isHiddenByParent = options.isHiddenByParent || false;

  // Para los hijos, determinar qué propiedades heredar
  const childOptions = {
    isLockedByParent: isLockedByParent || shape.isLocked,
    isHiddenByParent: isHiddenByParent || !shape.visible,
  };

  const [children, setChildren] = useAtom(item.children);

  const handleReorder = (newOrder: typeof children) => {
    // Actualizar el orden de los shapes
    setChildren(newOrder);
    // Opcional: registrar en undo/redo
    setUpdateUndoRedo();
  };

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
      <div
        id={shape.id + ` ${shape.tool}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={css({
          color: "text",
          padding: "md",
          height: 30,
          fontSize: "sm",
          listStyle: "none",
          display: "grid",
          gridTemplateColumns: "15px 15px 80px 50px",
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
        })}
        onClick={() => {
          setTool("MOVE");
          setShapeId(shape?.id);
        }}
      >
        {shape.tool === "GROUP" && children.length > 0 ? (
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
          }}
          onBlur={() => {
            setPause(false);
            setShow(false);
          }}
        >
          {show ? (
            <input
              type="text"
              value={shape?.label}
              onChange={(e) => setShape({ ...shape, label: e.target.value })}
              className={css({
                backgroundColor: "transparent",
                fontSize: "x-small",
                border: "none",
              })}
              onFocus={() => setPause(true)}
              onBlur={() => setPause(false)}
            />
          ) : (
            <p
              className={css({
                textTransform: "capitalize",
                fontSize: "x-small",
                lineClamp: 1,
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
              <DotIcon
                strokeWidth={8}
                size={14}
                color={constants.theme.colors.primary}
              />
            ) : (
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
              <DotIcon
                strokeWidth={8}
                size={14}
                color={constants.theme.colors.primary}
              />
            ) : (
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
      </div>

      {children?.length > 0 && isExpanded && (
        <div
          style={{
            marginLeft: "20px", // Indentación visual para mostrar jerarquía
            marginTop: "4px",
          }}
          // Prevenir propagación de eventos de drag del padre
          onDragStart={(e) => e.stopPropagation()}
          onDragOver={(e) => e.stopPropagation()}
          onDrop={(e) => e.stopPropagation()}
        >
          <Reorder.Group
            key={shape.id}
            axis="y"
            values={children} // Usar el array completo de objetos
            onReorder={handleReorder}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            {children.map((childItem) => (
              <Reorder.Item
                key={childItem.id}
                value={childItem} // Pasar el objeto completo, igual que en el padre
                style={{
                  borderRadius: "6px",
                  cursor: "grab",
                  userSelect: "none",
                }}
                whileDrag={{
                  scale: 1.02,
                  boxShadow: "0px 3px 10px rgba(0,0,0,0.15)",
                  zIndex: 1000,
                }}
                // Prevenir interferencia con el drag del padre
                onDragStart={(e) => {
                  e.stopPropagation();
                }}
              >
                <Nodes shape={childItem} options={childOptions} />
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      )}
    </>
  );
};
