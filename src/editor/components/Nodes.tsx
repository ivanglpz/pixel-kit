import { iconsWithTools } from "@/assets";
import { css } from "@stylespixelkit/css";
import { DragControls, Reorder, useDragControls } from "framer-motion";
import { useAtom, useSetAtom } from "jotai";
import {
  ChevronDown,
  ChevronRight,
  DotIcon,
  Eye,
  EyeClosed,
  GripVertical,
  Lock,
  Unlock,
} from "lucide-react";
import { useCallback, useState } from "react";
import { constants } from "../constants/color";
import { SHAPE_IDS_ATOM } from "../states/shape";
import { ALL_SHAPES } from "../states/shapes";
import TOOL_ATOM, { PAUSE_MODE_ATOM } from "../states/tool";
import { UPDATE_UNDO_REDO } from "../states/undo-redo";

type NodeProps = {
  shape: ALL_SHAPES;
  options?: {
    isLockedByParent?: boolean;
    isHiddenByParent?: boolean;
  };
  dragControls: DragControls;
};

type DraggableNodeItemProps = {
  childItem: ALL_SHAPES;
  childOptions: {
    isLockedByParent?: boolean;
    isHiddenByParent?: boolean;
  };
};

export const DraggableNodeItem = ({
  childItem,
  childOptions,
}: DraggableNodeItemProps) => {
  const childDragControls = useDragControls();

  return (
    <Reorder.Item
      key={childItem.id}
      value={childItem}
      dragListener={false} // Deshabilitamos el listener automático
      dragControls={childDragControls} // Usamos controles manuales
      style={{
        borderRadius: "6px",
        userSelect: "none",
      }}
      whileDrag={{
        scale: 1.02,
        boxShadow: "0px 3px 10px rgba(0,0,0,0.15)",
        zIndex: 1000,
        cursor: "grabbing",
      }}
    >
      <Nodes
        shape={childItem}
        options={childOptions}
        dragControls={childDragControls} // ✅ Pasamos los controles específicos
      />
    </Reorder.Item>
  );
};

export const Nodes = ({
  shape: item,
  options = {},
  dragControls: externalDragControls, // ✅ Recibimos controles externos
}: NodeProps) => {
  const [shape, setShape] = useAtom(item.state);
  const [shapeId, setShapeId] = useAtom(SHAPE_IDS_ATOM);
  const [show, setShow] = useState(false);
  const setPause = useSetAtom(PAUSE_MODE_ATOM);
  const setTool = useSetAtom(TOOL_ATOM);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const setUpdateUndoRedo = useSetAtom(UPDATE_UNDO_REDO);

  // ✅ Usar controles externos si están disponibles, sino crear propios
  const dragControls = externalDragControls;

  // Determinar si este elemento está bloqueado por herencia
  const isLockedByParent = options.isLockedByParent || false;
  const isHiddenByParent = options.isHiddenByParent || false;

  // Para los hijos, determinar qué propiedades heredar
  const childOptions = {
    isLockedByParent: isLockedByParent || shape.isLocked,
    isHiddenByParent: isHiddenByParent || !shape.visible,
  };

  const [children, setChildren] = useAtom(item.children);

  const handleReorder = useCallback(
    (newOrder: typeof children) => {
      setChildren(newOrder);
      setUpdateUndoRedo();
    },
    [setChildren, setUpdateUndoRedo]
  );

  // Función para manejar el toggle de isLocked
  const handleLockToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // ✅ Prevenir propagación
    if (!isLockedByParent) {
      setShape({
        ...shape,
        isLocked: !shape.isLocked,
      });
    }
  };

  // Función para manejar el toggle de visible
  const handleVisibilityToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // ✅ Prevenir propagación
    if (!isHiddenByParent) {
      setShape({
        ...shape,
        visible: !shape.visible,
      });
    }
  };

  // ✅ Handler mejorado para el drag
  const handleDragStart = (e: React.PointerEvent) => {
    e.stopPropagation(); // Prevenir que el evento se propague al padre
    dragControls.start(e);
  };

  return (
    <>
      <section
        id={shape.id + ` ${shape.tool}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={css({
          color: "text",
          height: 30,
          fontSize: "sm",
          listStyle: "none",
          display: "grid",
          padding: "md",
          gridTemplateColumns: "10px 15px 15px 120px 50px",
          gap: "4",
          flexDirection: "row",
          alignItems: "center",
          borderRadius: "4",
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
          userSelect: "none",
          width: 235,
        })}
        onClick={(e) => {
          e.preventDefault(); // puedes dejar esto si quieres
          e.stopPropagation();
          setTool("MOVE");
          setShapeId(shape?.id);
        }}
      >
        {/* ✅ Drag Handle mejorado */}
        <div
          className={css({
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "grab",
            _active: {
              cursor: "grabbing",
            },
          })}
          onPointerDown={handleDragStart} // ✅ Usar el handler mejorado
        >
          <GripVertical size={14} opacity={isHovered ? 1 : 0.3} />
        </div>

        {shape.tool === "GROUP" && children.length > 0 ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded((prev) => !prev);
            }}
            className={css({
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
          <div></div>
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
      </section>

      {/* ✅ Sección de children mejorada */}
      {children?.length > 0 && isExpanded && (
        <div
          style={{
            marginLeft: "15px",
          }}
          // ✅ Prevenir propagación de eventos de drag en el contenedor
          onPointerDown={(e) => {
            // Solo prevenir si el evento viene del contenedor mismo, no de los hijos
            if (e.target === e.currentTarget) {
              e.stopPropagation();
            }
          }}
        >
          <Reorder.Group
            axis="y"
            values={children}
            onReorder={handleReorder}
            style={{
              display: "flex",
              flexDirection: "column",
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
            layoutScroll={false}
          >
            {children.map((childItem) => (
              <DraggableNodeItem
                key={childItem.id}
                childItem={childItem}
                childOptions={childOptions}
              />
            ))}
          </Reorder.Group>
        </div>
      )}
    </>
  );
};
