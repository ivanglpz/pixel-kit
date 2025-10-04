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
import { Folders, Trash } from "lucide-react";
import { ContextMenu, useContextMenu } from "../components/context-menu";
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

  const { open } = useContextMenu();

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      className={css({
        overflow: "scroll",
      })}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        open("sidebar-left-shapes", e.clientX, e.clientY);
      }}
    >
      <ContextMenu
        id={"sidebar-left-shapes"}
        options={[
          {
            label: "Move to root",
            icon: <Folders size={14} />,
            onClick: () => {
              setmove();
              debounce.execute();
            },
            isEnabled: true,
          },
          {
            label: "Clear All",
            icon: <Trash size={14} />,
            onClick: () => {
              clearAll();
              debounce.execute();
            },
            isEnabled: true,
          },
        ]}
      />
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
        {ALL_SHAPES.map((item) => (
          <DraggableRootItem key={item.id} item={item} />
        ))}
      </Reorder.Group>
    </div>
  );
};
