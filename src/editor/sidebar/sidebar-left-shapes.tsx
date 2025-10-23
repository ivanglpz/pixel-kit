import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Nodes, withStableIcon } from "@/editor/components/Nodes";
import ALL_SHAPES_ATOM, {
  ALL_SHAPES,
  DELETE_ALL_SHAPES_ATOM,
  MOVE_SHAPES_TO_ROOT,
} from "@/editor/states/shapes";
import { UPDATE_UNDO_REDO } from "@/editor/states/undo-redo";
import { css } from "@stylespixelkit/css";
import { Reorder, useDragControls } from "framer-motion";
import { useAtom, useSetAtom } from "jotai";
import { Move, Trash } from "lucide-react";
import { useAutoSave } from "../hooks/useAutoSave";
// ✅ Componente wrapper para elementos de nivel superior
const DraggableRootItem = withStableIcon(({ item }: { item: ALL_SHAPES }) => {
  const rootDragControls = useDragControls();

  return (
    <Reorder.Item
      key={item.id}
      value={item}
      dragListener={false} // ✅ Deshabilitar listener automático
      dragControls={rootDragControls} // ✅ Usar controles manuales
      style={{
        borderRadius: "6px",
        userSelect: "none",
      }}
      whileDrag={{
        scale: 1.02,
        boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
        zIndex: 1000,
      }}
    >
      <Nodes shape={item} dragControls={rootDragControls} />
    </Reorder.Item>
  );
});

export const SidebarLeftShapes = () => {
  const [ALL_SHAPES, SET_ALL_SHAPES] = useAtom(ALL_SHAPES_ATOM);
  const setUpdateUndoRedo = useSetAtom(UPDATE_UNDO_REDO);
  const setmove = useSetAtom(MOVE_SHAPES_TO_ROOT);
  const { debounce } = useAutoSave();

  const handleReorder = (newOrder: typeof ALL_SHAPES) => {
    SET_ALL_SHAPES(newOrder);
    setUpdateUndoRedo();
    debounce.execute();
  };
  const clearAll = useSetAtom(DELETE_ALL_SHAPES_ATOM);

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      className={css({
        overflow: "scroll",
      })}
    >
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="py-1">
            <p
              className={css({
                fontSize: "sm",
                fontWeight: 600,
              })}
            >
              Shapes
            </p>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            className="text-[12px]"
            onClick={() => {
              setmove();
              debounce.execute();
            }}
          >
            <Move size={14} />
            Move to
          </ContextMenuItem>
          <ContextMenuItem
            className="text-[12px]"
            onClick={() => {
              clearAll();
              debounce.execute();
            }}
          >
            <Trash size={14} />
            Clear All
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <Reorder.Group
        axis="y"
        values={ALL_SHAPES}
        onReorder={handleReorder}
        style={{
          display: "flex",
          flexDirection: "column",
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        {ALL_SHAPES.map((item, index) => (
          <DraggableRootItem
            key={`pixel-kit-sidebar-left-shape-${item.id}-${index}`}
            item={item}
          />
        ))}
      </Reorder.Group>
    </div>
  );
};
