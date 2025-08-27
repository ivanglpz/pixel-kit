import { Nodes } from "@/editor/components/Nodes";
import { CHANGE_PARENTID_NODE_ATOM } from "@/editor/states/nodes";
import ALL_SHAPES_ATOM from "@/editor/states/shapes";
import { UPDATE_UNDO_REDO } from "@/editor/states/undo-redo";
import { Reorder } from "framer-motion";
import { useAtom, useSetAtom } from "jotai";
import React from "react";

export const SidebarLeftShapes = () => {
  const [ALL_SHAPES, SET_ALL_SHAPES] = useAtom(ALL_SHAPES_ATOM);
  const SET_PARENT_CHANGE = useSetAtom(CHANGE_PARENTID_NODE_ATOM);
  const setUpdateUndoRedo = useSetAtom(UPDATE_UNDO_REDO);

  const handleReorder = (newOrder: typeof ALL_SHAPES) => {
    // Actualizar el orden de los shapes
    SET_ALL_SHAPES(newOrder);
    // Opcional: registrar en undo/redo
    setUpdateUndoRedo();
  };

  const handleDropOutside = (e: React.DragEvent) => {
    e.preventDefault();
    SET_PARENT_CHANGE({ endId: null });
  };

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
          listStyle: "none", // Importante para evitar bullets
          margin: 0,
          padding: 0,
        }}
      >
        {ALL_SHAPES.map((item) => (
          <Reorder.Item
            key={item.id}
            value={item} // Pasar el objeto completo, no solo el ID
            style={{
              borderRadius: "6px",
              cursor: "grab",
              userSelect: "none", // Prevenir selección de texto durante drag
            }}
            whileDrag={{
              scale: 1.02,
              boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
              zIndex: 1000,
            }}
          >
            <Nodes listShapes={ALL_SHAPES} shape={item} />
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
};
