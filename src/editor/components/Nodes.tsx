import { iconsWithTools } from "@/editor/icons/tool-icons";
import { css } from "@stylespixelkit/css";
import { DragControls, Reorder, useDragControls } from "framer-motion";
import { useAtom, useSetAtom } from "jotai";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import * as Luicde from "lucide-react";
import { ComponentType, memo, useMemo, useState } from "react";
import { constants } from "../constants/color";
import { useAutoSave } from "../hooks/useAutoSave";
import { flexLayoutAtom } from "../shapes/layout-flex";
import { SHAPE_IDS_ATOM } from "../states/shape";
import {
  ALL_SHAPES,
  DELETE_SHAPES_ATOM,
  MOVE_SHAPES_BY_ID,
} from "../states/shapes";
import TOOL_ATOM, { PAUSE_MODE_ATOM } from "../states/tool";
import { UPDATE_UNDO_REDO } from "../states/undo-redo";
import { Input } from "./input";

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
export function withStableIcon<T extends object>(Icon: ComponentType<T>) {
  return memo((props: T) => <Icon {...props} />);
}

const Group = withStableIcon(Luicde.Group);
const ChevronDown = withStableIcon(Luicde.ChevronDown);
const ChevronRight = withStableIcon(Luicde.ChevronRight);
const DotIcon = withStableIcon(Luicde.Circle);
const Eye = withStableIcon(Luicde.Eye);
const EyeClosed = withStableIcon(Luicde.EyeOff);
const FolderCog = withStableIcon(Luicde.FolderCog);
const GripVertical = withStableIcon(Luicde.GripVertical);
const Lock = withStableIcon(Luicde.Lock);
const Trash = withStableIcon(Luicde.Trash);
const Unlock = withStableIcon(Luicde.Unlock);
export const NodesDefault = ({
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
  const applyLayout = useSetAtom(flexLayoutAtom);
  const DELETE_SHAPE = useSetAtom(DELETE_SHAPES_ATOM);
  const setMove = useSetAtom(MOVE_SHAPES_BY_ID);

  // ✅ Usar controles externos si están disponibles, sino crear propios
  const dragControls = externalDragControls;

  // Determinar si este elemento está bloqueado por herencia
  const isLockedByParent = options.isLockedByParent || false;
  const isHiddenByParent = options.isHiddenByParent || false;

  // Para los hijos, determinar qué propiedades heredar
  const childOptions = useMemo(() => {
    return {
      isLockedByParent: isLockedByParent || shape.isLocked,
      isHiddenByParent: isHiddenByParent || !shape.visible,
      id: shape.id,
      parentId: shape.parentId,
    };
  }, [isLockedByParent, isHiddenByParent, shape.isLocked, shape.visible]);

  const [children, setChildren] = useAtom(shape.children);
  const { debounce } = useAutoSave();

  const handleReorder = (newOrder: typeof children) => {
    if (!childOptions.id) return;

    applyLayout({ id: childOptions.id });
    setChildren(newOrder);
    setUpdateUndoRedo();
    debounce.execute();
  };

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
      <ContextMenu>
        <ContextMenuTrigger>
          <div
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
              gridTemplateColumns: "15px 15px 15px 120px 50px",
              gap: "4",
              flexDirection: "row",
              alignItems: "center",
              borderRadius: "4",
              _dark: {
                backgroundColor: shapeId.some((w) => w.id === shape.id)
                  ? "gray.600"
                  : "transparent",
              },
              backgroundColor: shapeId.some((w) => w.id === shape.id)
                ? "gray.200"
                : "transparent",
              _hover: {
                backgroundColor: "gray.100",
                _dark: {
                  backgroundColor: "gray.800",
                },
              },
              cursor: "pointer",
              userSelect: "none",
              width: 240,
            })}
            onClick={(e) => {
              e.preventDefault(); // puedes dejar esto si quieres
              e.stopPropagation();
              setTool("MOVE");
              setShapeId({
                id: shape?.id,
                parentId: shape.parentId,
              });
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

            {shape.tool === "FRAME" && children.length > 0 ? (
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
                <Input.withPause>
                  <Input.Text
                    value={shape?.label}
                    onChange={(e) => {
                      setShape({ ...shape, label: e });
                      debounce.execute();
                    }}
                    style={{
                      width: "auto",
                      border: "none",
                      backgroundColor: "transparent",
                      color: "text",
                      paddingLeft: "0px",
                      padding: "sm",
                      height: "15px",
                      borderRadius: "0px",
                      fontSize: "x-small",
                    }}
                  />
                </Input.withPause>
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
                          <Lock
                            size={14}
                            color={constants.theme.colors.primary}
                          />
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
                      <EyeClosed
                        size={14}
                        color={constants.theme.colors.primary}
                      />
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
        </ContextMenuTrigger>
        <ContextMenuContent>
          {shape.tool === "FRAME" ? (
            <ContextMenuItem
              className="text-[12px]"
              onClick={() => {
                setMove(shape.id);
                debounce.execute();
              }}
            >
              <Luicde.Move size={14} />
              Move to
            </ContextMenuItem>
          ) : null}
          <ContextMenuItem
            className="text-[12px]"
            onClick={() => setShow(true)}
          >
            <FolderCog size={14} />
            Rename
          </ContextMenuItem>
          <ContextMenuItem
            className="text-[12px]"
            onClick={() => {
              setTool("MOVE");
              DELETE_SHAPE();
              debounce.execute();
            }}
          >
            <Trash size={14} />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* ✅ Sección de children mejorada */}
      {children?.length > 0 && isExpanded && (
        <Reorder.Group
          axis="y"
          values={children}
          onReorder={handleReorder}
          style={{
            display: "flex",
            flexDirection: "column",
            listStyle: "none",
            margin: 0,
            marginLeft: "20px",
            padding: 0,
          }}
          layoutScroll={false}
        >
          {children.map((childItem, index) => (
            <DraggableNodeItem
              key={`pixel-kit-node-child-${childItem.id}-${shape.id}-${String(shape.parentId)}-${index}`}
              childItem={childItem}
              childOptions={childOptions}
            />
          ))}
        </Reorder.Group>
      )}
    </>
  );
};
export const Nodes = withStableIcon(NodesDefault);
