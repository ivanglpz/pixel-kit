import { Reorder } from "framer-motion";
import React, { useState } from "react";

interface Item {
  id: string;
  content: string;
}

const initialItems: Item[] = [
  { id: "1", content: "Item 1" },
  { id: "2", content: "Item 2" },
  { id: "3", content: "Item 3" },
  { id: "4", content: "Item 4" },
];

const VerticalReorderList: React.FC = () => {
  const [items, setItems] = useState<Item[]>(initialItems);

  return (
    <div style={{ width: "300px", margin: "20px auto" }}>
      <Reorder.Group
        axis="y"
        values={items}
        onReorder={setItems}
        style={{ display: "flex", flexDirection: "column", gap: "8px" }}
      >
        {items.map((item) => (
          <Reorder.Item
            key={item.id}
            value={item}
            style={{
              padding: "12px",
              backgroundColor: "#f0f0f0",
              borderRadius: "6px",
              cursor: "grab",
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }}
          >
            {item.content}
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
};

export default VerticalReorderList;
