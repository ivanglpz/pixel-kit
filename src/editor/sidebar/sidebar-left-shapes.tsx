import { Nodes } from "@/editor/components/Nodes";
import ALL_SHAPES_ATOM from "@/editor/states/shapes";
import { UPDATE_UNDO_REDO } from "@/editor/states/undo-redo";
import { Reorder, useDragControls } from "framer-motion";
import { useAtom, useSetAtom } from "jotai";
import React from "react";

// ✅ Componente wrapper para elementos de nivel superior
const DraggableRootItem = ({ item }: { item: any }) => {
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
};

export const SidebarLeftShapes = () => {
  const [ALL_SHAPES, SET_ALL_SHAPES] = useAtom(ALL_SHAPES_ATOM);
  const setUpdateUndoRedo = useSetAtom(UPDATE_UNDO_REDO);

  const handleReorder = (newOrder: typeof ALL_SHAPES) => {
    SET_ALL_SHAPES(newOrder);
    setUpdateUndoRedo();
  };

  const handleDropOutside = (e: React.DragEvent) => {
    e.preventDefault();
  };

  console.log(ALL_SHAPES, "ALL_SHAPES");

  return (
    <div onDrop={handleDropOutside} onDragOver={(e) => e.preventDefault()}>
      <Reorder.Group
        axis="y"
        values={ALL_SHAPES}
        onReorder={handleReorder}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
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
