import React, { useRef, useState } from "react";

type Box = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

export default function App() {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [creatingBox, setCreatingBox] = useState<Box | null>(null);
  const offset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseDownCanvas = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return; // no crear encima de otro box
    const rect = e.currentTarget.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    setCreatingBox({
      id: Date.now(),
      x: startX,
      y: startY,
      width: 0,
      height: 0,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    // redimensionar box en creación
    if (creatingBox) {
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;
      const newBox = {
        ...creatingBox,
        x: Math.min(creatingBox.x, currentX),
        y: Math.min(creatingBox.y, currentY),
        width: Math.abs(currentX - creatingBox.x),
        height: Math.abs(currentY - creatingBox.y),
      };
      setCreatingBox(newBox);
    }

    // mover box existente
    if (draggingId !== null) {
      const newX = e.clientX - rect.left - offset.current.x;
      const newY = e.clientY - rect.top - offset.current.y;
      setBoxes((prev) =>
        prev.map((box) =>
          box.id === draggingId ? { ...box, x: newX, y: newY } : box
        )
      );
    }
  };

  const handleMouseUpCanvas = () => {
    if (creatingBox && creatingBox.width > 5 && creatingBox.height > 5) {
      setBoxes((prev) => [...prev, creatingBox]);
    }
    setCreatingBox(null);
    setDraggingId(null);
  };

  const handleMouseDownBox = (
    e: React.MouseEvent<HTMLDivElement>,
    id: number
  ) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setDraggingId(id);
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        border: "1px solid black",
        position: "relative",
      }}
      onMouseDown={handleMouseDownCanvas}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpCanvas}
    >
      {boxes.map((box) => (
        <div
          key={box.id}
          onMouseDown={(e) => handleMouseDownBox(e, box.id)}
          style={{
            position: "absolute",
            top: box.y,
            left: box.x,
            width: box.width,
            height: box.height,
            backgroundColor: "red",
            cursor: "move",
            overflowY: "scroll",
            overflowX: "hidden",
            padding: 20,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius
            mollitia libero ratione? Labore, libero obcaecati mollitia eos at
            cumque error eum quaerat velit fugit. Eaque sapiente voluptates
            recusandae repellat similique?
          </p>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius
            mollitia libero ratione? Labore, libero obcaecati mollitia eos at
            cumque error eum quaerat velit fugit. Eaque sapiente voluptates
            recusandae repellat similique?
          </p>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius
            mollitia libero ratione? Labore, libero obcaecati mollitia eos at
            cumque error eum quaerat velit fugit. Eaque sapiente voluptates
            recusandae repellat similique?
          </p>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius
            mollitia libero ratione? Labore, libero obcaecati mollitia eos at
            cumque error eum quaerat velit fugit. Eaque sapiente voluptates
            recusandae repellat similique?
          </p>
          <input type="text" style={{}} />
        </div>
      ))}
      {creatingBox && (
        <div
          style={{
            position: "absolute",
            top: creatingBox.y,
            left: creatingBox.x,
            width: creatingBox.width,
            height: creatingBox.height,
            backgroundColor: "rgba(135, 206, 235, 0.5)",
            border: "1px dashed blue",
          }}
        />
      )}
    </div>
  );
}
